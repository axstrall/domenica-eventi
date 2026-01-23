import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, ArrowLeft, Lock, PlusCircle, Database, Upload, Loader2, Trash2, Edit2, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Stati per la modifica
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', brand: '', price: '' });

  const [newProduct, setNewProduct] = useState({
    name: '', description: '', category_id: '', image_url: '', is_featured: true, brand: '', price: ''
  });

  const SECRET_PASSWORD = "Domenica2024";

  const loadData = async () => {
    setIsLoading(true);
    const [subs, cats, prods] = await Promise.all([
      supabase.from('whatsapp_subscribers').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('*').order('created_at', { ascending: false })
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

  // Funzioni per la Modifica Rapida
  const startEditing = (product: any) => {
    setEditingId(product.id);
    setEditForm({ name: product.name, brand: product.brand || '', price: product.price.toString() });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    try {
      const cleanPrice = parseFloat(editForm.price.replace(',', '.'));
      const { error } = await supabase
        .from('products')
        .update({ 
          name: editForm.name, 
          brand: editForm.brand, 
          price: isNaN(cleanPrice) ? 0 : cleanPrice 
        })
        .eq('id', id);

      if (error) throw error;
      setEditingId(null);
      loadData();
      alert("Modifica salvata!");
    } catch (err: any) {
      alert("Errore modifica: " + err.message);
    }
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
        <form onSubmit={(e) => { e.preventDefault(); if (password === SECRET_PASSWORD) setIsAuthenticated(true); else alert("Password errata!"); }} className="bg-white p-10 rounded-3xl shadow-xl">
          <input type="password" placeholder="Password Admin" className="border p-4 rounded-full text-center outline-none w-full" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-rose-400 text-white p-4 rounded-full mt-4 font-bold uppercase tracking-widest">ENTRA</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pt-24 space-y-12">
      <Link to="/" className="text-rose-400 font-bold italic flex items-center mb-4"><ArrowLeft size={20} className="mr-2" /> Torna al Sito</Link>

      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-3xl font-serif italic mb-8">Nuovo Prodotto</h2>
        <form onSubmit={handleAddProduct} className="grid gap-6">
          <label className="border-2 border-dashed border-rose-200 h-40 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden bg-rose-50/20">
            {newProduct.image_url ? <img src={newProduct.image_url} className="w-full h-full object-cover" /> : <div className="text-rose-400 flex flex-col items-center">{isUploading ? <Loader2 className="animate-spin"/> : <Upload />}<span>CARICA FOTO</span></div>}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nome" className="border p-4 rounded-2xl outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            <input type="text" placeholder="Marchio" className="border p-4 rounded-2xl outline-none" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} required />
            <input type="text" placeholder="Prezzo" className="border p-4 rounded-2xl outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            <select className="border p-4 rounded-2xl outline-none" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
              <option value="">Scegli Categoria...</option>
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
            <div key={p.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100 gap-4">
              <div className="flex items-center gap-6">
                <img src={p.image_url} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                {editingId === p.id ? (
                  <div className="grid grid-cols-1 gap-2">
                    <input type="text" className="border px-3 py-1 rounded-lg text-sm" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    <input type="text" className="border px-3 py-1 rounded-lg text-sm" value={editForm.brand} onChange={e => setEditForm({...editForm, brand: e.target.value})} />
                    <input type="text" className="border px-3 py-1 rounded-lg text-sm w-24" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{p.name}</p>
                    <p className="text-sm text-gray-500 italic">{p.brand || 'Nessun Marchio'} — €{p.price}</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 self-end md:self-center">
                {editingId === p.id ? (
                  <>
                    <button onClick={() => saveEdit(p.id)} className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-all shadow-md"><Check size={20}/></button>
                    <button onClick={cancelEditing} className="bg-gray-400 text-white p-3 rounded-full hover:bg-gray-500 transition-all shadow-md"><X size={20}/></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(p)} className="text-slate-400 p-3 hover:bg-white hover:text-rose-400 rounded-full transition-all border border-transparent hover:border-rose-100"><Edit2 size={20}/></button>
                    <button onClick={() => deleteProduct(p.id)} className="text-rose-400 p-3 hover:bg-white hover:text-rose-600 rounded-full transition-all border border-transparent hover:border-rose-100"><Trash2 size={20}/></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6">Rubrica ({subscribers.length})</h2>
        <div className="space-y-3">
          {subscribers.map(s => (
            <div key={s.id} className="flex justify-between items-center p-4 bg-rose-50/20 rounded-2xl border border-rose-100">
              <div><p className="font-bold text-gray-800">{s.name}</p><p className="text-sm text-gray-500">{s.phone}</p></div>
              <a href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} target="_blank" className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 shadow-md"><MessageCircle size={20}/></a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}