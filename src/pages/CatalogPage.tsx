import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { ProductGrid } from '../components/ProductGrid';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Percent, Filter, X, ChevronRight } from 'lucide-react'; 
import type { Product, Category } from '../lib/database.types';

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  // Stato per gestire l'apertura della sidebar su cellulare
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Marchi trattati
  const brands = [
    'Hervit', 'Blanc Mariclò', 'Enzo de Gasperi', 
    'Mathilde M', 'BRANDANI', 'Nuvole di Stoffa', 'Chez Moi Italia', 'EVENTI'
  ];

  // Leggiamo categoria, marchio e RICERCA dall'URL
  const categorySlug = searchParams.get('category');
  const selectedBrand = searchParams.get('brand');
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([
          supabase.from('products').select('*').order('name'),
          supabase.from('categories').select('*').order('name')
        ]);
        if (pRes.data) setProducts(pRes.data);
        if (cRes.data) setCategories(cRes.data);
      } catch (e) {
        console.error("Errore caricamento:", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleRequestQuote = (product: Product) => {
    const mioNumero = "393336980879"; 
    const prezzoFinale = product.discount_price || product.price;
    const messaggio = encodeURIComponent(
      `Ciao Domenica! 👋 Ho visto nel catalogo questo articolo: "${product.name}" (Prezzo: €${prezzoFinale}). Vorrei avere maggiori informazioni, grazie!`
    );
    window.open(`https://wa.me/${mioNumero}?text=${messaggio}`, '_blank');
  };

  const handleCategorySelect = (slug: string | null) => {
    const newParams: any = {};
    if (slug) newParams.category = slug;
    if (selectedBrand) newParams.brand = selectedBrand;
    if (searchQuery) newParams.search = searchQuery;
    setSearchParams(newParams);
    setIsSidebarOpen(false); // Chiude la sidebar su mobile dopo aver cliccato
  };

  const handleBrandSelect = (brand: string | null) => {
    const newParams: any = {};
    if (brand) newParams.brand = brand;
    if (categorySlug) newParams.category = categorySlug;
    if (searchQuery) newParams.search = searchQuery;
    setSearchParams(newParams);
    setIsSidebarOpen(false); // Chiude la sidebar su mobile dopo aver cliccato
  };

  // Filtro logica
  const filteredProducts = products.filter(p => {
    let matchesCategory = true;
    let matchesBrand = true;
    let matchesSearch = true;

    if (categorySlug) {
      if (categorySlug === 'sconti') {
        matchesCategory = p.discount_price !== null && p.discount_price > 0;
      } else {
        const cat = categories.find(c => c.slug === categorySlug);
        // Se la categoria non esiste ancora nel DB, non mostra nulla (evita bug)
        matchesCategory = cat ? p.category_id === cat.id : false;
      }
    }

    if (selectedBrand) {
      matchesBrand = p.brand === selectedBrand;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesSearch = p.name.toLowerCase().includes(query) || 
                      (p.description && p.description.toLowerCase().includes(query));
    }

    return matchesCategory && matchesBrand && matchesSearch;
  });

  const title = searchQuery ? `Risultati per: "${searchQuery}"` : 
                (categorySlug === 'sconti' ? "Offerte & Sconti" :
                (categories.find(c => c.slug === categorySlug)?.name || 
                (selectedBrand ? `Collezione ${selectedBrand}` : "Il Nostro Catalogo")));

  // --- COMPONENTE INTERNO PER LA SIDEBAR (Così lo usiamo sia su PC che su Mobile) ---
  const SidebarContent = () => (
    <div className="space-y-10">
      {/* SEZIONE CATEGORIE */}
      <div>
        <h3 className="text-xl font-serif italic text-gray-800 mb-4 border-b border-rose-100 pb-2">Collezioni</h3>
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => handleCategorySelect(null)}
              className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm flex items-center justify-between ${!categorySlug ? 'bg-rose-100 text-rose-600 font-bold' : 'text-gray-600 hover:bg-rose-50 hover:text-rose-400'}`}
            >
              Tutte le Categorie
              {!categorySlug && <ChevronRight size={16} />}
            </button>
          </li>
          
          <li>
            <button 
              onClick={() => handleCategorySelect('sconti')}
              className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm flex items-center justify-between ${categorySlug === 'sconti' ? 'bg-red-500 text-white font-bold shadow-md' : 'text-red-500 hover:bg-red-50 font-medium'}`}
            >
              <span className="flex items-center gap-2"><Percent size={14} /> In Sconto</span>
              {categorySlug === 'sconti' && <ChevronRight size={16} />}
            </button>
          </li>

          {categories.map((cat) => (
            <li key={cat.id}>
              <button 
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm flex items-center justify-between ${categorySlug === cat.slug ? 'bg-rose-100 text-rose-600 font-bold' : 'text-gray-600 hover:bg-rose-50 hover:text-rose-400'}`}
              >
                {cat.name}
                {categorySlug === cat.slug && <ChevronRight size={16} />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* SEZIONE MARCHI */}
      <div>
        <h3 className="text-xl font-serif italic text-gray-800 mb-4 border-b border-rose-100 pb-2">Marchi</h3>
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => handleBrandSelect(null)}
              className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm flex items-center justify-between ${!selectedBrand ? 'bg-gray-100 text-gray-800 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
            >
              Tutti i Marchi
              {!selectedBrand && <ChevronRight size={16} />}
            </button>
          </li>
          {brands.map((brand) => (
            <li key={brand}>
              <button 
                onClick={() => handleBrandSelect(brand)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm flex items-center justify-between ${selectedBrand === brand ? 'bg-gray-100 text-gray-800 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
              >
                {brand}
                {selectedBrand === brand && <ChevronRight size={16} />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header categories={categories} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        
        {/* INTESTAZIONE E PULSANTE FILTRA (MOBILE) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-serif text-gray-800 uppercase tracking-tight">{title}</h1>
            <div className="h-1 w-20 bg-rose-300 mt-2"></div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Tasto Cancella Ricerca */}
            {searchQuery && (
              <button 
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('search');
                  setSearchParams(newParams);
                }}
                className="text-xs bg-gray-100 hover:bg-rose-100 text-gray-500 px-4 py-2.5 rounded-full transition-all flex items-center gap-1 font-bold"
              >
                <X size={14}/> Cancella Ricerca
              </button>
            )}

            {/* Pulsante Filtra Mobile (Visibile solo su schermi piccoli) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-bold shadow-sm hover:bg-rose-50 transition-colors"
            >
              <Filter size={18} /> Filtri
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* --- SIDEBAR DESKTOP --- */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-rose-100/50 h-max sticky top-32 shadow-sm">
            <SidebarContent />
          </aside>

          {/* --- SIDEBAR MOBILE (MODALE) --- */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-[999] flex lg:hidden">
              {/* Sfondo scuro */}
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={() => setIsSidebarOpen(false)}
              />
              {/* Pannello laterale che entra da sinistra */}
              <aside className="relative w-4/5 max-w-sm bg-white h-full overflow-y-auto p-6 shadow-2xl animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-serif italic text-gray-800 flex items-center gap-2">
                    <Filter size={24} className="text-rose-400"/> Filtri
                  </h2>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-rose-100 hover:text-rose-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <SidebarContent />
              </aside>
            </div>
          )}

          {/* --- GRIGLIA PRODOTTI --- */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-400"></div>
              </div>
            ) : (
              <div>
                {filteredProducts.length > 0 ? (
                  <ProductGrid
                    products={filteredProducts}
                    onRequestQuote={handleRequestQuote}
                  />
                ) : (
                  <div className="text-center py-24 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-dashed border-rose-200">
                    <p className="text-gray-500 italic text-xl mb-4">Nessun prodotto trovato con questi filtri.</p>
                    <button 
                      onClick={() => setSearchParams({})} 
                      className="bg-rose-400 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-rose-500 transition-all uppercase tracking-widest text-xs"
                    >
                      Mostra tutto il catalogo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}