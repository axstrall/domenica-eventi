import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, ArrowLeft, Lock, PlusCircle, Database, Upload, Trash2, Edit2, Check, X, Star, Search, Tag, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminPage() {
  // IMPOSTA QUI LA TUA PASSWORD REALE
  const PASSWORD_CORRETTA = "Domenica2026!"; 

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
  
  const [editForm, setEditForm] = useState({ name: '', price: '', discount_price: '', brand_id: '' });

  const [newProduct, setNewProduct] = useState({
    name: '', description: '', category_id: '', image_url: '', is_featured: false, brand_id: '', price: '', discount_price: ''
  });

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
    } catch (err) { console.error("Errore caricamento dati"); }
    setIsLoading(false);
  };

  useEffect(() => { 
    if (isAuthenticated) loadData(); 
  }, [isAuthenticated]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDeleteBrand = async (brandId: string) => {
    if (window.confirm("Vuoi davvero eliminare questo marchio?")) {
      try {
        const { error } = await supabase.from('brands').delete().eq('id', brandId);
        if (error) throw error;
        loadData();
      } catch (err: any) { alert("Errore: " + err.message); }
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo contatto?")) {
      try {
        const response = await fetch('/api/delete-subscriber', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, password }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Errore");
        alert("Contatto eliminato!");
        loadData();
      } catch (err: any) { alert("Errore: " + err.message); }
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanPrice = parseFloat(newProduct.price.toString().replace(',', '.'));
      const cleanDiscount = newProduct.discount_price ? parseFloat(newProduct.discount_price.toString().replace(',', '.')) : null;
      
      const selectedBrand = brands.find(b => b.id === newProduct.brand_id);
      
      const { error } = await supabase.from('products').insert([{
        ...newProduct, 
        brand: selectedBrand ? selectedBrand.name : null,
        price: isNaN(cleanPrice) ? 0 : cleanPrice,
        discount_price: cleanDiscount,
        slug: newProduct.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000)
      }]);
      
      if (error) throw error;
      alert("Prodotto Caricato!");
      loadData();
      setNewProduct({ name: '', description: '', category_id: '', image_url: '', is_featured: false, brand_id: '', price: '', discount_price: '' });
    } catch (err: any) { alert(err.message); }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    await supabase.from('products').update({ is_featured: !currentStatus }).eq('id', id);
    loadData();
  };

  const saveEdit = async (id: string) => {
    const cleanPrice = parseFloat(editForm.price.replace(',', '.'));
    const cleanDiscount = editForm.discount_price ? parseFloat(editForm.discount_price.replace(',', '.')) : null;

    const { error } = await supabase.from('products').update({
      name: editForm.name,
      price: isNaN(cleanPrice) ? 0 : cleanPrice,
      discount_price: cleanDiscount,
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
            if (password === PASSWORD_CORRETTA) {
              setIsAuthenticated(true); 
            } else {
              alert("Password Errata! Accesso negato.");
            }
          }} 
          className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-sm text-center border border-rose-100"
        >
          <Lock className="mx-auto text-rose-300 mb-6" size={40} />
          <input 
            type="password" 
            placeholder="Password Amministratore" 
            className="w-full p-4 rounded-2xl bg-rose-50 mb-4 text-center border border-rose-100 outline-none focus:border-rose-300" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button className="w-full bg-rose-400 text-white p-4 rounded-2xl font-bold uppercase shadow-lg hover:bg-rose-500 transition-all">
            Entra nel Pannello
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pt-24 space-y-12 pb-20 font-sans">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-rose-400 font-bold italic flex items-center gap-2 hover:underline">
          <ArrowLeft size={18} /> Torna al Sito
        </Link>
        <button onClick={() => window.location.reload()} className="text-xs text-gray-400 uppercase tracking-widest font-bold">Esci</button>
      </div>

      {/* GESTIONE MARCHI */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2 text-gray-800 tracking-tight"><Tag className="text-rose-400"/> Marchi</h2>
        <form onSubmit={async (e) => { e.preventDefault(); await supabase.from('brands').insert([{ name: newBrandName }]); setNewBrandName(''); loadData(); }} className="flex gap-4 mb-6">
          <input type="text" placeholder="Aggiungi Marchio..." className="flex-1 border p-4 rounded-2xl outline-none" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} />
          <button className="bg-rose-400 text-white px-6 rounded-2xl font-bold uppercase"><PlusCircle /></button>
        </form>
        <div className="flex flex-wrap gap-2">
          {brands.map(b => (
            <div key={b.id} className="flex items-center gap-2 bg-rose-50 text-rose-500 px-4 py-2 rounded-full border border-rose-100 uppercase">
              <span className="text-[10px] font-bold tracking-widest">{b.name}</span>
              <button onClick={() => handleDeleteBrand(b.id)}><X size={14} /></button>
            </div>
          ))}
        </div>
      </section>

      {/* PUBBLICA NUOVO ARTICOLO */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-8 text-gray-800 tracking-tight">Pubblica Nuovo Articolo</h2>
        <form onSubmit={handleAddProduct} className="grid gap-6">
          <label className="border-2 border-dashed border-rose-200 h-48 rounded-[2.5rem] flex items-center justify-center cursor-pointer bg-rose-50/20 overflow-hidden shadow-inner hover:bg-rose-50/40 transition-all">
            {newProduct.image_url ? <img src={newProduct.image_url} className="w-full h-full object-cover" alt="Anteprima" /> : 
              <div className="text-rose-400 flex flex-col items-center gap-2"><Upload size={32} /><span className="font-bold text-xs uppercase tracking-widest">Carica Immagine</span></div>
            }
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" placeholder="Nome Articolo" className="border p-4 rounded-2xl outline-none shadow-sm focus:border-rose-300" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            <input type="text" placeholder="Prezzo Pieno (€)" className="border p-4 rounded-2xl outline-none shadow-sm focus:border-rose-300" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            
            <div className="relative">
              <Percent className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400" size={18} />
              <input type="text" placeholder="Prezzo Scontato (€)" className="w-full border p-4 rounded-2xl outline-none border-red-100 bg-red-50/30 focus:border-red-300" value={newProduct.discount_price} onChange={e => setNewProduct({...newProduct, discount_price: e.target.value})} />
            </div>

            <select className="border p-4 rounded-2xl outline-none bg-white shadow-sm" value={newProduct.brand_id} onChange={e => setNewProduct({...newProduct, brand_id: e.target.value})}>
              <option value="">Seleziona Marchio...</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select className="border p-4 rounded-2xl outline-none bg-white lg:col-span-2 shadow-sm" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
              <option value="">Seleziona Categoria...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button className="bg-slate-900 text-white p-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-rose-500 transition-all shadow-lg">Aggiungi al Catalogo</button>
        </form>
      </section>

      {/* CATALOGO */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-serif italic text-gray-800 tracking-tight">Catalogo ({filteredProducts.length})</h2>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" size={18} />
            <input type="text" placeholder="Cerca per nome..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-2xl bg-rose-50/50 border border-rose-100 outline-none text-sm focus:border-rose-300 transition-all" />
          </div>
        </div>

        <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredProducts.map(p => (
            <div key={p.id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:bg-rose-50/30 transition-all">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img src={p.image_url} className="w-20 h-20 rounded-2xl object-cover border border-white shadow-md" alt={p.name} />
                  {p.discount_price && <div className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 shadow-lg"><Percent size={12}/></div>}
                </div>
                {editingId === p.id ? (
                  <div className="flex flex-col gap-2">
                    <input className="border px-4 py-1 rounded-xl text-sm outline-none focus:border-blue-300" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    <div className="flex gap-2">
                      <input placeholder="Pieno" className="border px-4 py-1 rounded-xl text-sm w-20 outline-none focus:border-blue-300" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                      <input placeholder="Sconto" className="border px-4 py-1 rounded-xl text-sm w-20 bg-red-50 border-red-200 outline-none focus:border-red-300" value={editForm.discount_price} onChange={e => setEditForm({...editForm, discount_price: e.target.value})} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-gray-800 leading-tight">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {p.discount_price ? (
                        <>
                          <p className="text-xs text-red-500 font-bold uppercase">€{p.discount_price}</p>
                          <p className="text-[10px] text-gray-400 line-through font-bold uppercase">€{p.price}</p>
                        </>
                      ) : <p className="text-xs text-rose-400 font-bold uppercase">€{p.price}</p>}
                    </div>
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
                  <button onClick={() => { setEditingId(p.id); setEditForm({name: p.name, price: p.price.toString(), discount_price: p.discount_price?.toString() || '', brand_id: p.brand_id || ''}); }} className="bg-white text-blue-400 p-3 rounded-full border border-blue-50 shadow-sm hover:bg-blue-50"><Edit2 size={20}/></button>
                )}
                <button onClick={async () => { if(confirm("Eliminare?")) { await supabase.from('products').delete().eq('id', p.id); loadData(); } }} className="bg-white text-rose-400 p-3 rounded-full border border-rose-50 shadow-sm hover:bg-rose-50"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RUBRICA */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2 text-gray-800 tracking-tight"><Database className="text-rose-400"/> Rubrica ({subscribers.length})</h2>
        <div className="space-y-3">
          {subscribers.map(s => (
            <div key={s.id} className="flex justify-between items-center p-6 bg-rose-50/20 rounded-[2.5rem] border border-rose-100 shadow-sm">
              <div className="flex items-center gap-4">
                <button onClick={() => handleDeleteSubscriber(s.id)} className="text-rose-300 hover:text-rose-600 p-2 bg-white rounded-full border border-rose-50 shadow-sm transition-all"><Trash2 size={18}/></button>
                <div>
                  <p className="font-bold text-gray-800 text-lg leading-tight">{s.name}</p>
                  <p className="text-sm text-gray-500 font-mono italic mt-1">{s.phone}</p>
                </div>
              </div>
              <a href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all">
                <MessageCircle size={24}/>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}