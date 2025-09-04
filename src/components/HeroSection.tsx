import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const HeroSection = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <img 
        src="https://i.imgur.com/BNsfW0H.png" 
        alt="Basket of taralli" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-20 p-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          {t('hero_section.title')}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
          {t('hero_section.description')}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/products">{t('hero_section.discover_products')}</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/products">{t('hero_section.order_now')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;