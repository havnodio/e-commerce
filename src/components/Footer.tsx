import { Facebook, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t('footer.title')}</h3>
            <p className="mt-2 text-muted-foreground">{t('footer.description')}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t('footer.quick_links')}</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="/about" className="text-muted-foreground hover:text-foreground">{t('header.about_us')}</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-foreground">{t('header.contact')}</a></li>
              <li><a href="/faq" className="text-muted-foreground hover:text-foreground">{t('footer.faq')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t('footer.follow_us')}</h3>
            <div className="flex mt-2 space-x-4">
              <a href="https://www.facebook.com/GustoClubOfficial/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Facebook />
              </a>
              <a href="https://www.instagram.com/gustoclubofficial/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Instagram />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-muted-foreground">
          <p>{t('footer.copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
};