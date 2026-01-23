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
      const [subsRes, catsRes, brndsRes, prodsRes] = await Promise.all([
        supabase.from('whatsapp_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('brands').select('*').order('name'),
        supabase.from('products').select('*, brands(name)').order('created_at', { ascending: false })
      ]);

      if (subsRes.data) setSubscribers(subsRes.data);
      if (catsRes.data) setCategories(catsRes.data);
      if (brndsRes.data) setBrands(brndsRes.data);
      if (prodsRes.data) setProducts(prodsRes.data);
    } catch (err) { console.error(err); }
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
        ...newProduct, price: isNaN(cleanPrice) ? 0 : cleanPrice, slug
      }]);
      if (error) throw error;
      loadData();
      setNewProduct({ name: '', description: '', category_id: '', image_url: '', is_featured: false, brand_id: '', price: '' });
    } catch (err: any) { alert(err.message); }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('products').update({ is_featured: !currentStatus }).eq('id', id);
    if (!error) loadData();
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50/50 p-6">
        <h1 className="text-4xl font-serif text-rose-400 italic mb-8">Domenica Admin</h1>
        <form onSubmit={(e) => { e.preventDefault(); if (password === SECRET_PASSWORD) setIsAuthenticated(true); else alert("Negato"); }} className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-sm">
          <input type="password" placeholder="Password" className="w-full p-4 rounded-xl bg-rose-50 mb-4 text-center outline-none" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-rose-400 text-white p-4 rounded-xl font-bold uppercase">Entra</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pt-24 space-y-10 pb-20 font-sans">
      <Link to="/" className="text-rose-400 font-bold italic flex items-center mb-4"><ArrowLeft size={20} className="mr-2" /> Torna al Sito</Link>

      {/* GESTIONE MARCHI */}
      <section className="bg-white p-6 rounded-[2rem] shadow-lg border border-rose-100">
        <h2 className="text-xl font-serif italic mb-4 flex items-center gap-2"><Tag size={20} className="text-rose-400"/> Marchi</h2>
        <div className="flex flex-wrap gap-2">
          {brands.map(b => <span key={b.id} className="bg-rose-50 text-rose-500 px-3 py-1 rounded-full text-xs font-bold border border-rose-100 uppercase">{b.name}</span>)}
        </div>
      </section>

      {/* NUOVO PRODOTTO */}
      <section className="bg-white p-8 rounded-[2rem] shadow-lg border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6">Aggiungi Prodotto</h2>
        <form onSubmit={handleAddProduct} className="grid gap-4">
          <label className="border-2 border-dashed border-rose-200 h-32 rounded-2xl flex items-center justify-center cursor-pointer bg-rose-50/20">
            {newProduct.image_url ? <img src={newProduct.image_url} className="h-full w-full object-cover rounded-2xl" /> : <Upload className="text-rose-400" />}
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nome" className="border p-3 rounded-xl outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            <input type="text" placeholder="Prezzo" className="border p-3 rounded-xl outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            <select className="border p-3 rounded-xl outline-none" value={newProduct.brand_id} onChange={e => setNewProduct({...newProduct, brand_id: e.target.value})}>
              <option value="">Nessun Marchio</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select className="border p-3 rounded-xl outline-none" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
              <option value="">Categoria...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button className="bg-slate-800 text-white p-4 rounded-xl font-bold uppercase">Pubblica</button>
        </form>
      </section>

      {/* LISTA PRODOTTI CON MODIFICA E STELLINA */}
      <section className="bg-white p-8 rounded-[2rem] shadow-lg border border-rose-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif italic">Catalogo ({filteredProducts.length})</h2>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16}/><input type="text" placeholder="Cerca..." className="pl-9 pr-4 py-2 border border-rose-100 rounded-full text-sm outline-none" onChange={(e) => setSearchQuery(e.target.value)} /></div>
        </div>
        <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredProducts.map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-4">
                <img src={p.image_url} className="w-12 h-12 rounded-lg object-cover" />
                {editingId === p.id ? (
                  <div className="flex flex-col gap-1">
                    <input className="border px-2 py-1 rounded text-sm" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    <input className="border px-2 py-1 rounded text-sm w-20" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-sm text-gray-800">{p.name}</p>
                    <p className="text-[10px] text-rose-400 font-bold">€{p.price} — {p.brands?.name || 'No Brand'}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFeatured(p.id, p.is_featured)} className={`p-2 rounded-full ${p.is_featured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300'}`}>
                  <Star size={18} fill={p.is_featured ? "currentColor" : "none"} />
                </button>
                {editingId === p.id ? (
                  <button onClick={() => saveEdit(p.id)} className="text-green-500 p-2"><Check size={18}/></button>
                ) : (
                  <button onClick={() => startEditing(p)} className="text-blue-400 p-2"><Edit2 size={18}/></button>
                )}
                <button onClick={() => deleteProduct(p.id)} className="text-rose-400 p-2"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RUBRICA */}
      <section className="bg-white p-8 rounded-[2rem] shadow-lg border border-rose-100">
        <h2 className="text-xl font-serif italic mb-6 flex items-center gap-2"><Database size={20} className="text-rose-400"/> Rubrica Clienti</h2>
        <div className="space-y-2">
          {subscribers.map(s => (
            <div key={s.id} className="flex justify-between items-center p-4 bg-rose-50/30 rounded-xl border border-rose-100">
              <div><p className="font-bold text-gray-800 text-sm">{s.name}</p><p className="text-xs text-gray-500">{s.phone}</p></div>
              <a href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} target="_blank" className="text-green-500"><MessageCircle size={22}/></a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}