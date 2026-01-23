import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, ArrowLeft, Lock, PlusCircle, Database, Upload, Loader2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '', description: '', category_id: '', image_url: '', is_featured: true, brand: '', price: ''
  });

  const SECRET_PASSWORD = "Domenica2024";

  const loadData = async () => {
    setIsLoading(true);
    const [subs, cats, prods] = await Promise.all([
      supabase.from('whatsapp_subscribers').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })
    ]);
    if (subs.data) setSubscribers(subs.data);
    if (cats.data) setCategories(cats.data);
    if (prods.data) setProducts(prods.data);
    setIsLoading(false);
  };

  useEffect(() => { if (isAuthenticated) loadData(); }, [isAuthenticated]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      await supabase.storage.from('product-images').upload(fileName, file);
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setNewProduct({ ...newProduct, image_url: publicUrl });
    } catch (err) { alert("Errore foto"); } finally { setIsUploading(false); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanPrice = parseFloat(newProduct.price.replace(',', '.'));
      const slug = (newProduct.name || 'item').toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
      
      const { error } = await supabase.from('products').insert([{
        name: newProduct.name,
        description: newProduct.description,
        category_id: newProduct.category_id,
        image_url: newProduct.image_url,
        is_featured: newProduct.is_featured,
        brand: newProduct.brand,
        price: cleanPrice,
        slug: slug
      }]);

      if (error) throw error;
      alert("Prodotto Caricato!");
      loadData();
      setNewProduct({ name: '', description: '', category_id: '', image_url: '', is_featured: true, brand: '', price: '' });
    } catch (err: any) { alert("Errore: " + err.message); }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Vuoi davvero eliminare questo prodotto?")) {
      await supabase.from('products').delete().eq('id', id);
      loadData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <form onSubmit={(e) => { e.preventDefault(); if (password === SECRET_PASSWORD) setIsAuthenticated(true); else alert("Wrong!"); }} className="bg-white p-10 rounded-3xl shadow-xl">
          <input type="password" placeholder="Password" className="border p-3 rounded-full text-center" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-rose-400 text-white p-3 rounded-full mt-4">ENTRA</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pt-24 space-y-12">
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-3xl font-serif italic mb-8">Nuovo Prodotto</h2>
        <form onSubmit={handleAddProduct} className="grid gap-6">
          <label className="border-2 border-dashed border-rose-200 h-40 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden bg-rose-50/20">
            {newProduct.image_url ? <img src={newProduct.image_url} className="w-full h-full object-cover" /> : <div className="text-rose-400">{isUploading ? <Loader2 className="animate-spin"/> : <Upload />}</div>}
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nome" className="border p-4 rounded-2xl outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            <input type="text" placeholder="Marchio (Hervit...)" className="border p-4 rounded-2xl outline-none" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} required />
            <input type="text" placeholder="Prezzo" className="border p-4 rounded-2xl outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            <select className="border p-4 rounded-2xl outline-none" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
              <option value="">Categoria...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button className="bg-slate-800 text-white p-5 rounded-2xl font-bold uppercase tracking-widest">PUBBLICA</button>
        </form>
      </section>

      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6">Gestione Prodotti</h2>
        <div className="grid gap-4">
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <img src={p.image_url} className="w-16 h-16 rounded-xl object-cover" />
                <div><p className="font-bold">{p.name}</p><p className="text-sm text-gray-500">{p.brand} - €{p.price}</p></div>
              </div>
              <button onClick={() => deleteProduct(p.id)} className="text-rose-400 p-3 hover:bg-rose-50 rounded-full transition-colors"><Trash2 size={20}/></button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6">Rubrica ({subscribers.length})</h2>
        {subscribers.map(s => (
          <div key={s.id} className="flex justify-between items-center p-4 border-b">
            <span>{s.name} - {s.phone}</span>
            <a href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} target="_blank" className="bg-green-500 text-white p-2 rounded-full"><MessageCircle size={20}/></a>
          </div>
        ))}
      </section>
    </div>
  );
}