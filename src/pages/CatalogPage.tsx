import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { ProductGrid } from '../components/ProductGrid';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../lib/database.types';

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentCategory = searchParams.get('category');
  const currentBrand = searchParams.get('brand');

  useEffect(() => {
    loadData();
  }, [currentCategory, currentBrand]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Carichiamo le categorie per l'Header
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (categoriesData) setCategories(categoriesData);

      // 2. Costruiamo la query per i prodotti
      let query = supabase.from('products').select('*');

      // --- LOGICA SPECIALE SCONTI ---
      if (currentCategory === 'sconti') {
        // Seleziona solo i prodotti che hanno un prezzo scontato impostato nel database
        query = query.not('discount_price', 'is', null).gt('discount_price', 0);
      } 
      // --- FILTRO CATEGORIA NORMALE ---
      else if (currentCategory) {
        const { data: catData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', currentCategory)
          .single();
        
        if (catData) {
          query = query.eq('category_id', catData.id);
        }
      }

      // --- FILTRO BRAND ---
      if (currentBrand) {
        query = query.eq('brand', currentBrand);
      }

      const { data: productsData } = await query;
      if (productsData) setProducts(productsData);

    } catch (error) {
      console.error('Errore nel caricamento del catalogo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per gestire il messaggio WhatsApp (usa il prezzo scontato se presente)
  const handleRequestQuote = (product: Product) => {
    const mioNumero = "3336980879"; 
    const prezzoDaMostrare = product.discount_price || product.price;
    const messaggio = encodeURIComponent(
      `Ciao Domenica! 👋 Desidero informazioni su: "${product.name}" (Prezzo: €${prezzoDaMostrare}).`
    );
    window.open(`https://wa.me/${mioNumero}?text=${messaggio}`, '_blank');
  };

  // Titolo dinamico in base alla sezione
  const getPageTitle = () => {
    if (currentCategory === 'sconti') return "Offerte & Promozioni";
    if (currentBrand) return `Collezione ${currentBrand}`;
    if (currentCategory) {
      // Trasforma lo slug (es. "fiori-di-lena") in titolo leggibile
      return currentCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return "Tutti gli Articoli";
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header categories={categories} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
          </div>
        ) : (
          <>
            {/* Visualizziamo la griglia con il titolo appropriato */}
            <ProductGrid 
              products={products} 
              onRequestQuote={handleRequestQuote} 
              title={getPageTitle()} 
            />
            
            {products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 italic text-lg">
                  Non abbiamo trovato prodotti in questa sezione al momento.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}