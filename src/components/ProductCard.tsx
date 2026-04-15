import { useState } from 'react'; // Aggiunto per gestire l'apertura dello zoom
import { MessageCircle, ZoomIn, X } from 'lucide-react';
import type { Product } from '../lib/database.types';

interface ProductCardProps {
  product: Product;
  onRequestQuote: (product: Product) => void;
}

export function ProductCard({ product, onRequestQuote }: ProductCardProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false); // Stato per lo zoom
  const hasDiscount = product.discount_price !== null && product.discount_price > 0;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
        {/* AREA IMMAGINE CON ZOOM */}
        <div 
          className="relative overflow-hidden aspect-square cursor-zoom-in"
          onClick={() => setIsZoomOpen(true)}
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Overlay lente d'ingrandimento al passaggio del mouse */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/80 p-2 rounded-full shadow-lg">
              <ZoomIn className="text-rose-400" size={24} />
            </div>
          </div>

          {/* Etichetta Sconto */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse z-10">
              SCONTO
            </span>
          )}
          
          {product.is_featured && (
            <span className="absolute top-3 right-3 bg-rose-400 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
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
              <p className="text-xs text-gray-500">Prezzo</p>
              <div className="flex flex-col">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl font-bold text-red-600">
                      €{product.discount_price?.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      €{product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-semibold text-gray-800">
                    €{product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => onRequestQuote(product)}
              className="bg-rose-400 hover:bg-rose-500 text-white px-5 py-2.5 rounded-full transition-colors duration-200 flex items-center space-x-2 font-bold shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Contattaci</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODALE PER LO ZOOM (LIGHTBOX) */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setIsZoomOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-rose-400 transition-colors z-[1000]"
            onClick={() => setIsZoomOpen(false)}
          >
            <X size={40} />
          </button>
          
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} // Impedisce la chiusura se clicchi sull'immagine stessa
          />
        </div>
      )}
    </>
  );
}