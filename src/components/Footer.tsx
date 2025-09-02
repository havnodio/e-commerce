import { Facebook, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Gusto Glub Taralli</h3>
            <p className="mt-2 text-gray-600">Authentic Italian snacks, made with love in Tunis.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="/about" className="text-gray-600 hover:text-gray-900">About Us</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a></li>
              <li><a href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Follow Us</h3>
            <div className="flex mt-2 space-x-4">
              <a href="https://www.facebook.com/GustoClubOfficial/" className="text-gray-600 hover:text-gray-900"><Facebook /></a>
              <a href="https://www.instagram.com/gustoclubofficial/" className="text-gray-600 hover:text-gray-900"><Instagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Gusto Glub Taralli Production. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
