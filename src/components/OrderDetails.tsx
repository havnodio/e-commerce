import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItemDetail } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const [items, setItems] = useState<OrderItemDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!order) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          quantity,
          price,
          products (
            name,
            image_url
          )
        `)
        .eq('order_id', order.id);

      if (error) {
        console.error("Error fetching order items:", error);
      } else if (data) {
        setItems(data as unknown as OrderItemDetail[]);
      }
      setLoading(false);
    };

    fetchOrderItems();
  }, [order]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Order ID: <span className="font-mono">{order.id}</span>
      </p>
      <ScrollArea className="max-h-[400px] pr-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.products.image_url} 
                      alt={item.products.name} 
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <span className="font-medium">{item.products.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">{Number(item.price).toFixed(2)} DT</TableCell>
                <TableCell className="text-right">{(item.quantity * Number(item.price)).toFixed(2)} DT</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <Separator />
      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{Number(order.total).toFixed(2)} DT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;