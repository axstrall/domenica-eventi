import React, { useState } from 'react';
import { Menu, X, Send } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '#' },
    { name: 'Catalogo', href: '#catalogo' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between border-b border-rose-100 lg:border-none">
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-2 sm:gap-3">
              <img
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-rose-200"
                src="/images/logo.png"
                alt="Domenica Miserandino Logo"
              />
              {/* Rimosso 'hidden' così appare anche su mobile */}
              <div className="leading-tight">
                <span className="text-base sm:text-xl font-bold text-gray-900 block uppercase">EVENTI</span>
                <span className="text-[10px] sm:text-xs tracking-widest text-rose-500 font-medium uppercase">
                  Miserandino
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-10 space-x-8 items-center">
            {navigation.map((link) => (
              <a key={link.name} href={link.href} className="text-base font-medium text-gray-700 hover:text-rose-600 transition-colors">
                {link.name}
              </a>
            ))}
            <a
              href="https://wa.me/393270119643"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-rose-500 hover:bg-rose-600 shadow-sm transition-all hover:scale-105"
            >
              Richiedi Preventivo
            </a>
          </div>

          {/* Mobile Menu Button - Sempre visibile su mobile */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-rose-500 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-rose-50 bg-white">
            {navigation.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-base font-medium text-gray-700 hover:text-rose-600 px-2 py-2"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://wa.me/393270119643"
              className="flex items-center justify-center w-full mt-4 px-4 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-rose-500 shadow-md"
            >
              <Send size={18} className="mr-2" />
              Richiedi Preventivo
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}