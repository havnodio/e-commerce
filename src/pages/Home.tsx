import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";
import HeroSection from "@/components/HeroSection";
import Gallery from "@/components/Gallery";
import WhyChooseUs from "@/components/WhyChooseUs";

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
      <HeroSection />

      <Gallery />

      <WhyChooseUs />

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