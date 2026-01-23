import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, ArrowLeft, Lock, PlusCircle, Database, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category_id: '',
    image_url: '',
    is_featured: false,
    brand: '',
    price: '' // Aggiunto stato per il prezzo
  });

  const SECRET_PASSWORD = "Domenica2024";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) setIsAuthenticated(true);
    else alert("Password errata!");
  };

  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        setIsLoading(true);
        const [subsRes, catsRes] = await Promise.all([
          supabase.from('whatsapp_subscribers').select('*').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('name')
        ]);
        if (subsRes.data) setSubscribers(subsRes.data);
        if (catsRes.data) setCategories(catsRes.data);
        setIsLoading(false);
      };
      loadData();
    }
  }, [isAuthenticated]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setNewProduct({ ...newProduct, image_url: publicUrl });
      alert("Immagine caricata correttamente!");
    } catch (error) {
      console.error('Errore upload:', error);
      alert("Errore durante il caricamento dell'immagine");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.image_url) {
      alert("Carica prima un'immagine!");
      return;
    }

    try {
      // Prepariamo i dati completi includendo lo slug e il prezzo numerico
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        category_id: newProduct.category_id,
        image_url: newProduct.image_url,
        is_featured: newProduct.is_featured,
        brand: newProduct.brand,
        price: parseFloat(newProduct.price) || 0,
        slug: newProduct.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
      };

      const { error } = await supabase.from('products').insert([productData]);
      if (error) throw error;
      
      alert("Articolo pubblicato con successo!");
      setNewProduct({ name: '', description: '', category_id: '', image_url: '', is_featured: false, brand: '', price: '' });
    } catch (err) {
      console.error(err);
      alert("Errore nel salvataggio del prodotto nel database");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-rose-50/30">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-rose-100 max-w-md w-full text-center">
          <Lock className="text-rose-400 mx-auto mb-6" size={48} />
          <h2 className="text-3xl font-serif text-gray-800 mb-6 italic">Area Riservata</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" placeholder="Password" 
              className="w-full px-6 py-4 rounded-full bg-rose-50 border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400 text-center"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
            <button className="w-full bg-rose-400 text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg">Accedi</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 pt-24 md:pt-32 max-w-6xl mx-auto space-y-12">
      <Link to="/" className="flex items-center text-rose-400 hover:text-rose-500 font-bold italic">
        <ArrowLeft size={20} className="mr-2" /> Torna al Sito
      </Link>

      <section className="bg-white/90 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <div className="flex items-center gap-3 mb-8">
          <PlusCircle className="text-rose-400" size={32} />
          <h2 className="text-3xl font-serif text-gray-800 italic">Nuovo Articolo</h2>
        </div>
        
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest ml-2">Foto Prodotto</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-rose-200 border-dashed rounded-3xl cursor-pointer bg-rose-50/30 hover:bg-rose-50 transition-all overflow-hidden">
                {newProduct.image_url ? (
                  <img src={newProduct.image_url} alt="Anteprima" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? <Loader2 className="animate-spin text-rose-400" size={32} /> : <Upload className="text-rose-400 mb-2" size={32} />}
                    <p className="text-sm text-rose-400 font-medium">Clicca per caricare foto</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            </div>
          </div>

          <input 
            type="text" placeholder="Nome Articolo" required
            className="px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none"
            value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
          />
          <input 
            type="text" placeholder="Marchio (es: Hervit)" 
            className="px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none"
            value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
          />
          <input 
            type="number" step="0.01" placeholder="Prezzo (es: 25.00)" required
            className="px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none"
            value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
          />
          <select 
            required className="px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none"
            value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})}
          >
            <option value="">Seleziona Categoria</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <div className="flex items-center gap-4 px-4 md:col-span-2">
            <input 
              type="checkbox" id="featured" className="w-5 h-5 accent-rose-400"
              checked={newProduct.is_featured} onChange={e => setNewProduct({...newProduct, is_featured: e.target.checked})}
            />
            <label htmlFor="featured" className="text-gray-600 font-medium italic">Metti in evidenza nella Home</label>
          </div>
          <textarea 
            placeholder="Descrizione" className="md:col-span-2 px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 h-24 outline-none"
            value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
          />
          <button className="md:col-span-2 bg-slate-800 text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg disabled:opacity-50">
            Pubblica sul Sito
          </button>
        </form>
      </section>

      {/* RUBRICA WHATSAPP */}
      <section className="bg-white/90 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Database className="text-rose-400" size={32} />
            <h2 className="text-3xl font-serif text-gray-800 italic">Rubrica Clienti</h2>
          </div>
          <span className="bg-rose-100 text-rose-500 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-tighter">{subscribers.length} Iscritti</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-rose-100 italic text-rose-400 text-[10px] uppercase tracking-widest">
                <th className="py-4 px-4">Nome</th>
                <th className="py-4 px-4">Cellulare</th>
                <th className="py-4 px-4 text-center">Chat</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-50 hover:bg-rose-50/50 transition-colors">
                  <td className="py-6 px-4 font-serif text-xl text-gray-700">{sub.name}</td>
                  <td className="py-6 px-4 font-mono text-gray-600">{sub.phone}</td>
                  <td className="py-6 px-4 flex justify-center">
                    <a href={`https://wa.me/${sub.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-all shadow-md"><MessageCircle size={22} /></a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}