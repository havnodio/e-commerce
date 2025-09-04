import { Facebook, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export const Footer = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{t('footer.title')}</h3>
            <p className="mt-2 text-gray-600">{t('footer.description')}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{t('footer.quick_links')}</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="/about" className="text-gray-600 hover:text-gray-900">{t('header.about_us')}</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-gray-900">{t('header.contact')}</a></li>
              <li><a href="/faq" className="text-gray-600 hover:text-gray-900">{t('footer.faq')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{t('footer.follow_us')}</h3>
            <div className="flex mt-2 space-x-4">
              <a href="https://www.facebook.com/GustoClubOfficial/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Facebook />
              </a>
              <a href="https://www.instagram.com/gustoclubofficial/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Instagram />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-gray-500">
          <p>{t('footer.copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
};