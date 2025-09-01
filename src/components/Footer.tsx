import { Mountain } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-muted py-6 w-full">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Mountain className="h-6 w-6 mr-2" />
          <span className="text-lg font-semibold">Gusto Glub Taralli</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
          <Link to="/about" className="hover:underline">About Us</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <Link to="/terms" className="hover:underline">Terms of Service</Link>
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </nav>
        <div className="mt-4 md:mt-0">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Gusto Glub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};