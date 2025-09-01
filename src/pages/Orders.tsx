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

const orders = [
  {
    id: "ORD001",
    date: "2023-10-26",
    status: "Livrée",
    total: "45.00 DT",
  },
  {
    id: "ORD002",
    date: "2023-10-24",
    status: "Expédiée",
    total: "22.50 DT",
  },
  {
    id: "ORD003",
    date: "2023-10-22",
    status: "En cours",
    total: "15.75 DT",
  },
];

const OrdersPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Mes Commandes</CardTitle>
          <CardDescription>Voici la liste de vos commandes récentes.</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'Livrée' ? 'default' : 
                      order.status === 'Expédiée' ? 'secondary' : 'outline'
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;