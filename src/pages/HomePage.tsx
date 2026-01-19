import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import { QuoteModal } from '../components/QuoteModal';
import { Footer } from '../components/Footer';
import { Testimonials } from '../components/Testimonials'; // <--- IMPORTATO
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../lib/database.types';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleRequestQuote = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header categories={categories} />
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- SEZIONE RIQUADRI CATEGORIE --- */}
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
                  className="group relative h-96 overflow-hidden rounded-2xl bg-gray-100 shadow-md transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl cursor-pointer block"
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
                      <p className="text-rose-200 text-sm transform translate-y-10 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 flex items-center">
                        Scopri la collezione <span className="ml-2">→</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* --- SEZIONE PRODOTTI IN EVIDENZA --- */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
              <p className="mt-4 text-gray-600 font-serif italic">Caricamento delle meraviglie...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="pb-20">
             <ProductGrid
              products={products}
              onRequestQuote={handleRequestQuote}
              title="Pezzi Unici in Evidenza"
            />
          </div>
        ) : null}
      </main>

      {/* --- AGGIUNTA SEZIONE RECENSIONI --- */}
      <Testimonials />

      <Footer />

      <QuoteModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}