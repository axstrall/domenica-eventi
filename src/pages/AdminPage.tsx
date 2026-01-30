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

  // --- SICUREZZA MASSIMA ---
  // Carichiamo la password dalle variabili d'ambiente (file .env o Vercel)
  const SECRET_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: subs } = await supabase.from('whatsapp_subscribers').select('*').order('created_at', { ascending: false });
      const { data: cats } = await supabase.from('categories').select('*').order('name');
      const { data: brnds } = await supabase.from('brands').select('*').order('name');
      const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false });

      setSubscribers(subs || []);
      setCategories(cats || []);
      setBrands(brnds || []);
      setProducts(prods || []);
    } catch (err) { console.error("Errore caricamento"); }
    setIsLoading(false);
  };

  useEffect(() => { 
    if (isAuthenticated) loadData(); 
  }, [isAuthenticated]);

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
      const { error } = await supabase.from('products').insert([{
        ...newProduct, 
        price: isNaN(cleanPrice) ? 0 : cleanPrice, 
        slug: newProduct.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000)
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

  const saveEdit = async (id: string) => {
    const cleanPrice = parseFloat(editForm.price.replace(',', '.'));
    const { error } = await supabase.from('products').update({
      name: editForm.name,
      price: isNaN(cleanPrice) ? 0 : cleanPrice,
      brand_id: editForm.brand_id || null
    }).eq('id', id);
    if (!error) { setEditingId(null); loadData(); }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50/50 p-6 font-sans">
        <h1 className="text-4xl font-serif text-rose-400 italic mb-8 uppercase text-center tracking-tighter">Domenica Admin</h1>
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            if (password === SECRET_PASSWORD) {
              setIsAuthenticated(true);
            } else {
              alert("Password errata!");
            }
          }} 
          className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-sm text-center border border-rose-100"
        >
          <Lock className="mx-auto text-rose-300 mb-6" size={40} />
          <input 
            type="password" 
            placeholder="Password Segreta" 
            className="w-full p-4 rounded-2xl bg-rose-50 mb-4 text-center border border-rose-100 outline-none" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button className="w-full bg-rose-400 text-white p-4 rounded-2xl font-bold uppercase shadow-lg hover:bg-rose-500 transition-all">Entra nel Pannello</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pt-24 space-y-12 pb-20 font-sans">
      <Link to="/" className="text-rose-400 font-bold italic mb-4 flex items-center gap-2 hover:underline">
        <ArrowLeft size={18} /> Torna al Sito
      </Link>

      {/* GESTIONE MARCHI */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2 text-gray-800 tracking-tight">
          <Tag className="text-rose-400"/> Marchi Trattati
        </h2>
        <form onSubmit={async (e) => { e.preventDefault(); await supabase.from('brands').insert([{ name: newBrandName }]); setNewBrandName(''); loadData(); }} className="flex gap-4 mb-6">
          <input type="text" placeholder="Aggiungi Marchio..." className="flex-1 border p-4 rounded-2xl outline-none shadow-sm focus:border-rose-300 transition-all" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} />
          <button className="bg-rose-400 text-white px-6 rounded-2xl font-bold uppercase shadow-md hover:bg-rose-500 transition-all"><PlusCircle /></button>
        </form>
        <div className="flex flex-wrap gap-2">
          {brands.map(b => <span key={b.id} className="bg-rose-50 text-rose-500 px-4 py-2 rounded-full text-[10px] font-bold border border-rose-100 uppercase tracking-widest">{b.name}</span>)}
        </div>
      </section>

      {/* NUOVO ARTICOLO */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-8 text-gray-800 tracking-tight">Pubblica Nuovo Articolo</h2>
        <form onSubmit={handleAddProduct} className="grid gap-6">
          <label className="border-2 border-dashed border-rose-200 h-48 rounded-[2.5rem] flex items-center justify-center cursor-pointer bg-rose-50/20 overflow-hidden shadow-inner hover:bg-rose-50/40 transition-all">
            {newProduct.image_url ? 
              <img src={newProduct.image_url} className="w-full h-full object-cover" alt="Anteprima" /> : 
              <div className="text-rose-400 flex flex-col items-center gap-2">
                <Upload size={32} />
                <span className="font-bold text-xs uppercase tracking-widest">Carica Immagine</span>
              </div>
            }
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nome Articolo" className="border p-4 rounded-2xl outline-none shadow-sm focus:border-rose-300" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            <input type="text" placeholder="Prezzo (€)" className="border p-4 rounded-2xl outline-none shadow-sm focus:border-rose-300" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            <select className="border p-4 rounded-2xl outline-none bg-white shadow-sm" value={newProduct.brand_id} onChange={e => setNewProduct({...newProduct, brand_id: e.target.value})}>
              <option value="">Seleziona Marchio...</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select className="border p-4 rounded-2xl outline-none bg-white shadow-sm" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
              <option value="">Seleziona Categoria...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button className="bg-slate-900 text-white p-5 rounded-2xl font-bold uppercase shadow-lg hover:bg-rose-500 transition-all tracking-widest text-xs">Aggiungi al Catalogo</button>
        </form>
      </section>

      {/* CATALOGO */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-8 text-gray-800 tracking-tight">Catalogo Attuale ({products.length})</h2>
        <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:bg-rose-50/30 transition-all shadow-sm">
              <div className="flex items-center gap-5">
                <img src={p.image_url} className="w-20 h-20 rounded-2xl object-cover border border-white shadow-md" alt={p.name} />
                {editingId === p.id ? (
                  <div className="flex flex-col gap-2">
                    <input className="border px-4 py-1 rounded-xl text-sm outline-none" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    <input className="border px-4 py-1 rounded-xl text-sm w-24 outline-none" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-gray-800 leading-tight">{p.name}</p>
                    <p className="text-xs text-rose-400 font-bold uppercase mt-1">€{p.price}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFeatured(p.id, p.is_featured)} className={`p-3 rounded-full transition-all ${p.is_featured ? 'text-yellow-500 bg-yellow-50 shadow-inner' : 'text-gray-300 bg-white shadow-sm'}`}>
                  <Star size={20} fill={p.is_featured ? "currentColor" : "none"} />
                </button>
                {editingId === p.id ? (
                  <button onClick={() => saveEdit(p.id)} className="bg-green-500 text-white p-3 rounded-full shadow-md"><Check size={20}/></button>
                ) : (
                  <button onClick={() => { setEditingId(p.id); setEditForm({name: p.name, price: p.price.toString(), brand_id: p.brand_id || ''}); }} className="bg-white text-blue-400 p-3 rounded-full border border-blue-50 shadow-sm"><Edit2 size={20}/></button>
                )}
                <button onClick={async () => { if(confirm("Eliminare definitivamente?")) { await supabase.from('products').delete().eq('id', p.id); loadData(); } }} className="bg-white text-rose-400 p-3 rounded-full border border-rose-50 shadow-sm"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RUBRICA CLIENTI */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2 text-gray-800 tracking-tight">
          <Database className="text-rose-400"/> Rubrica Clienti ({subscribers.length})
        </h2>
        <div className="space-y-3">
          {subscribers.map(s => (
            <div key={s.id} className="flex justify-between items-center p-6 bg-rose-50/20 rounded-[2.5rem] border border-rose-100 shadow-sm hover:shadow-md transition-all">
              <div>
                <p className="font-bold text-gray-800 text-lg leading-tight">{s.name}</p>
                <p className="text-sm text-gray-500 font-mono italic mt-1">{s.phone}</p>
              </div>
              <a 
                href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:rotate-12"
              >
                <MessageCircle size={24}/>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}