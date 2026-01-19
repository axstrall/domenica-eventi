import { FileText } from 'lucide-react';
import type { Product } from '../lib/database.types';

interface ProductCardProps {
  product: Product;
  onRequestQuote: (product: Product) => void;
}

export function ProductCard({ product, onRequestQuote }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.is_featured && (
          <span className="absolute top-3 right-3 bg-rose-400 text-white px-3 py-1 rounded-full text-xs font-medium">
            In evidenza
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-serif text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        {product.features && product.features.length > 0 && (
          <ul className="mb-4 space-y-1">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-xs text-gray-500 flex items-center">
                <span className="w-1 h-1 bg-rose-300 rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Prezzo indicativo</p>
            <p className="text-2xl font-semibold text-gray-800">€{product.price.toFixed(2)}</p>
          </div>

          <button
            onClick={() => onRequestQuote(product)}
            className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2.5 rounded-full transition-colors duration-200 flex items-center space-x-2 font-medium"
          >
            <FileText className="h-4 w-4" />
            <span>Preventivo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
