import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { CartItem, Product } from '@/types';
import { showSuccess, showError } from '@/utils/toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  itemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const { description, category, ...cartProduct } = product;
        return [...prevItems, { ...cartProduct, quantity: 1 }];
      }
    });
    showSuccess(`${product.name} a été ajouté au panier !`);
  };

  const decrementQuantity = (productId: number) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          // Si la quantité est 1, on ne fait rien pour l'instant, l'utilisateur doit utiliser le bouton supprimer.
          // On pourrait aussi le supprimer directement.
          return item;
        }
        return item;
      }).filter(item => item.quantity > 0); // S'assure de retirer les articles si la quantité tombe à 0
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    showError('Article supprimé du panier.');
  };

  const itemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, decrementQuantity, itemCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
  }
  return context;
};