import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import   Header  from '../components/Header';
import { ProductGrid } from '../components/ProductGrid';
import { QuoteModal } from '../components/QuoteModal';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../lib/database.types';

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Leggiamo lo slug dall'URL in modo sicuro
  const categorySlug = searchParams.get('category');

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

  const handleCategoryChange = (slug: string | null) => {
    if (slug) setSearchParams({ category: slug });
    else setSearchParams({});
  };

  // Logica di filtraggio ultra-sicura
  const filteredProducts = products.filter(p => {
    if (!categorySlug) return true;
    const cat = categories.find(c => c.slug === categorySlug);
    return cat ? p.category_id === cat.id : true;
  });

  const title = categories.find(c => c.slug === categorySlug)?.name || "Il Nostro Catalogo";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header categories={categories} onCategoryClick={handleCategoryChange} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <h1 className="text-4xl font-serif text-gray-800 mb-2">{title}</h1>
        <div className="h-1 w-20 bg-rose-300 mb-10"></div>

        {/* Filtri */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!categorySlug ? 'bg-rose-400 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}
          >
            Tutti
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${categorySlug === cat.slug ? 'bg-rose-400 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}
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
          <ProductGrid
            products={filteredProducts}
            onRequestQuote={(p) => {
              setSelectedProduct(p);
              setIsModalOpen(true);
            }}
          />
        )}
      </main>

      <Footer />

      <QuoteModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}