import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { SheetHeader, SheetTitle, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Separator } from './ui/separator';

const CartSheetContent = () => {
  const { cartItems, removeFromCart, addToCart, decrementQuantity, cartTotal, itemCount } = useCart();

  return (
    <>
      <SheetHeader>
        <SheetTitle>Mon Panier ({itemCount})</SheetTitle>
        <SheetDescription>
          Voici les articles dans votre panier.
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col h-full">
        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Votre panier est vide.</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 my-4 pr-4">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} DT</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => decrementQuantity(item.id)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => addToCart(item)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{cartTotal.toFixed(2)} DT</span>
                </div>
                <Button className="w-full" size="lg">Passer à la caisse</Button>
              </div>
            </SheetFooter>
          </>
        )}
      </div>
    </>
  );
};

export default CartSheetContent;