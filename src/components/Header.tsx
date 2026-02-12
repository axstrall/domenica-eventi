import React, { useState } from 'react';
import { Menu, X, Send, Search } from 'lucide-react'; // Aggiunta l'icona Search
import { Link, useNavigate } from 'react-router-dom'; // Aggiunto useNavigate

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Stato per la parola cercata
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Catalogo', href: '/catalog' },
  ];

  const whatsappLink = "https://wa.me/393336980879?text=Salve!%20Vorrei%20ricevere%20informazioni%20e%20un%20preventivo.";

  // Funzione che gestisce l'invio della ricerca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Naviga al catalogo passando il termine di ricerca nell'URL
      navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Pulisce la barra
      setIsOpen(false); // Chiude il menu mobile se aperto
    }
  };

  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full py-5 flex items-center justify-between">
          
          {/* Logo e Scritta EVENTI */}
          <Link to="/" className="flex items-center group shrink-0">
            <div className="relative h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-full border-4 border-rose-200 bg-white transition-all duration-300 group-hover:border-rose-400 group-hover:shadow-[0_0_20px_rgba(251,113,133,0.4)]">
              <img 
                src="/LogoDomenica.png" 
                alt="Logo Domenica Miserandino" 
                className="h-full w-full object-cover scale-110 transition-transform duration-500 group-hover:scale-125" 
              />
            </div>

            <div className="flex flex-col ml-5 leading-none hidden lg:flex">
              <span className="font-serif text-3xl md:text-4xl text-[#1e293b] font-bold tracking-[0.1em] uppercase transition-colors duration-300 group-hover:text-rose-500">
                EVENTI
              </span>
              <span className="text-[12px] md:text-[14px] text-[#fb7185] uppercase tracking-[0.15em] font-semibold italic mt-2">
                di Domenica Miserandino
              </span>
            </div>
          </Link>

          {/* BARRA DI RICERCA (Desktop - In mezzo) */}
          <form onSubmit={handleSearch} className="relative hidden md:flex flex-1 max-w-sm mx-8">
            <input
              type="text"
              placeholder="Cerca un prodotto (es. vaso)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-rose-50 border border-rose-100 outline-none focus:border-rose-300 focus:bg-white text-sm transition-all shadow-inner"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" size={20} />
          </form>

          {/* Menu Desktop (Destra) */}
          <div className="hidden md:flex items-center space-x-8 shrink-0">
            {navigation.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className="text-gray-600 hover:text-rose-400 font-bold uppercase tracking-widest text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-rose-400 text-white px-6 py-3 rounded-full font-bold hover:bg-rose-500 shadow-lg transition-all hover:-translate-y-1 text-xs uppercase tracking-widest"
            >
              Preventivo
            </a>
          </div>

          {/* Tasto Menu Mobile */}
          <div className="md:hidden">
            <button 
              type="button" 
              className="p-2 text-rose-400" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={35} /> : <Menu size={35} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile a Tendina */}
        {isOpen && (
          <div className="md:hidden pb-10 pt-4 space-y-4 border-t border-rose-100 animate-in slide-in-from-top-2">
            
            {/* Ricerca in Mobile */}
            <form onSubmit={handleSearch} className="px-4 relative">
              <input
                type="text"
                placeholder="Cerca prodotti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-rose-50 border border-rose-100 outline-none text-gray-700"
              />
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-rose-300" size={20} />
            </form>

            {navigation.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-5 text-lg font-bold text-gray-700 hover:bg-rose-50 rounded-xl"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-6 px-4">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-5 text-white bg-rose-400 rounded-2xl font-bold uppercase tracking-widest shadow-xl"
              >
                <Send size={20} className="mr-3" />
                Richiedi Preventivo
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}