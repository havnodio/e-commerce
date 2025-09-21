import React from 'react';
import { Leaf, Heart, Sun, Truck } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="text-center">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
      <Icon className="h-8 w-8" />
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </div>
);

const WhyChooseUs = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Pourquoi Nous Choisir&nbsp;?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <FeatureCard icon={Leaf} title="100% Naturel" description="Préparé avec les meilleurs ingrédients naturels, sans conservateurs." />
          <FeatureCard icon={Sun} title="Saveur Méditerranéenne" description="Un goût authentique qui vous transporte sur les côtes ensoleillées de la Tunisie." />
          <FeatureCard icon={Heart} title="Qualité Artisanale" description="Élaboré avec passion et soin en petites quantités pour un croquant parfait." />
          <FeatureCard icon={Truck} title="Directement Chez Vous" description="De notre cuisine artisanale directement à votre table, en garantissant la fraîcheur." />
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
