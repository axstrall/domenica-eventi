import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, ArrowLeft, Lock, PlusCircle, Database, Upload, Loader2, Trash2, Edit2, Check, X, Star, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', brand: '', price: '' });

  const [newProduct, setNewProduct] = useState({
    name: '', description: '', category_id: '', image_url: '', is_featured: false, brand: '', price: ''
  });

  const SECRET_PASSWORD = "Domenica2024";

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subs, cats, prods] = await Promise.all([
        supabase.from('whatsapp_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })
      ]);
      if (subs.data) setSubscribers(subs.data);
      if (cats.data) setCategories(cats.data);
      if (prods.data) setProducts(prods.data);
    } catch (err) { console.error(err); }
    setIsLoading(false);
  };

  useEffect(() => { if (isAuthenticated) loadData(); }, [isAuthenticated]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      alert("Prodotto Caricato Correttamente!");
      loadData();
      setNewProduct({ name: '', description: '', category_id: '', image_url: '', is_featured: false, brand: '', price: '' });
    } catch (err: any) { alert("Errore: " + err.message); }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('products').update({ is_featured: !currentStatus }).eq('id', id);
    if (!error) loadData();
  };

  const startEditing = (product: any) => {
    setEditingId(product.id);
    setEditForm({ name: product.name, brand: product.brand || '', price: product.price.toString() });
  };

  const saveEdit = async (id: string) => {
    const cleanPrice = parseFloat(editForm.price.replace(',', '.'));
    const { error } = await supabase.from('products').update({ 
      name: editForm.name, brand: editForm.brand, price: isNaN(cleanPrice) ? 0 : cleanPrice 
    }).eq('id', id);
    if (!error) { setEditingId(null); loadData(); }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Vuoi eliminare definitivamente questo articolo?")) {
      await supabase.from('products').delete().eq('id', id);
      loadData();
    }
  };

  // SCHERMATA DI LOGIN AGGIORNATA
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50/50 p-6">
        {/* Logo Centrale */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-rose-400 italic tracking-tighter mb-2">
            Domenica
          </h1>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400 font-light">
            Eventi & Atelier
          </p>
        </div>

        <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-rose-100 max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-rose-200"></div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-50 rounded-full mb-8 shadow-inner border border-rose-100">
            <Lock className="text-rose-400 animate-pulse" size={32} />
          </div>

          <h2 className="text-2xl font-serif text-gray-800 mb-8 italic">Area Riservata</h2>
          
          <form onSubmit={(e) => { e.preventDefault(); if (password === SECRET_PASSWORD) setIsAuthenticated(true); else alert("Accesso Negato"); }} className="space-y-6">
            <div className="relative">
              <input 
                type="password" 
                placeholder="Inserisci la tua Password" 
                className="w-full px-8 py-5 rounded-full bg-rose-50/50 border border-rose-100 text-center outline-none focus:ring-2 focus:ring-rose-300 transition-all font-medium text-gray-700 placeholder:text-gray-300 shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button className="w-full bg-rose-400 text-white py-5 rounded-full font-bold uppercase tracking-widest shadow-lg hover:bg-rose-500 hover:scale-[1.02] transition-all active:scale-95">
              Accedi al Pannello
            </button>
          </form>

          <Link to="/" className="inline-block mt-10 text-rose-300 hover:text-rose-400 text-sm italic font-medium">
            ← Torna al sito pubblico
          </Link>
        </div>
      </div>
    );
  }

  // IL RESTO DEL CODICE (Pannello Admin)
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pt-24 space-y-12 pb-20">
      <Link to="/" className="text-rose-400 font-bold italic flex items-center mb-4"><ArrowLeft size={20} className="mr-2" /> Torna al Sito</Link>

      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-3xl font-serif italic mb-8">Aggiungi al Catalogo</h2>
        <form onSubmit={handleAddProduct} className="grid gap-6">
          <label className="border-2 border-dashed border-rose-200 h-40 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden bg-rose-50/20">
            {newProduct.image_url ? <img src={newProduct.image_url} className="w-full h-full object-cover" /> : <div className="text-rose-400 flex flex-col items-center">{isUploading ? <Loader2 className="animate-spin"/> : <Upload />}<span>FOTO PRODOTTO</span></div>}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nome Articolo" className="border p-4 rounded-2xl outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            <input type="text" placeholder="Marchio" className="border p-4 rounded-2xl outline-none" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} required />
            <input type="text" placeholder="Prezzo" className="border p-4 rounded-2xl outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            <select className="border p-4 rounded-2xl outline-none" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
              <option value="">Categoria...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 bg-rose-50 p-4 rounded-2xl border border-rose-100">
            <input type="checkbox" id="feat" checked={newProduct.is_featured} onChange={e => setNewProduct({...newProduct, is_featured: e.target.checked})} className="w-5 h-5 accent-rose-400" />
            <label htmlFor="feat" className="text-rose-400 font-bold italic">Metti in evidenza nella Home Page</label>
          </div>
          <button className="bg-slate-800 text-white p-5 rounded-2xl font-bold uppercase tracking-widest shadow-lg hover:bg-rose-500 transition-all">PUBBLICA ORA</button>
        </form>
      </section>

      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-serif italic">Gestione Catalogo ({filteredProducts.length})</h2>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cerca..." 
                className="pl-10 pr-4 py-2 border border-rose-100 rounded-full outline-none focus:ring-2 ring-rose-200 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                className="pl-10 pr-8 py-2 border border-rose-100 rounded-full outline-none appearance-none bg-white focus:ring-2 ring-rose-200 w-full"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Tutte le Categorie</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredProducts.map(p => (
            <div key={p.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-gray-100 gap-4">
              <div className="flex items-center gap-5">
                <img src={p.image_url} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                {editingId === p.id ? (
                  <div className="flex flex-col gap-2">
                    <input type="text" className="border px-3 py-1 rounded-lg text-sm" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    <input type="text" className="border px-3 py-1 rounded-lg text-sm" value={editForm.brand} onChange={e => setEditForm({...editForm, brand: e.target.value})} />
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-gray-800">{p.name}</p>
                    <p className="text-[10px] text-rose-400 font-bold uppercase mb-1">{p.categories?.name}</p>
                    <p className="text-xs text-gray-500">{p.brand} — €{p.price}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFeatured(p.id, p.is_featured)} className={`p-3 rounded-full transition-all ${p.is_featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-400'}`}>
                  <Star size={20} fill={p.is_featured ? "currentColor" : "none"} />
                </button>
                {editingId === p.id ? (
                  <button onClick={() => saveEdit(p.id)} className="bg-green-500 text-white p-3 rounded-full"><Check size={20}/></button>
                ) : (
                  <button onClick={() => startEditing(p)} className="bg-white text-blue-400 p-3 rounded-full border border-blue-100"><Edit2 size={20}/></button>
                )}
                <button onClick={() => deleteProduct(p.id)} className="bg-white text-rose-400 p-3 rounded-full border border-rose-100"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6">Rubrica Clienti ({subscribers.length})</h2>
        <div className="space-y-3">
          {subscribers.map(s => (
            <div key={s.id} className="flex justify-between items-center p-4 bg-rose-50/30 rounded-2xl border border-rose-100">
              <div><p className="font-bold text-gray-800">{s.name}</p><p className="text-sm text-gray-500">{s.phone}</p></div>
              <a href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} target="_blank" className="bg-green-500 text-white p-3 rounded-full"><MessageCircle size={20}/></a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}