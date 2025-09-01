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
          <h2 className="text-3xl font-bold text-primary">Why Choose Us?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <FeatureCard icon={Leaf} title="100% Natural" description="Made with the finest, all-natural ingredients with no preservatives." />
          <FeatureCard icon={Sun} title="Mediterranean Taste" description="An authentic flavor that transports you to the sunny coasts of Tunisia." />
          <FeatureCard icon={Heart} title="Handmade Quality" description="Crafted with passion and care in small batches for the perfect crunch." />
          <FeatureCard icon={Truck} title="Direct to You" description="From our artisanal kitchen directly to your table, ensuring freshness." />
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;