import { ProductCard } from "@/components/ProductCard";
import HeroSection from "@/components/HeroSection";
import Gallery from "@/components/Gallery";
import WhyChooseUs from "@/components/WhyChooseUs";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id')
        .limit(4);
      
      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white">
      <HeroSection />
      <Gallery />
      <WhyChooseUs />
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-12">
            Our Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;