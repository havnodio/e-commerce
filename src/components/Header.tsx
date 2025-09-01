import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Mountain, Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Mountain className="h-6 w-6" />
          <span className="font-bold">Gusto Glub</span>
        </Link>
        <nav className="hidden flex-1 items-center space-x-4 text-sm font-medium lg:flex">
          <Link to="/" className="text-foreground/60 transition-colors hover:text-foreground/80">Home</Link>
          <Link to="/products" className="text-foreground/60 transition-colors hover:text-foreground/80">Products</Link>
          <Link to="/about" className="text-foreground/60 transition-colors hover:text-foreground/80">About</Link>
          <Link to="/contact" className="text-foreground/60 transition-colors hover:text-foreground/80">Contact</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-6">
                <Link to="/" className="flex w-full items-center py-2 text-lg font-semibold">Home</Link>
                <Link to="/products" className="flex w-full items-center py-2 text-lg font-semibold">Products</Link>
                <Link to="/about" className="flex w-full items-center py-2 text-lg font-semibold">About</Link>
                <Link to="/contact" className="flex w-full items-center py-2 text-lg font-semibold">Contact</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};