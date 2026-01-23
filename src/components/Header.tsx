import React, { useState } from 'react';
import { Menu, X, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  // Questa riga permette di aprire e chiudere il menu
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Catalogo', href: '/catalog' },
  ];

  const whatsappLink = "https://wa.me/393336980879?text=Salve!%20Vorrei%20ricevere%20informazioni%20e%20un%20preventivo.";

  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full py-4 flex items-center justify-between">
          
          {/* Logo e Scritta EVENTI */}
          <Link to="/" className="flex items-center group">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-rose-200 bg-white transition-all duration-300 group-hover:scale-110">
              <img 
                src="/LogoDomenica.png" 
                alt="Logo Domenica Miserandino" 
                className="h-full w-full object-cover scale-110 transition-transform duration-500 group-hover:scale-125" 
              />
            </div>

            <div className="flex flex-col ml-4 leading-none">
              <span className="font-serif text-3xl text-[#1e293b] font-bold tracking-[0.1em] uppercase transition-colors duration-300 group-hover:text-rose-500">
                EVENTI
              </span>
              <span className="text-[11px] text-[#fb7185] uppercase tracking-[0.15em] font-semibold italic mt-1">
                di Domenica Miserandino
              </span>
            </div>
          </Link>

          {/* Menu Desktop (visibile solo su computer) */}
          <div className="hidden md:flex items-center space-x-10">
            {navigation.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className="text-gray-600 hover:text-rose-400 font-medium transition-colors uppercase tracking-widest text-sm"
              >
                {link.name}
              </Link>
            ))}
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-rose-400 text-white px-8 py-2.5 rounded-full font-bold hover:bg-rose-500 shadow-md transition-all hover:-translate-y-0.5 text-xs uppercase tracking-widest"
            >
              Richiedi Preventivo
            </a>
          </div>

          {/* Tasto Menu Mobile (Le tre linette) */}
          <div className="md:hidden">
            <button 
              type="button" 
              className="p-2 text-rose-400 outline-none" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        {/* --- MENU MOBILE A TENDINA (Quello che non si apriva) --- */}
        {isOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-1 border-t border-rose-100 animate-in slide-in-from-top-2 duration-300">
            {navigation.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-semibold text-gray-700 hover:bg-rose-50 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 px-3">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full px-4 py-4 text-white bg-rose-400 rounded-2xl font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
              >
                <Send size={18} className="mr-2" />
                Richiedi Preventivo
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}