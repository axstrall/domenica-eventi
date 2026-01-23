import React from 'react';
import { useNavigate } from 'react-router-dom';

const brands = [
  'Hervit', 'Blanc Mariclò', 'Enzo de Gasperi', 
  'Mathilde M', 'Brandani', 'Nuvole di Stoffa', 'Chez Moi Italia'
];

export function BrandBar() {
  const navigate = useNavigate();

  return (
    <div className="bg-white/40 backdrop-blur-sm border-y border-rose-100 py-8 my-10">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-rose-400 font-serif italic mb-6 tracking-widest uppercase text-sm">I Nostri Marchi Esclusivi</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => navigate(`/catalog?brand=${encodeURIComponent(brand)}`)}
              className="text-gray-700 font-serif text-lg md:text-xl hover:text-rose-500 transition-all hover:scale-110 tracking-wide uppercase"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}