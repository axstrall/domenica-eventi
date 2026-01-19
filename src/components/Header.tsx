import React, { useState } from 'react';
import { Menu, X, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Catalogo', href: '/catalog' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full py-4 flex items-center justify-between">
          
          {/* Logo con EFFETTI e Scritta EVENTI personalizzata */}
          <Link to="/" className="flex items-center group">
            {/* Cerchio del Logo con EFFETTO ZOOM e OMBRA al passaggio del mouse */}
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-rose-200 bg-white transition-all duration-300 group-hover:border-rose-400 group-hover:shadow-[0_0_15px_rgba(251,113,133,0.4)]">
              <img 
                src="/LogoDomenica.png" 
                alt="Logo Domenica Miserandino" 
                className="h-full w-full object-cover scale-110 transition-transform duration-500 group-hover:scale-125" 
              />
            </div>

            {/* Testo EVENTI - Stile identico alla foto */}
            <div className="flex flex-col ml-4 leading-none">
              <span className="font-serif text-3xl text-[#1e293b] font-bold tracking-[0.1em] uppercase transition-colors duration-300 group-hover:text-rose-500">
                EVENTI
              </span>
              <span className="text-[11px] text-[#fb7185] uppercase tracking-[0.15em] font-semibold italic mt-1">
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
                className="text-gray-600 hover:text-rose-400 font-medium transition-colors uppercase tracking-widest text-sm"
              >
                {link.name}
              </Link>
            ))}
            <a 
              href="https://wa.me/393270119643" 
              className="bg-rose-400 text-white px-8 py-2.5 rounded-full font-bold hover:bg-rose-500 shadow-md transition-all hover:-translate-y-0.5 text-xs uppercase tracking-widest"
            >
              Richiedi Preventivo
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button type="button" className="p-2 text-rose-400" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-1 border-t border-rose-100">
            {navigation.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-semibold text-gray-700 hover:bg-rose-50 rounded-lg"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 px-3">
              <a 
                href="https://wa.me/393270119643" 
                className="flex items-center justify-center w-full px-4 py-4 text-white bg-rose-400 rounded-2xl font-bold uppercase tracking-widest shadow-lg"
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