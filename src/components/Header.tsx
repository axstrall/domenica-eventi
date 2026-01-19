import React, { useState } from 'react';
import { Menu, X, Send } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Catalogo', href: '/catalog' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full py-5 flex items-center justify-between font-serif">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-4">
              {/* Corretto il nome file e rimosso /images/ perché è in public */}
              <img
                className="h-16 w-16 rounded-full object-cover border border-rose-100"
                src="/LogoDomenica.png" 
                alt="Domenica Miserandino Logo"
              />
              <div className="flex flex-col">
                {/* Ripristinato stile originale: grassetto, spaziato e scuro */}
                <span className="text-2xl font-bold tracking-[0.2em] text-[#2D3748] leading-none">
                  EVENTI
                </span>
                <span className="text-[10px] tracking-[0.15em] text-rose-400 font-semibold italic mt-1">
                  DI DOMENICA MISERANDINO
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex ml-10 space-x-8 items-center font-sans">
            {navigation.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium text-gray-600 hover:text-rose-500 transition-colors uppercase tracking-widest">
                {link.name}
              </a>
            ))}
            <a
              href="https://wa.me/393270119643"
              className="inline-flex items-center px-6 py-2 text-xs font-bold tracking-widest rounded-full text-white bg-rose-400 hover:bg-rose-500 shadow-sm transition-all uppercase"
            >
              Richiedi Preventivo
            </a>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button type="button" className="p-2 text-gray-500" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-1 border-t border-rose-50 font-sans">
            {navigation.map((link) => (
              <a key={link.name} href={link.href} className="block px-3 py-3 text-base font-medium text-gray-700">
                {link.name}
              </a>
            ))}
            <div className="mt-4 px-3">
              <a href="https://wa.me/393270119643" className="flex items-center justify-center w-full px-4 py-3 text-white bg-rose-400 rounded-xl font-bold">
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