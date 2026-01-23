import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, ArrowLeft, Lock, PlusCircle, Database, Upload, Trash2, Edit2, Check, X, Star, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '' });

  const SECRET_PASSWORD = "Domenica2024";

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subsRes, catsRes, brndsRes, prodsRes] = await Promise.all([
        supabase.from('whatsapp_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('brands').select('*').order('name'),
        supabase.from('products').select('*').order('created_at', { ascending: false })
      ]);

      if (subsRes.data) setSubscribers(subsRes.data);
      if (catsRes.data) setCategories(catsRes.data);
      if (brndsRes.data) setBrands(brndsRes.data);
      if (prodsRes.data) setProducts(prodsRes.data);
    } catch (err) { console.error("Errore database"); }
    setIsLoading(false);
  };

  useEffect(() => { if (isAuthenticated) loadData(); }, [isAuthenticated]);

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    await supabase.from('products').update({ is_featured: !currentStatus }).eq('id', id);
    loadData();
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    const { error } = await supabase.from('brands').insert([{ name: newBrandName.trim(), slug: newBrandName.toLowerCase().trim() }]);
    if (!error) { setNewBrandName(''); loadData(); }
    else { alert("Errore: abilita RLS su Supabase per i marchi!"); }
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from('products').update({
      name: editForm.name,
      price: parseFloat(editForm.price.replace(',', '.'))
    }).eq('id', id);
    if (!error) { setEditingId(null); loadData(); }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50/50 p-6">
        <h1 className="text-4xl font-serif text-rose-400 italic mb-8">Domenica Admin</h1>
        <form onSubmit={(e) => { e.preventDefault(); if (password === SECRET_PASSWORD) setIsAuthenticated(true); }} className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-sm text-center">
          <Lock className="mx-auto text-rose-300 mb-6" size={40} />
          <input type="password" placeholder="Password" className="w-full p-4 rounded-2xl bg-rose-50 mb-4 text-center outline-none border border-rose-100" onChange={(e) => setPassword(e.target.value)} required />
          <button className="w-full bg-rose-400 text-white p-4 rounded-2xl font-bold uppercase shadow-lg">Entra</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pt-24 space-y-12 pb-20">
      <Link to="/" className="text-rose-400 font-bold italic mb-4 flex items-center"><ArrowLeft size={18} className="mr-2"/> Torna al Sito</Link>

      {/* GESTIONE MARCHI */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2 text-gray-800"><Tag className="text-rose-400"/> Aggiungi Marchio</h2>
        <form onSubmit={handleAddBrand} className="flex gap-4 mb-6">
          <input type="text" placeholder="Nome Marchio..." className="flex-1 border p-4 rounded-2xl outline-none" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} />
          <button className="bg-rose-400 text-white px-6 rounded-2xl font-bold uppercase shadow-md"><PlusCircle /></button>
        </form>
        <div className="flex flex-wrap gap-2">
          {brands.map(b => (
            <span key={b.id} className="bg-rose-50 text-rose-500 px-4 py-2 rounded-full text-xs font-bold border border-rose-100 uppercase tracking-widest">{b.name}</span>
          ))}
        </div>
      </section>

      {/* CATALOGO CON STELLINA E MATITA */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-8 text-gray-800">Catalogo Prodotti ({products.length})</h2>
        <div className="grid gap-4">
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-5">
                <img src={p.image_url} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                {editingId === p.id ? (
                  <div className="flex flex-col gap-2">
                    <input className="border p-2 rounded-lg text-sm" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    <input className="border p-2 rounded-lg text-sm w-24" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-gray-800">{p.name}</p>
                    <p className="text-xs text-rose-400 font-bold uppercase">€{p.price}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFeatured(p.id, p.is_featured)} className={`p-2 rounded-full transition-all ${p.is_featured ? 'text-yellow-500 bg-yellow-50 shadow-sm' : 'text-gray-300'}`}>
                   <Star size={22} fill={p.is_featured ? "currentColor" : "none"} />
                </button>
                {editingId === p.id ? (
                  <button onClick={() => saveEdit(p.id)} className="bg-green-500 text-white p-2 rounded-full shadow-sm"><Check size={20}/></button>
                ) : (
                  <button onClick={() => { setEditingId(p.id); setEditForm({name: p.name, price: p.price.toString()}); }} className="bg-white text-blue-400 p-2 rounded-full border border-blue-100 shadow-sm"><Edit2 size={20}/></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RUBRICA WHATSAPP */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 text-gray-800 flex items-center gap-2"><Database className="text-rose-400"/> Rubrica Clienti</h2>
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