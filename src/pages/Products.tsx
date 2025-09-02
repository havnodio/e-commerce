import { ProductCard } from '@/components/ProductCard';
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');
      
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
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Our Products
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Discover our full range of authentic, handmade taralli.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
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

export default ProductsPage;