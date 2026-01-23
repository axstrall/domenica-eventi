import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, ArrowLeft, Lock, PlusCircle, Database, Upload, Loader2, Trash2, Edit2, Check, X, Star, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', brand_id: '' });

  const [newProduct, setNewProduct] = useState({
    name: '', description: '', category_id: '', image_url: '', is_featured: false, brand_id: '', price: ''
  });

  const SECRET_PASSWORD = "Domenica2024";

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carichiamo tutto in parallelo
      const [subsRes, catsRes, brndsRes, prodsRes] = await Promise.all([
        supabase.from('whatsapp_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('brands').select('*').order('name'),
        // QUERY RESILIENTE: Carica i prodotti e i marchi in modo che nulla sparisca
        supabase.from('products').select('*, brands(name)').order('created_at', { ascending: false })
      ]);

      if (subsRes.data) setSubscribers(subsRes.data);
      if (catsRes.data) setCategories(catsRes.data);
      if (brndsRes.data) setBrands(brndsRes.data);
      if (prodsRes.data) setProducts(prodsRes.data);
    } catch (err) { console.error("Errore caricamento:", err); }
    setIsLoading(false);
  };

  useEffect(() => { if (isAuthenticated) loadData(); }, [isAuthenticated]);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      const cleanPrice = parseFloat(newProduct.price.toString().replace(',', '.'));
      const slug = (newProduct.name || 'item').toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
      const { error } = await supabase.from('products').insert([{
        ...newProduct, 
        brand_id: newProduct.brand_id || null,
        price: isNaN(cleanPrice) ? 0 : cleanPrice, 
        slug
      }]);
      if (error) throw error;
      alert("Prodotto Caricato!");
      loadData();
      setNewProduct({ name: '', description: '', category_id: '', image_url: '', is_featured: false, brand_id: '', price: '' });
    } catch (err: any) { alert(err.message); }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    await supabase.from('products').update({ is_featured: !currentStatus }).eq('id', id);
    loadData();
  };

  const startEditing = (p: any) => {
    setEditingId(p.id);
    setEditForm({ name: p.name, price: p.price.toString(), brand_id: p.brand_id || '' });
  };

  const saveEdit = async (id: string) => {
    const cleanPrice = parseFloat(editForm.price.replace(',', '.'));
    const { error } = await supabase.from('products').update({
      name: editForm.name,
      price: isNaN(cleanPrice) ? 0 : cleanPrice,
      brand_id: editForm.brand_id || null
    }).eq('id', id);
    if (!error) { setEditingId(null); loadData(); }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Vuoi eliminare definitivamente questo articolo?")) {
      await supabase.from('products').delete().eq('id', id);
      loadData();
    }
  }

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    // Inserimento marchio con ricarica immediata della lista
    const { error } = await supabase.from('brands').insert([{ name: newBrandName.trim() }]);
    if (!error) {
      setNewBrandName('');
      loadData(); 
    } else {
      alert("Errore nell'aggiunta del marchio");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50/50 p-6">
        <h1 className="text-4xl font-serif text-rose-400 italic mb-8">Domenica Admin</h1>
        <form onSubmit={(e) => { e.preventDefault(); if (password === SECRET_PASSWORD) setIsAuthenticated(true); else alert("Password Errata"); }} className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-sm text-center">
          <Lock className="mx-auto text-rose-300 mb-6" size={40} />
          <input type="password" placeholder="Password" className="w-full p-4 rounded-2xl bg-rose-50 mb-4 text-center outline-none border border-rose-100" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-rose-400 text-white p-4 rounded-2xl font-bold uppercase tracking-widest shadow-lg">Entra</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pt-24 space-y-12 pb-20 font-sans">
      <Link to="/" className="text-rose-400 font-bold italic flex items-center mb-4"><ArrowLeft size={20} className="mr-2" /> Torna al Sito</Link>

      {/* GESTIONE MARCHI */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2 text-gray-800"><Tag className="text-rose-400"/> Gestione Marchi</h2>
        <form onSubmit={handleAddBrand} className="flex gap-4 mb-6">
          <input type="text" placeholder="Nuovo Marchio..." className="flex-1 border p-4 rounded-2xl outline-none" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} />
          <button className="bg-rose-400 text-white px-6 rounded-2xl font-bold uppercase"><PlusCircle /></button>
        </form>
        <div className="flex flex-wrap gap-2">
          {brands.map(b => <span key={b.id} className="bg-rose-50 text-rose-500 px-4 py-2 rounded-full text-xs font-bold border border-rose-100 uppercase tracking-widest">{b.name}</span>)}
        </div>
      </section>

      {/* NUOVO PRODOTTO */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-8">Nuovo Articolo</h2>
        <form onSubmit={handleAddProduct} className="grid gap-6">
          <label className="border-2 border-dashed border-rose-200 h-40 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden bg-rose-50/20">
            {newProduct.image_url ? <img src={newProduct.image_url} className="w-full h-full object-cover" /> : <div className="text-rose-400 flex flex-col items-center"><Upload className="mb-2"/><span>FOTO</span></div>}
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nome" className="border p-4 rounded-2xl outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            <input type="text" placeholder="Prezzo" className="border p-4 rounded-2xl outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            <select className="border p-4 rounded-2xl outline-none text-gray-400 bg-white" value={newProduct.brand_id} onChange={e => setNewProduct({...newProduct, brand_id: e.target.value})}>
              <option value="">Scegli Marchio...</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select className="border p-4 rounded-2xl outline-none text-gray-400 bg-white" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
              <option value="">Categoria...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button className="bg-slate-800 text-white p-5 rounded-2xl font-bold uppercase shadow-lg">Pubblica</button>
        </form>
      </section>

      {/* LISTA PRODOTTI */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif italic text-gray-800">Tutti i Prodotti ({filteredProducts.length})</h2>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18}/><input type="text" placeholder="Cerca..." className="pl-10 pr-4 py-2 border border-rose-100 rounded-full text-sm outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        </div>
        <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredProducts.map(p => (
            <div key={p.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-5">
                <img src={p.image_url} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                {editingId === p.id ? (
                  <div className="flex flex-col gap-2">
                    <input className="border px-3 py-1 rounded-lg text-sm" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    <input className="border px-3 py-1 rounded-lg text-sm w-24" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-gray-800">{p.name}</p>
                    <p className="text-xs text-rose-400 font-bold uppercase tracking-widest">
                      {p.brands?.name || 'Senza Marchio'} — €{p.price}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFeatured(p.id, p.is_featured)} className={`p-3 rounded-full transition-all ${p.is_featured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400'}`}>
                   <Star size={22} fill={p.is_featured ? "currentColor" : "none"} />
                </button>
                {editingId === p.id ? (
                  <>
                    <button onClick={() => saveEdit(p.id)} className="bg-green-500 text-white p-3 rounded-full shadow-md"><Check size={20}/></button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white p-3 rounded-full shadow-md"><X size={20}/></button>
                  </>
                ) : (
                  <button onClick={() => startEditing(p)} className="bg-white text-blue-400 p-3 rounded-full border border-blue-100 shadow-sm"><Edit2 size={20}/></button>
                )}
                <button onClick={() => deleteProduct(p.id)} className="bg-white text-rose-400 p-3 rounded-full border border-rose-100 shadow-sm"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RUBRICA */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2 text-gray-800"><Database className="text-rose-400"/> Rubrica Clienti ({subscribers.length})</h2>
        <div className="space-y-3">
          {subscribers.map(s => (
            <div key={s.id} className="flex justify-between items-center p-5 bg-rose-50/20 rounded-[2rem] border border-rose-100">
              <div><p className="font-bold text-gray-800">{s.name}</p><p className="text-sm text-gray-500">{s.phone}</p></div>
              <a href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} target="_blank" className="bg-green-500 text-white p-3 rounded-full shadow-md"><MessageCircle size={22}/></a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}