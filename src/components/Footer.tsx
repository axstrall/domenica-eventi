import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Colonna Brand con LOGO CIRCOLARE */}
          <div className="flex flex-col items-start">
            <div className="flex items-center group mb-4 cursor-pointer">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-rose-200 shadow-sm transition-all duration-300 group-hover:border-rose-400 group-hover:shadow-[0_0_15px_rgba(251,113,133,0.4)] bg-white">
                <img 
                  src="/LogoDomenica.png" 
                  alt="Domenica Eventi Logo" 
                  className="h-full w-full object-cover scale-125 transition-transform duration-500 group-hover:scale-140" 
                />
              </div>
              <span className="ml-3 font-serif text-gray-800 font-semibold tracking-wide transition-colors group-hover:text-rose-500">
                Domenica Eventi
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed italic">
              creazione di bomboniere per qualsiasi festivita.
              Scopri la nostra collezione di articoli esclusivi per rendere unico ogni tuo momento.
            </p>
          </div>

          {/* Colonna Contatti e Social */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 uppercase tracking-wider text-xs">Contatti & Social</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-600 text-sm hover:text-rose-400 transition-colors cursor-pointer">
                <Mail className="h-4 w-4 text-rose-400" />
                <span>info@eventi.it</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 text-sm hover:text-rose-400 transition-colors cursor-pointer">
                <Phone className="h-4 w-4 text-rose-400" />
                <span>+39 333 698 0879</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 text-sm">
                <MapPin className="h-4 w-4 text-rose-400" />
                <span>Viale della Rinascita 74, San Cataldo, Italy</span>
              </div>
            </div>
            
            {/* Icone Social */}
            <div className="flex space-x-5">
              <a 
                href="https://wa.me/393336980879" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm text-rose-400 hover:bg-rose-400 hover:text-white transition-all duration-300 hover:shadow-[0_0_10px_rgba(251,113,133,0.3)]"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/eventi_di_domenica_miserandino/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm text-rose-400 hover:bg-rose-400 hover:text-white transition-all duration-300 hover:shadow-[0_0_10px_rgba(251,113,133,0.3)]"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.facebook.com/domiserandino/?locale=it_IT" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm text-rose-400 hover:bg-rose-400 hover:text-white transition-all duration-300 hover:shadow-[0_0_10px_rgba(251,113,133,0.3)]"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Colonna Orari */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 uppercase tracking-wider text-xs">Orari di Ricevimento</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span>Lunedì - Venerdì</span>
                <span className="font-medium text-gray-800">9:00 - 19:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span>Sabato</span>
                <span className="font-medium text-gray-800">9:00 - 13:00</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>Domenica</span>
                <span className="font-medium font-serif italic">Su Appuntamento</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- SEZIONE COPYRIGHT E FIRMA AXS LAB --- */}
        <div className="border-t border-rose-200 mt-12 pt-8 text-center">
          <p className="text-rose-400 text-[10px] uppercase tracking-widest mb-2">
            © {new Date().getFullYear()} Eventi di Domenica Miserandino. Tutti i diritti riservati.
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-[9px] uppercase tracking-[0.3em]">
            <span>Designed & Developed by</span>
            <span className="font-bold text-gray-500 hover:text-rose-400 transition-colors cursor-pointer">
              AXS LAB 
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}