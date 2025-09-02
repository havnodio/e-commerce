import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Order } from "@/types";
import { format } from 'date-fns';
import OrderDetails from "@/components/OrderDetails";
import { Link, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "@/utils/toast";

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    };
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else if (data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const { error } = await supabase.functions.invoke('cancel-order', {
        body: { orderId },
      });

      if (error) throw new Error(error.message);

      showSuccess("Order cancelled successfully.");
      fetchOrders(); // Refresh the orders list
    } catch (error: any) {
      showError(error.message || "Failed to cancel order.");
    }
  };

  if (loading) {
    return <div className="container mx-auto py-12 text-center">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>Here is a list of your recent orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">You haven't placed any orders yet.</p>
          ) : (
            <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium font-mono text-xs">{order.id.substring(0, 8)}</TableCell>
                      <TableCell>{format(new Date(order.created_at), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={
                          order.status === 'Delivered' ? 'default' : 
                          order.status === 'Shipped' ? 'secondary' : 
                          order.status === 'Cancelled' ? 'destructive' : 'outline'
                        }>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{Number(order.total).toFixed(2)} DT</TableCell>
                      <TableCell className="text-right space-x-2">
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                        {order.status === 'Pending' && (
                          <>
                            <Button asChild variant="secondary" size="sm">
                              <Link to={`/orders/${order.id}/edit`}>Edit</Link>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleCancelOrder(order.id)}>
                              Cancel
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {selectedOrder && (
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                  </DialogHeader>
                  <OrderDetails order={selectedOrder} />
                </DialogContent>
              )}
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;