import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import ProductsPage from "./pages/Products";
import { CartProvider } from "./contexts/CartContext";
import AccountPage from "./pages/Account";
import OrdersPage from "./pages/Orders";
import SettingsPage from "./pages/Settings";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import EditOrderPage from "./pages/EditOrder";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ThemeProvider } from './contexts/ThemeContext';
import React, { useState, useEffect } from 'react'; // Import React and hooks
import GustoIntro from './components/GustoIntro'; // Import the new intro component

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Calculate total intro duration: 3s delay for second text + ~0.7s animation duration
    const totalIntroDuration = 4000; // 4 seconds to be safe
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, totalIntroDuration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <I18nextProvider i18n={i18n}>
                <ThemeProvider>
                  <Toaster />
                  <Sonner position="bottom-left" />
                  {showIntro ? (
                    <GustoIntro />
                  ) : (
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />

                      <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/products" element={<ProductsPage />} />

                        <Route element={<ProtectedRoute />}>
                          <Route path="/account" element={<AccountPage />} />
                          <Route path="/orders" element={<OrdersPage />} />
                          <Route path="/orders/:orderId/edit" element={<EditOrderPage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                        </Route>

                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  )}
                </ThemeProvider>
              </I18nextProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;