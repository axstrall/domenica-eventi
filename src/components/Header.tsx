import React, { useState } from 'react';
import { Menu, X, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Catalogo', href: '/catalog' },
  ];

  const whatsappLink = "https://wa.me/393336980879?text=Salve!%20Vorrei%20ricevere%20informazioni%20e%20un%20preventivo.";

  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full py-5 flex items-center justify-between">
          
          {/* Logo e Scritta EVENTI - Logo Ingrandito */}
          <Link to="/" className="flex items-center group">
            {/* Aumentato da h-16 a h-24 per un impatto maggiore */}
            <div className="relative h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-full border-4 border-rose-200 bg-white transition-all duration-300 group-hover:border-rose-400 group-hover:shadow-[0_0_20px_rgba(251,113,133,0.4)]">
              <img 
                src="/LogoDomenica.png" 
                alt="Logo Domenica Miserandino" 
                className="h-full w-full object-cover scale-110 transition-transform duration-500 group-hover:scale-125" 
              />
            </div>

            <div className="flex flex-col ml-5 leading-none">
              <span className="font-serif text-3xl md:text-4xl text-[#1e293b] font-bold tracking-[0.1em] uppercase transition-colors duration-300 group-hover:text-rose-500">
                EVENTI
              </span>
              <span className="text-[12px] md:text-[14px] text-[#fb7185] uppercase tracking-[0.15em] font-semibold italic mt-2">
                di Domenica Miserandino
              </span>
            </div>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-10">
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
              className="bg-rose-400 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-500 shadow-lg transition-all hover:-translate-y-1 text-xs uppercase tracking-widest"
            >
              Richiedi Preventivo
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
          <div className="md:hidden pb-10 pt-4 space-y-2 border-t border-rose-100 animate-in slide-in-from-top-2">
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