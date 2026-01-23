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
    } catch (error) {
      alert("Errore caricamento immagine");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.image_url) { alert("Manca la foto!"); return; }
    
    try {
      const cleanPrice = parseFloat(newProduct.price.replace(',', '.'));
      const generatedSlug = (newProduct.name || 'prodotto')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

      const { data, error } = await supabase.from('products').insert([{
        name: newProduct.name,
        description: newProduct.description || '',
        category_id: newProduct.category_id,
        image_url: newProduct.image_url,
        is_featured: !!newProduct.is_featured,
        brand: newProduct.brand || '',
        price: isNaN(cleanPrice) ? 0 : cleanPrice,
        slug: generatedSlug
      }]).select();

      if (error) {
        console.error("Errore Database:", error);
        alert(`Errore: ${error.message}`);
      } else {
        alert("ARTICOLO PUBBLICATO CON SUCCESSO!");
        setNewProduct({ name: '', description: '', category_id: '', image_url: '', is_featured: false, brand: '', price: '' });
      }
    } catch (err) {
      alert("Errore tecnico nel modulo");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-xl space-y-4">
          <Lock className="mx-auto text-rose-400" size={40} />
          <input type="password" placeholder="Password Admin" className="border p-3 rounded-full text-center block w-full outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-rose-400 text-white p-3 rounded-full font-bold">ACCEDI</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pt-32 space-y-12">
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-3xl font-serif italic mb-8 flex items-center gap-2"><PlusCircle /> Nuovo Prodotto</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="border-2 border-dashed border-rose-200 h-48 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-rose-50/20">
              {newProduct.image_url ? (
                <img src={newProduct.image_url} className="w-full h-full object-cover" />
              ) : (
                <div className="text-rose-400 flex flex-col items-center">
                  {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
                  <span className="text-sm font-bold mt-2">CARICA FOTO</span>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          <input type="text" placeholder="Nome Articolo" className="border p-4 rounded-2xl outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
          <input type="text" placeholder="Marchio" className="border p-4 rounded-2xl outline-none" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
          <input type="text" placeholder="Prezzo (es: 25.00)" className="border p-4 rounded-2xl outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
          <select className="border p-4 rounded-2xl outline-none" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
            <option value="">Scegli Categoria...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <textarea placeholder="Descrizione" className="md:col-span-2 border p-4 rounded-2xl h-24 outline-none" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
          <div className="flex items-center gap-3 px-2">
            <input type="checkbox" id="feat" checked={newProduct.is_featured} onChange={e => setNewProduct({...newProduct, is_featured: e.target.checked})} />
            <label htmlFor="feat" className="text-gray-600 italic">Metti in evidenza</label>
          </div>
          <button className="md:col-span-2 bg-slate-800 text-white p-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-colors">PUBBLICA ORA</button>
        </form>
      </section>

      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2"><Database /> Rubrica Iscritti ({subscribers.length})</h2>
        <div className="space-y-4">
          {subscribers.map(s => (
            <div key={s.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <span className="font-bold">{s.name} - {s.phone}</span>
              <a href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} target="_blank" className="bg-green-500 text-white p-2 rounded-full"><MessageCircle size={20}/></a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}