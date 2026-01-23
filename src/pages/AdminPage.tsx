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
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', category_id: '', image_url: '', is_featured: false, brand_id: '', price: ''
  });

  const SECRET_PASSWORD = "Domenica2024";

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carichiamo tutto separatamente per evitare blocchi
      const { data: subs } = await supabase.from('whatsapp_subscribers').select('*').order('created_at', { ascending: false });
      const { data: cats } = await supabase.from('categories').select('*').order('name');
      const { data: brnds } = await supabase.from('brands').select('*').order('name');
      
      // QUERY MODIFICATA: Prendiamo tutti i prodotti senza filtri stringenti
      const { data: prods } = await supabase
        .from('products')
        .select('*, brands(name)') 
        .order('created_at', { ascending: false });

      if (subs) setSubscribers(subs);
      if (cats) setCategories(cats);
      if (brnds) setBrands(brnds);
      if (prods) setProducts(prods);
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

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName) return;
    const { error } = await supabase.from('brands').insert([{ name: newBrandName }]);
    if (!error) { setNewBrandName(''); loadData(); }
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
      alert("Prodotto Caricato!");
      loadData();
      setNewProduct({ name: '', description: '', category_id: '', image_url: '', is_featured: false, brand_id: '', price: '' });
    } catch (err: any) { alert("Errore: " + err.message); }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Eliminare definitivamente?")) {
      await supabase.from('products').delete().eq('id', id);
      loadData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50/50 p-6">
        <h1 className="text-4xl font-serif text-rose-400 italic mb-10 text-center">Domenica</h1>
        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-rose-100 max-w-md w-full">
          <form onSubmit={(e) => { e.preventDefault(); if (password === SECRET_PASSWORD) setIsAuthenticated(true); else alert("Accesso Negato"); }} className="space-y-6">
            <input type="password" placeholder="Password" className="w-full px-8 py-5 rounded-full bg-rose-50 border border-rose-100 text-center" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="w-full bg-rose-400 text-white py-5 rounded-full font-bold uppercase shadow-lg">Entra</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pt-24 space-y-12 pb-20 font-sans">
      <Link to="/" className="text-rose-400 font-bold italic flex items-center mb-4"><ArrowLeft size={20} className="mr-2" /> Torna al Sito</Link>

      {/* GESTIONE MARCHI */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2 text-gray-800"><Tag className="text-rose-400"/> Aggiungi Marchio</h2>
        <form onSubmit={handleAddBrand} className="flex gap-4 mb-6">
          <input type="text" placeholder="Nome Marchio (es: Hervit)" className="flex-1 border p-4 rounded-2xl" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} />
          <button className="bg-rose-400 text-white px-6 rounded-2xl font-bold uppercase"><PlusCircle /></button>
        </form>
        <div className="flex flex-wrap gap-2">
          {brands.map(b => (
            <span key={b.id} className="bg-rose-50 text-rose-500 px-4 py-2 rounded-full text-xs font-bold border border-rose-100 uppercase tracking-tighter">{b.name}</span>
          ))}
        </div>
      </section>

      {/* CARICAMENTO PRODOTTO */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-3xl font-serif italic mb-8">Nuovo Articolo</h2>
        <form onSubmit={handleAddProduct} className="grid gap-6">
          <label className="border-2 border-dashed border-rose-200 h-40 rounded-3xl flex items-center justify-center cursor-pointer bg-rose-50/20">
            {newProduct.image_url ? <img src={newProduct.image_url} className="w-full h-full object-cover" /> : <Upload className="text-rose-400" />}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nome" className="border p-4 rounded-2xl" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            <select className="border p-4 rounded-2xl text-gray-500" value={newProduct.brand_id} onChange={e => setNewProduct({...newProduct, brand_id: e.target.value})}>
              <option value="">Nessun Marchio</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input type="text" placeholder="Prezzo" className="border p-4 rounded-2xl" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            <select className="border p-4 rounded-2xl text-gray-500" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
              <option value="">Scegli Categoria...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button className="bg-slate-800 text-white p-5 rounded-2xl font-bold uppercase">Pubblica Prodotto</button>
        </form>
      </section>

      {/* LISTA PRODOTTI RECUPERATA */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif italic text-gray-800">Tutti i Prodotti ({filteredProducts.length})</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Cerca..." className="pl-10 pr-4 py-2 border border-rose-100 rounded-full outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredProducts.map(p => (
            <div key={p.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-5">
                <img src={p.image_url} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                <div>
                  <p className="font-bold text-gray-800">{p.name}</p>
                  <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">
                    {p.brands?.name || 'VECCHIO DATO'}
                  </p>
                </div>
              </div>
              <button onClick={() => deleteProduct(p.id)} className="bg-white text-rose-400 p-3 rounded-full border border-rose-100">
                <Trash2 size={20}/>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}