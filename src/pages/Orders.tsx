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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } => "react-i18next";

const OrdersPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!user) {
      console.log('OrdersPage: No user, skipping order fetch.'); // Added log
      setLoading(false);
      return;
    };
    console.log('OrdersPage: Fetching orders for user:', user.id); // Added log
    setLoading(true);
    let query = supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (searchTerm) {
      query = query.ilike('id', `%${searchTerm}%`);
    }

    if (filterStatus && filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error("OrdersPage: Error fetching orders:", error); // Added log
    } else if (data) {
      console.log('OrdersPage: Orders data fetched:', data); // Added log
      setOrders(data as Order[]);
    }
    setLoading(false);
    console.log('OrdersPage: Loading set to false'); // Added log
  };

  useEffect(() => {
    fetchOrders();
  }, [user, searchTerm, filterStatus]); // Re-fetch orders when user, search term, or filter status changes

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm(t("orders_page.confirm_cancel"))) return;

    try {
      const { error } = await supabase.functions.invoke('cancel-order', {
        body: { orderId },
      });

      if (error) throw new Error(error.message);

      showSuccess(t("orders_page.order_cancelled_success"));
      fetchOrders(); // Refresh the orders list
    } catch (error: any) {
      showError(error.message || t("orders_page.order_cancel_failed"));
    }
  };

  if (loading) {
    return <div className="container mx-auto py-12 text-center">{t("orders_page.loading_orders")}</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("orders_page.my_orders")}</CardTitle>
          <CardDescription>{t("orders_page.list_of_orders")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder={t("orders_page.filter_by_id")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="max-w-[180px]">
                <SelectValue placeholder={t("orders_page.filter_by_status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("orders_page.all_statuses")}</SelectItem>
                <SelectItem value="Pending">{t("orders_page.status_pending")}</SelectItem>
                <SelectItem value="Shipped">{t("orders_page.status_shipped")}</SelectItem>
                <SelectItem value="Delivered">{t("orders_page.status_delivered")}</SelectItem>
                <SelectItem value="Cancelled">{t("orders_page.status_cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t("orders_page.no_orders_yet")}</p>
          ) : (
            <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("orders_page.order_id")}</TableHead>
                    <TableHead>{t("orders_page.date")}</TableHead>
                    <TableHead>{t("orders_page.status")}</TableHead>
                    <TableHead className="text-right">{t("orders_page.total")}</TableHead>
                    <TableHead className="text-right">{t("orders_page.actions")}</TableHead>
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
                            {t("orders_page.view_details")}
                          </Button>
                        </DialogTrigger>
                        {order.status === 'Pending' && (
                          <>
                            <Button asChild variant="secondary" size="sm">
                              <Link to={`/orders/${order.id}/edit`}>{t("orders_page.edit")}</Link>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleCancelOrder(order.id)}>
                              {t("orders_page.cancel")}
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
                    <DialogTitle>{t("orders_page.order_details")}</DialogTitle>
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