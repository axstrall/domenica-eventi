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

  // Stati per la ricerca e la modifica
  const [searchQuery, setSearchQuery] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '' });

  const [newProduct, setNewProduct] = useState({
    name: '', description: '', category_id: '', image_url: '', is_featured: false, brand_id: '', price: ''
  });

  const SECRET_PASSWORD = "Domenica2024";

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subsRes, catsRes, brndsRes, prodsRes] = await Promise.all([
        supabase.from('whatsapp_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('brands').select('*').order('name'),
        // Aggiunto join con brands per vedere il nome nella lista
        supabase.from('products').select('*, brands(name)').order('created_at', { ascending: false })
      ]);

      if (subsRes.data) setSubscribers(subsRes.data);
      if (catsRes.data) setCategories(catsRes.data);
      if (brndsRes.data) setBrands(brndsRes.data);
      if (prodsRes.data) setProducts(prodsRes.data);
    } catch (err) {
      console.error("Errore nel caricamento dei dati:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

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
    } catch (err) { alert("Errore caricamento foto"); } finally { setIsUploading(false); }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName) return;
    const { error } = await supabase.from('brands').insert([{ name: newBrandName }]);
    if (!error) { setNewBrandName(''); loadData(); }
    else { alert("Errore nell'aggiunta del marchio"); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanPrice = parseFloat(newProduct.price.toString().replace(',', '.'));
      const slug = (newProduct.name || 'item').toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
      
      const { error } = await supabase.from('products').insert([{
        name: newProduct.name,
        category_id: newProduct.category_id,
        brand_id: newProduct.brand_id || null,
        image_url: newProduct.image_url,
        is_featured: newProduct.is_featured,
        price: isNaN(cleanPrice) ? 0 : cleanPrice,
        slug: slug
      }]);

      if (error) throw error;
      alert("Prodotto Caricato con Successo!");
      loadData();
      setNewProduct({ name: '', description: '', category_id: '', image_url: '', is_featured: false, brand_id: '', price: '' });
    } catch (err: any) { alert("Errore: " + err.message); }
  };

  // Funzione per la stellina (evidenza)
  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('products').update({ is_featured: !currentStatus }).eq('id', id);
    if (!error) loadData();
  };

  // Funzioni per la modifica nome/prezzo
  const startEditing = (p: any) => {
    setEditingId(p.id);
    setEditForm({ name: p.name, price: p.price.toString() });
  };

  const saveEdit = async (id: string) => {
    const cleanPrice = parseFloat(editForm.price.replace(',', '.'));
    const { error } = await supabase.from('products').update({
      name: editForm.name,
      price: isNaN(cleanPrice) ? 0 : cleanPrice
    }).eq('id', id);
    if (!error) {
      setEditingId(null);
      loadData();
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Vuoi eliminare definitivamente questo articolo?")) {
      await supabase.from('products').delete().eq('id', id);
      loadData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50/50 p-6">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-rose-400 italic tracking-tighter mb-2">Domenica</h1>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400 font-light">Eventi & Atelier</p>
        </div>
        <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-rose-100 max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-rose-200"></div>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-50 rounded-full mb-8 border border-rose-100">
            <Lock className="text-rose-400 animate-pulse" size={32} />
          </div>
          <h2 className="text-2xl font-serif text-gray-800 mb-8 italic">Area Riservata</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (password === SECRET_PASSWORD) setIsAuthenticated(true); else alert("Accesso Negato"); }} className="space-y-6">
            <input 
              type="password" placeholder="Password Admin" 
              className="w-full px-8 py-5 rounded-full bg-rose-50/50 border border-rose-100 text-center outline-none focus:ring-2 focus:ring-rose-300 transition-all font-medium shadow-sm"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
            <button className="w-full bg-rose-400 text-white py-5 rounded-full font-bold uppercase tracking-widest shadow-lg hover:bg-rose-500 transition-all">Accedi</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pt-24 space-y-12 pb-20 font-sans">
      <Link to="/" className="text-rose-400 font-bold italic flex items-center mb-4 hover:underline"><ArrowLeft size={20} className="mr-2" /> Torna al Sito</Link>

      {/* 1. GESTIONE MARCHI */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2 text-gray-800"><Tag className="text-rose-400"/> Aggiungi Marchio</h2>
        <form onSubmit={handleAddBrand} className="flex gap-4 mb-6">
          <input type="text" placeholder="Nome Marchio (es: Hervit)" className="flex-1 border p-4 rounded-2xl outline-none" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} />
          <button className="bg-rose-400 text-white px-6 rounded-2xl font-bold uppercase hover:bg-rose-500 transition-colors shadow-md"><PlusCircle /></button>
        </form>
        <div className="flex flex-wrap gap-2">
          {brands.map(b => (
            <span key={b.id} className="bg-rose-50 text-rose-500 px-4 py-2 rounded-full text-xs font-bold border border-rose-100 uppercase italic">{b.name}</span>
          ))}
        </div>
      </section>

      {/* 2. NUOVO ARTICOLO */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-3xl font-serif italic mb-8 text-gray-800">Nuovo Articolo</h2>
        <form onSubmit={handleAddProduct} className="grid gap-6">
          <label className="border-2 border-dashed border-rose-200 h-48 rounded-3xl flex items-center justify-center cursor-pointer bg-rose-50/20 hover:bg-rose-50/40 transition-all overflow-hidden shadow-inner">
            {newProduct.image_url ? <img src={newProduct.image_url} className="w-full h-full object-cover" /> : <div className="text-rose-400 flex flex-col items-center"><Upload className="mb-2"/><span>CARICA FOTO</span></div>}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nome Prodotto" className="border p-4 rounded-2xl outline-none focus:ring-2 ring-rose-100" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            <select className="border p-4 rounded-2xl outline-none text-gray-500 bg-white" value={newProduct.brand_id} onChange={e => setNewProduct({...newProduct, brand_id: e.target.value})}>
              <option value="">Nessun Marchio</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input type="text" placeholder="Prezzo" className="border p-4 rounded-2xl outline-none focus:ring-2 ring-rose-100" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            <select className="border p-4 rounded-2xl outline-none text-gray-500 bg-white" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
              <option value="">Scegli Categoria...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 bg-rose-50 p-4 rounded-2xl border border-rose-100">
            <input type="checkbox" id="feat" checked={newProduct.is_featured} onChange={e => setNewProduct({...newProduct, is_featured: e.target.checked})} className="w-5 h-5 accent-rose-400 cursor-pointer" />
            <label htmlFor="feat" className="text-rose-400 font-bold italic cursor-pointer">Metti in evidenza nella Home Page</label>
          </div>
          <button className="bg-slate-800 text-white p-5 rounded-2xl font-bold uppercase shadow-lg hover:bg-rose-500 transition-all">Pubblica Prodotto</button>
        </form>
      </section>

      {/* 3. LISTA PRODOTTI */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif italic text-gray-800">Lista Prodotti ({filteredProducts.length})</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Cerca..." className="pl-10 pr-4 py-2 border border-rose-100 rounded-full outline-none text-sm w-full shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredProducts.map(p => (
            <div key={p.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-rose-50/30 transition-all gap-4">
              <div className="flex items-center gap-5">
                <img src={p.image_url} className="w-16 h-16 rounded-xl object-cover shadow-sm border border-white" />
                {editingId === p.id ? (
                  <div className="flex flex-col gap-2">
                    <input className="border p-2 rounded-lg text-sm" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    <input className="border p-2 rounded-lg text-sm w-24" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-gray-800">{p.name}</p>
                    <p className="text-xs text-rose-400 font-bold uppercase">
                      {p.brands?.name || 'Senza Marchio'} — €{p.price}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 self-end">
                {/* Stellina per Home Page */}
                <button onClick={() => toggleFeatured(p.id, p.is_featured)} className={`p-2 rounded-full transition-all ${p.is_featured ? 'text-yellow-500 bg-yellow-50 shadow-sm' : 'text-gray-300 hover:text-yellow-400'}`}>
                   <Star size={20} fill={p.is_featured ? "currentColor" : "none"} />
                </button>

                {/* Pulsanti Modifica */}
                {editingId === p.id ? (
                  <>
                    <button onClick={() => saveEdit(p.id)} className="bg-green-500 text-white p-2 rounded-full shadow-sm"><Check size={20}/></button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white p-2 rounded-full shadow-sm"><X size={20}/></button>
                  </>
                ) : (
                  <button onClick={() => startEditing(p)} className="bg-white text-blue-400 p-2 rounded-full border border-blue-100 shadow-sm hover:bg-blue-50 transition-all"><Edit2 size={20}/></button>
                )}

                <button onClick={() => deleteProduct(p.id)} className="bg-white text-rose-400 p-2 rounded-full border border-rose-100 shadow-sm hover:bg-rose-50 transition-all"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. RUBRICA CLIENTI */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2 text-gray-800"><Database className="text-rose-400"/> Rubrica Clienti ({subscribers.length})</h2>
        <div className="space-y-3">
          {subscribers.map(s => (
            <div key={s.id} className="flex justify-between items-center p-4 bg-rose-50/20 rounded-2xl border border-rose-100 hover:bg-rose-50/40 transition-all shadow-sm">
              <div><p className="font-bold text-gray-800 font-serif">{s.name}</p><p className="text-sm text-gray-500 font-mono">{s.phone}</p></div>
              <a href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} target="_blank" className="bg-green-500 text-white p-3 rounded-full shadow-md hover:bg-green-600 transition-all hover:scale-110"><MessageCircle size={20}/></a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}