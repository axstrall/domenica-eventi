import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative bg-white py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-serif text-gray-900 sm:text-5xl md:text-6xl">
          Sfoglia il nostro catalogo
        </h1>
        <p className="mt-5 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:text-xl md:max-w-3xl">
          Scopri la nostra collezione esclusiva di articoli e decorazioni premium per rendere il tuo evento indimenticabile.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-rose-500 hover:bg-rose-600 shadow-lg transition-all"
          >
            Scopri il nostro catalogo
          </Link>
        </div>
      </div>
    </div>
  );
}