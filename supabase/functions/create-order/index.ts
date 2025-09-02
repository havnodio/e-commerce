import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not found");
    }

    const { items } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided");
    }

    const productIds = items.map(item => item.id);
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, price')
      .in('id', productIds);

    if (productsError) throw productsError;

    const priceMap = new Map(products.map(p => [p.id, parseFloat(p.price)]));
    let total = 0;
    const orderItemsData = items.map(item => {
      const price = priceMap.get(item.id);
      if (price === undefined) {
        throw new Error(`Product with ID ${item.id} not found.`);
      }
      total += price * item.quantity;
      return {
        product_id: item.id,
        quantity: item.quantity,
        price: price,
      };
    });

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: user.id, total: total })
      .select()
      .single();

    if (orderError) throw orderError;

    const finalOrderItems = orderItemsData.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(finalOrderItems);

    if (itemsError) throw itemsError;

    return new Response(JSON.stringify({ orderId: order.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})