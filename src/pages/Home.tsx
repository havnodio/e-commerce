import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";

const featuredProducts: Product[] = [
  {
    id: 1,
    name: 'Taralli Classici',
    description: 'Classic taralli with extra virgin olive oil.',
    price: 3.50,
    imageUrl: 'https://placehold.co/600x400/F7F3E3/333?text=Taralli+Classici',
    category: 'Classic',
  },
  {
    id: 2,
    name: 'Taralli al Finocchio',
    description: 'Crispy taralli with fennel seeds for a unique flavor.',
    price: 3.75,
    imageUrl: 'https://placehold.co/600x400/EAF2E3/333?text=Taralli+al+Finocchio',
    category: 'Flavored',
  },
  {
    id: 3,
    name: 'Taralli al Peperoncino',
    description: 'Spicy taralli with a hint of chili pepper.',
    price: 3.75,
    imageUrl: 'https://placehold.co/600x400/FCEBEA/333?text=Taralli+al+Peperoncino',
    category: 'Spicy',
  },
    {
    id: 4,
    name: 'Taralli Integrali',
    description: 'Wholesome whole wheat taralli for a healthier snack.',
    price: 4.00,
    imageUrl: 'https://placehold.co/600x400/E8DDCB/333?text=Taralli+Integrali',
    category: 'Healthy',
  },
];

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <img src="https://placehold.co/1920x800/333333/FFFFFF?text=Gusto+Glub+Taralli" alt="Taralli background" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">The Taste of Italy, Made in Tunisia</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Discover our delicious, handcrafted taralli, the perfect snack for any occasion.
          </p>
          <Button size="lg" className="mt-8">Shop Now</Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-12">
            Our Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;