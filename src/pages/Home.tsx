import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import HeroSection from "@/components/HeroSection";
import Gallery from "@/components/Gallery";
import WhyChooseUs from "@/components/WhyChooseUs";

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
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;