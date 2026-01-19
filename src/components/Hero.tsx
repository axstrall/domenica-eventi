import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-rose-50 to-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-serif text-gray-800 mb-6">
          Sfoglia il nostro Catalogo
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Scopri la nostra collezione esclusiva di articoli e decorazioni premium
          per rendere il tuo evento indimenticabile.
        </p>
        <Link
          /* Cambiato da /catalogo a /catalog per corrispondere ad App.tsx */
          to="/catalog" 
          className="inline-block bg-rose-400 hover:bg-rose-500 text-white px-10 py-4 rounded-full shadow-lg hover:shadow-rose-200 font-medium transition-all duration-300 transform hover:-translate-y-1"
        >
          Scopri il nostro catalogo
        </Link>
      </div>
    </div>
  );
}