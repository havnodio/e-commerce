import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Order, CartItem, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, Minus, Trash2, AlertCircle, ShoppingBag } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProductSelector = ({ currentItems, onAddProduct }: { currentItems: CartItem[], onAddProduct: (product: Product) => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('name');
      if (error) console.error("Error fetching products:", error);
      else setProducts(data as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const currentItemIds = useMemo(() => new Set(currentItems.map(item => item.id)), [currentItems]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><ShoppingBag className="mr-2 h-4 w-4" /> Add Products</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Products to Order</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          {loading ? <p>Loading products...</p> : (
            <div className="space-y-2">
              {products.map(product => (
                <div key={product.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary">
                  <div className="flex items-center gap-4">
                    <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.price.toFixed(2)} DT</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAddProduct(product)}
                    disabled={currentItemIds.has(product.id)}
                  >
                    {currentItemIds.has(product.id) ? 'Added' : 'Add'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const EditOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError || !orderData) {
        setError("Order not found.");
        setLoading(false);
        return;
      }

      if (orderData.status !== 'Pending') {
        setError("This order has already been processed and cannot be modified.");
        setOrder(orderData as Order);
        setLoading(false);
        return;
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('quantity, price, products(*)')
        .eq('order_id', orderId);

      if (itemsError) {
        setError("Could not fetch order items.");
      } else {
        const formattedItems: CartItem[] = itemsData.map((item: any) => ({
          id: item.products.id,
          name: item.products.name,
          price: Number(item.price),
          quantity: item.quantity,
          image_url: item.products.image_url,
        }));
        setItems(formattedItems);
      }

      setOrder(orderData as Order);
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (productId: number) => {
    setItems(items.filter(item => item.id !== productId));
  };

  const addProduct = (product: Product) => {
    if (items.find(item => item.id === product.id)) {
      showError("Product is already in the order.");
      return;
    }
    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    };
    setItems([...items, newItem]);
  };

  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const handleSaveChanges = async () => {
    if (!orderId) return;
    setIsSaving(true);
    try {
      const itemsToSave = items.map(({ id, quantity }) => ({ id, quantity }));
      const { error } = await supabase.functions.invoke('update-order', {
        body: { orderId, items: itemsToSave },
      });
      if (error) throw new Error(error.message);
      showSuccess("Order updated successfully!");
      navigate('/orders');
    } catch (err: any) {
      showError(err.message || "Failed to update order.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-12 text-center">Loading order details...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Order</CardTitle>
          <CardDescription>
            Order ID: <span className="font-mono">{orderId?.substring(0, 8)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end">
                <ProductSelector currentItems={items} onAddProduct={addProduct} />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} DT</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                            className="w-16 text-center"
                          />
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{(item.price * item.quantity).toFixed(2)} DT</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator />
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>New Total</span>
                    <span>{cartTotal.toFixed(2)} DT</span>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditOrderPage;