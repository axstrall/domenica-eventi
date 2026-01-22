import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative bg-transparent py-16 px-4 text-center">
      <h1 className="text-4xl font-serif text-slate-800 sm:text-6xl tracking-tight">
        Sfoglia il nostro catalogo
      </h1>
      <div className="h-0.5 w-20 bg-rose-200 mx-auto mt-6"></div>
      <p className="mt-8 max-w-2xl mx-auto text-lg text-gray-500 font-light">
        Scopri la nostra collezione esclusiva di articoli e decorazioni premium.
      </p>
      <div className="mt-12">
        <Link to="/catalog" className="inline-flex px-10 py-4 text-sm font-bold rounded-full text-white bg-rose-400 hover:bg-rose-500 shadow-lg uppercase">
          Scopri la collezione
        </Link>
      </div>
    </div>
  );
}