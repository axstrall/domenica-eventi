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
    price: ''
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
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      setNewProduct({ ...newProduct, image_url: publicUrl });
      alert("Immagine caricata!");
    } catch (error) {
      alert("Errore caricamento foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.image_url) { alert("Carica una foto!"); return; }
    
    try {
      // Pulizia e preparazione dati infallibile
      const cleanPrice = parseFloat(newProduct.price.replace(',', '.'));
      const finalSlug = (newProduct.name || 'prodotto')
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

      const dataToInsert = {
        name: newProduct.name || 'Senza Nome',
        description: newProduct.description || '',
        category_id: newProduct.category_id || categories[0]?.id,
        image_url: newProduct.image_url,
        is_featured: !!newProduct.is_featured,
        brand: newProduct.brand || '',
        price: isNaN(cleanPrice) ? 0 : cleanPrice,
        slug: finalSlug
      };

      const { error } = await supabase.from('products').insert([dataToInsert]);
      if (error) throw error;
      
      alert("ARTICOLO PUBBLICATO!");
      setNewProduct({ name: '', description: '', category_id: '', image_url: '', is_featured: false, brand: '', price: '' });
    } catch (err) {
      console.error(err);
      alert("Errore salvataggio: riprova a ricaricare la pagina");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-xl">
          <input 
            type="password" placeholder="Password" 
            className="border p-3 rounded-full text-center"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button className="block w-full mt-4 bg-rose-400 text-white p-3 rounded-full">Entra</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto pt-24">
      <h2 className="text-3xl font-serif italic mb-8">Nuovo Prodotto</h2>
      <form onSubmit={handleAddProduct} className="grid gap-6 bg-white p-8 rounded-3xl shadow-lg border border-rose-100">
        <label className="border-2 border-dashed border-rose-200 h-40 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden">
          {newProduct.image_url ? <img src={newProduct.image_url} className="w-full h-full object-cover" /> : "Clicca per foto"}
          <input type="file" className="hidden" onChange={handleImageUpload} />
        </label>
        
        <input type="text" placeholder="Nome" className="border p-4 rounded-2xl outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
        <input type="text" placeholder="Prezzo (es: 25.50)" className="border p-4 rounded-2xl outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
        
        <select className="border p-4 rounded-2xl outline-none" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
          <option value="">Scegli Categoria</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <button className="bg-slate-800 text-white p-5 rounded-2xl font-bold uppercase">Pubblica Prodotto</button>
      </form>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Rubrica</h3>
        {subscribers.map(s => <div key={s.id} className="p-2 border-b">{s.name} - {s.phone}</div>)}
      </div>
    </div>
  );
}