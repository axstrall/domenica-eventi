import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { ProductGrid } from '../components/ProductGrid';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../lib/database.types';

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // Marchi trattati
  const brands = [
    'Hervit', 'Blanc Mariclò', 'Enzo de Gasperi', 
    'Mathilde M', 'BRANDANI', 'Nuvole di Stoffa', 'Chez Moi Italia'
  ];

  // Leggiamo categoria, marchio e RICERCA dall'URL
  const categorySlug = searchParams.get('category');
  const selectedBrand = searchParams.get('brand');
  const searchQuery = searchParams.get('search'); // <-- NUOVO: legge la barra di ricerca

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
    const messaggio = encodeURIComponent(
      `Ciao Domenica! 👋 Ho visto nel catalogo questo articolo: "${product.name}" (Prezzo: €${product.price}). Vorrei avere maggiori informazioni, grazie!`
    );
    window.open(`https://wa.me/${mioNumero}?text=${messaggio}`, '_blank');
  };

  const handleCategoryChange = (slug: string | null) => {
    const newParams: any = {};
    if (slug) newParams.category = slug;
    if (selectedBrand) newParams.brand = selectedBrand;
    if (searchQuery) newParams.search = searchQuery; // Mantiene la ricerca
    setSearchParams(newParams);
  };

  const handleBrandChange = (brand: string | null) => {
    const newParams: any = {};
    if (brand) newParams.brand = brand;
    if (categorySlug) newParams.category = categorySlug;
    if (searchQuery) newParams.search = searchQuery; // Mantiene la ricerca
    setSearchParams(newParams);
  };

  // --- FILTRAGGIO INCROCIATO: Ricerca + Marchio + Categoria ---
  const filteredProducts = products.filter(p => {
    let matchesCategory = true;
    let matchesBrand = true;
    let matchesSearch = true;

    // Filtro Categoria
    if (categorySlug) {
      const cat = categories.find(c => c.slug === categorySlug);
      matchesCategory = cat ? p.category_id === cat.id : true;
    }

    // Filtro Marchio
    if (selectedBrand) {
      matchesBrand = p.brand === selectedBrand;
    }

    // Filtro Ricerca Testuale (Nome o Descrizione)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesSearch = p.name.toLowerCase().includes(query) || 
                      (p.description && p.description.toLowerCase().includes(query));
    }

    return matchesCategory && matchesBrand && matchesSearch;
  });

  const title = searchQuery ? `Risultati per: "${searchQuery}"` : 
                (categories.find(c => c.slug === categorySlug)?.name || 
                (selectedBrand ? `Collezione ${selectedBrand}` : "Il Nostro Catalogo"));

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header categories={categories} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
           <div>
              <h1 className="text-4xl font-serif text-gray-800 uppercase tracking-tight">{title}</h1>
              <div className="h-1 w-20 bg-rose-300"></div>
           </div>
           
           {/* Bottone per pulire la ricerca se attiva */}
           {searchQuery && (
             <button 
               onClick={() => {
                 const newParams = new URLSearchParams(searchParams);
                 newParams.delete('search');
                 setSearchParams(newParams);
               }}
               className="text-xs bg-gray-100 hover:bg-rose-100 text-gray-500 px-4 py-2 rounded-full transition-all"
             >
               Cancella ricerca "X"
             </button>
           )}
        </div>

        {/* --- SEZIONE FILTRI MARCHI --- */}
        <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 mt-8 mb-10 border border-rose-100/50">
          <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4">Filtra per Marchio:</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleBrandChange(null)}
              className={`text-sm font-medium transition-all ${!selectedBrand ? 'text-rose-500 font-bold' : 'text-gray-500 hover:text-rose-400'}`}
            >
              Tutti i Marchi
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandChange(brand)}
                className={`text-sm font-medium transition-all ${selectedBrand === brand ? 'text-rose-500 font-bold underline decoration-2' : 'text-gray-500 hover:text-rose-400'}`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* --- FILTRI CATEGORIE --- */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!categorySlug ? 'bg-rose-400 text-white shadow-md' : 'bg-white/50 text-gray-600 border border-gray-200'}`}
          >
            Tutte le Categorie
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${categorySlug === cat.slug ? 'bg-rose-400 text-white shadow-md' : 'bg-white/50 text-gray-600 border border-gray-200'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-rose-400"></div>
          </div>
        ) : (
          <div>
            {filteredProducts.length > 0 ? (
              <ProductGrid
                products={filteredProducts}
                onRequestQuote={handleRequestQuote}
              />
            ) : (
              <div className="text-center py-20 bg-white/20 rounded-3xl border border-dashed border-rose-200">
                <p className="text-gray-500 italic text-lg">Nessun prodotto trovato con questi filtri.</p>
                <button 
                  onClick={() => setSearchParams({})} 
                  className="mt-4 text-rose-400 font-bold underline"
                >
                  Mostra tutto il catalogo
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}