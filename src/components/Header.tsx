import { ShoppingCart, User, Search, Menu, LogOut, Settings as SettingsIcon, User as UserIcon, CreditCard, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import CartSheetContent from './CartSheetContent';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export const Header = () => {
  const { itemCount } = useCart();
  const { session, user } = useAuth(); // Get user object to check role
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // Initialize useTranslation

  const handleLogout = async () => {
    console.log('Header: Attempting to log out. Current session:', session);
    console.log('Header: Current user:', user);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Header: Logout error:', error);
      showError(t("account_page.logout_error")); // Use translation
    } else {
      console.log('Header: Logout successful.');
      showSuccess(t("account_page.logout_success")); // Use translation
      navigate('/');
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navItems = [
    { name: t('header.home'), href: '/' },
    { name: t('header.products'), href: '/products' },
    { name: t('header.about_us'), href: '/about' },
    { name: t('header.contact'), href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              {t('login_page.gusto_glub')}
            </Link>
          </div>
          <nav className="hidden md:flex md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {i18n.language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-24" align="end">
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('fr')}>
                  Français
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>{t('header.my_account')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/account">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>{t('header.profile')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>{t('header.my_orders')}</span>
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <a href="https://admino-bice.vercel.app" target="_blank" rel="noopener noreferrer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>{t('header.dashboard')}</span>
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span>{t('header.settings')}</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('header.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link to="/login">{t('header.login')}</Link>
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  {itemCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground transform translate-x-1/2 -translate-y-1/2">
                      {itemCount}
                    </span>
                  )}
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
                <CartSheetContent />
              </SheetContent>
            </Sheet>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="text-lg text-gray-600 hover:text-gray-900 font-medium"
                      >
                        {item.name}
                      </Link>
                    ))}
                     {!session && (
                      <>
                        <Link to="/login" className="text-lg text-gray-600 hover:text-gray-900 font-medium">
                          {t('header.login')}
                        </Link>
                        <Link to="/login" className="text-lg text-gray-600 hover:text-gray-900 font-medium">
                          {t('header.signup')}
                        </Link>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};