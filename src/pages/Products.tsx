import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';

const ProductsPage = () => {
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
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;