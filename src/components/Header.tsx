import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo a Sinistra con Testo Doppia Riga */}
        <Link to="/" className="flex items-center group">
          {/* Cerchio del Logo */}
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-rose-200 shadow-sm transition-all duration-300 group-hover:border-rose-400 group-hover:shadow-[0_0_15px_rgba(251,113,133,0.4)] bg-white">
            <img 
              src="/LogoDomenica.png" 
              alt="Logo Domenica" 
              className="h-full w-full object-cover scale-125 transition-transform duration-500 group-hover:scale-140" 
            />
          </div>

          {/* Testo a due righe */}
          <div className="flex flex-col ml-3 leading-tight hidden sm:flex">
            <span className="font-serif text-2xl text-gray-800 font-bold tracking-tight group-hover:text-rose-500 transition-colors uppercase">
              Eventi
            </span>
            <span className="text-[10px] text-rose-400 uppercase tracking-[0.2em] font-medium italic">
              di Domenica Miserantino
            </span>
          </div>
        </Link>

        {/* Menu a Destra */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link to="/" className="text-gray-600 hover:text-rose-400 font-medium transition-colors">
            Home
          </Link>
          
          <Link to="/catalog" className="text-gray-600 hover:text-rose-400 font-medium transition-colors">
            Catalogo
          </Link>
          
          <a 
            href="https://wa.me/393336980879?text=Salve!%20Vorrei%20ricevere%20informazioni%20e%20un%20preventivo%20per%20un%20articolo." 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-rose-400 text-white px-8 py-2.5 rounded-full font-medium hover:bg-rose-500 transition-all shadow-md shadow-rose-100 hover:shadow-rose-300 hover:-translate-y-0.5 text-center"
          >
            Richiedi Preventivo
          </a>
        </nav>
      </div>
    </header>
  );
}