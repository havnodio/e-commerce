import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Order } from "@/types";
import { format } from 'date-fns';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="container mx-auto py-12 text-center">Chargement des commandes...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Mes Commandes</CardTitle>
          <CardDescription>Voici la liste de vos commandes récentes.</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Vous n'avez encore passé aucune commande.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Commande</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium font-mono text-xs">{order.id.substring(0, 8)}</TableCell>
                    <TableCell>{format(new Date(order.created_at), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === 'Livrée' ? 'default' : 
                        order.status === 'Expédiée' ? 'secondary' : 'outline'
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{Number(order.total).toFixed(2)} DT</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;