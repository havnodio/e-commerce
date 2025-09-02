import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not found");
    }

    const { orderId } = await req.json();
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    // Check if the order belongs to the user and is pending
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !order) {
      throw new Error("Order not found or you do not have permission.");
    }

    if (order.status !== 'Pending') {
      throw new Error("Only pending orders can be cancelled.");
    }

    // Update the order status to 'Cancelled'
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'Cancelled' })
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({ message: 'Order cancelled successfully' }), {
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