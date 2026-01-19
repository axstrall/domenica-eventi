import { ProductCard } from './ProductCard';
import type { Product } from '../lib/database.types';

interface ProductGridProps {
  products: Product[];
  onRequestQuote: (product: Product) => void;
  title?: string;
}

export function ProductGrid({ products, onRequestQuote, title }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nessun prodotto trovato in questa categoria</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      {title && (
        <h2 className="text-3xl font-serif text-gray-800 mb-8 text-center">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onRequestQuote={onRequestQuote}
          />
        ))}
      </div>
    </div>
  );
}
