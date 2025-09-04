import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">Our Story</h2>
            <p className="mb-4 text-muted-foreground">
              Gusto Club Tunisie puise son inspiration dans la richesse des saveurs méditerranéennes et l’authenticité du savoir-faire tunisien. Avec des ingrédients simples mais d’une qualité irréprochable, et en respectant des traditions transmises de génération en génération, nous créons des taralli qui transcendent la simple gourmandise pour offrir une véritable expérience gustative.
            </p>
            <p className="text-muted-foreground mb-8">
              Nos valeurs sont simples : Qualité, Tradition et Passion. Chaque fournée est façonnée à la main avec soin, pour garantir à chaque bouchée une expérience croquante et savoureuse.
            </p>
            <div className="space-y-2 text-muted-foreground">
              <h3 className="text-xl font-bold text-primary">Contact Information</h3>
              <p><strong>Emetteur:</strong> TARALLI PRODUCTION</p>
              <p><strong>Email:</strong> Taralliproduction@gmail.com</p>
              <p><strong>Address:</strong> 5 LAHMAM ROUTE SIDI SAAD MORNAG</p>
              <p><strong>Tel:</strong> 31413313</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://i.imgur.com/izhQn5F.png" alt="Traditional Tunisian pottery" className="rounded-lg shadow-md aspect-square object-cover" />
            <img src="https://i.imgur.com/Zs1goZd.png" alt="Handmade bread in a rustic setting" className="rounded-lg shadow-md mt-8 aspect-square object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;