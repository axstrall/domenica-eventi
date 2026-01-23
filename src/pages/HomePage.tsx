import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import { QuoteModal } from '../components/QuoteModal';
import { Footer } from '../components/Footer';
import { Testimonials } from '../components/Testimonials';
import { supabase } from '../lib/supabase';
import { Truck, Gift, MessageCircle, Star, ArrowRight, Phone } from 'lucide-react'; 
import type { Product, Category } from '../lib/database.types';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Stati per il modulo WhatsApp
  const [whatsappName, setWhatsappName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const brands = [
    'Hervit', 'Blanc Mariclò', 'Enzo de Gasperi', 
    'Mathilde M', 'BRANDANI', 'Nuvole di Stoffa', 'Chez Moi Italia'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsResult, categoriesResult] = await Promise.all([
        supabase.from('products').select('*').eq('is_featured', true),
        supabase.from('categories').select('*').order('name'),
      ]);

      if (productsResult.data) setProducts(productsResult.data);
      if (categoriesResult.data) setCategories(categoriesResult.data);
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // FUNZIONE PER SALVARE IL NUMERO SU SUPABASE
  const handleWhatsappSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('whatsapp_subscribers')
        .insert([{ name: whatsappName, phone: whatsappPhone }]);

      if (error) throw error;

      alert(`Grazie ${whatsappName}! Ti abbiamo inserito nella nostra lista WhatsApp. Verrai avvisato per ogni novità!`);
      setWhatsappName('');
      setWhatsappPhone('');
    } catch (error) {
      console.error('Errore:', error);
      alert('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestQuote = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="bg-rose-400 text-white py-2.5 text-center text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold shadow-sm">
        Spedizioni in tutta Italia • Bomboniere e Articoli da Regalo Esclusivi
      </div>

      <Header categories={categories} />
      <Hero />

      {/* --- SEZIONE MARCHI --- */}
      <section className="py-12 bg-white/30 backdrop-blur-sm border-y border-rose-100/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-rose-400 font-serif italic mb-8 tracking-[0.2em] uppercase text-sm font-bold">
            I Nostri Marchi
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => navigate(`/catalog?brand=${encodeURIComponent(brand)}`)}
                className="text-slate-700 font-serif text-lg md:text-xl hover:text-rose-500 transition-all duration-300 hover:scale-110 tracking-tight uppercase"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- BADGE DI FIDUCIA --- */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { Icon: Truck, title: "Spedizione Sicura", desc: "Imballaggio garantito" },
            { Icon: Gift, title: "Idee Regalo", desc: "Confezioni eleganti" },
            { Icon: MessageCircle, title: "Assistenza WhatsApp", desc: "Sempre al tuo fianco" },
            { Icon: Star, title: "Marchi Premium", desc: "Selezione esclusiva" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-rose-100/50 hover:shadow-lg transition-all">
              <item.Icon className="text-rose-400 mb-3" size={28} />
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-800 text-center">{item.title}</h4>
              <p className="text-[10px] text-gray-500 italic mt-1 text-center">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isLoading && categories.length > 0 && (
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-gray-800 italic">Le Nostre Collezioni</h2>
              <div className="h-0.5 w-24 bg-rose-300 mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.slice(0, 4).map((category) => (
                <Link 
                  key={category.id}
                  to={`/catalog?category=${category.slug}`}
                  className="group relative h-96 overflow-hidden rounded-2xl bg-gray-100 shadow-md transition-all duration-500 hover:-translate-y-3 block"
                >
                  <img 
                    src={`/images/${category.slug}.png`} 
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                    <div>
                      <h3 className="text-white text-2xl font-serif mb-2">{category.name}</h3>
                      <p className="text-rose-200 text-sm flex items-center">
                        Scopri la collezione <ArrowRight size={16} className="ml-2" />
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
          </div>
        ) : products.length > 0 && (
          <div className="pb-20">
             <ProductGrid products={products} onRequestQuote={handleRequestQuote} title="Pezzi Unici in Evidenza" />
          </div>
        )}
      </main>

      {/* --- SEZIONE CHI SIAMO --- */}
      <section className="py-24 bg-white/40 backdrop-blur-md border-y border-rose-100/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-[12px] border-white">
              <img src="/atelier.jpg" alt="L'Atelier" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-5xl font-serif text-gray-800 italic leading-tight">L'Arte del Ricevere <br/> con Stile</h2>
            <div className="h-1 w-24 bg-rose-300"></div>
            <p className="text-gray-600 italic text-xl">"Ogni evento è una storia unica. Trasformiamo i vostri desideri in dettagli indimenticabili."</p>
            <p className="text-gray-500 text-lg">Portiamo nelle vostre cerimonie l'eccellenza dei migliori marchi internazionali.</p>
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER WHATSAPP --- */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <Phone className="text-rose-400 mx-auto mb-6" size={48} />
            <h2 className="text-4xl font-serif text-white mb-6 italic">Novità su WhatsApp</h2>
            <p className="text-slate-300 mb-10 text-lg max-w-2xl mx-auto font-light">
              Lascia il tuo numero per ricevere in anteprima le foto dei nuovi arrivi direttamente sul tuo smartphone.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" onSubmit={handleWhatsappSubmit}>
              <input 
                type="text" 
                placeholder="Il tuo Nome" 
                required
                value={whatsappName}
                onChange={(e) => setWhatsappName(e.target.value)}
                className="flex-grow px-8 py-5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-rose-400 backdrop-blur-sm"
              />
              <input 
                type="tel" 
                placeholder="Cellulare" 
                required
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                className="flex-grow px-8 py-5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-rose-400 backdrop-blur-sm"
              />
              <button 
                disabled={isSubmitting}
                className="bg-rose-400 text-white px-10 py-5 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-rose-500 transition-all shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Salvataggio...' : 'Iscrivimi'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Testimonials />
      <Footer />
      <QuoteModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}