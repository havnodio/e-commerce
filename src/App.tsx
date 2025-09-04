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
import { I18nextProvider } from 'react-i18next'; // Import I18nextProvider
import i18n from './i18n'; // Import your i18n configuration

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <I18nextProvider i18n={i18n}> {/* Wrap with I18nextProvider */}
              <Toaster />
              <Sonner />
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
            </I18nextProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;