import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, ArrowLeft, Lock, PlusCircle, Database, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category_id: '',
    image_url: '',
    is_featured: true, // Lo mettiamo TRUE di default così appare subito in Home
    price: ''
  });

  const SECRET_PASSWORD = "Domenica2024";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) setIsAuthenticated(true);
    else alert("Password errata!");
  };

  // Carichiamo i dati della rubrica e categorie
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subsRes, catsRes] = await Promise.all([
        supabase.from('whatsapp_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
      ]);
      if (subsRes.data) setSubscribers(subsRes.data);
      if (catsRes.data) setCategories(catsRes.data);
    } catch (err) {
      console.error("Errore caricamento dati:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      setNewProduct({ ...newProduct, image_url: publicUrl });
    } catch (error) {
      alert("Errore caricamento immagine");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.image_url) { alert("Manca la foto!"); return; }
    
    try {
      const cleanPrice = parseFloat(newProduct.price.replace(',', '.'));
      const generatedSlug = (newProduct.name || 'prodotto')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

      const { error } = await supabase.from('products').insert([{
        name: newProduct.name,
        description: newProduct.description || '',
        category_id: newProduct.category_id,
        image_url: newProduct.image_url,
        is_featured: newProduct.is_featured,
        price: isNaN(cleanPrice) ? 0 : cleanPrice,
        slug: generatedSlug
      }]);

      if (error) {
        alert(`Errore: ${error.message}`);
      } else {
        alert("COMPLIMENTI! ARTICOLO PUBBLICATO!");
        setNewProduct({ name: '', description: '', category_id: '', image_url: '', is_featured: true, price: '' });
      }
    } catch (err) {
      alert("Errore nel modulo");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-xl space-y-4">
          <input type="password" placeholder="Password" className="border p-3 rounded-full text-center outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-rose-400 text-white p-3 rounded-full font-bold">ACCEDI</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pt-24 space-y-12">
      <Link to="/" className="text-rose-400 font-bold italic flex items-center mb-4">
        <ArrowLeft size={20} className="mr-2" /> Torna al Sito
      </Link>

      {/* SEZIONE CARICAMENTO */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-3xl font-serif italic mb-8">Nuovo Prodotto</h2>
        <form onSubmit={handleAddProduct} className="grid gap-6">
          <label className="border-2 border-dashed border-rose-200 h-48 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-rose-50/20">
            {newProduct.image_url ? <img src={newProduct.image_url} className="w-full h-full object-cover" /> : <Upload className="text-rose-400" />}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          <input type="text" placeholder="Nome Articolo" className="border p-4 rounded-2xl outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
          <input type="text" placeholder="Prezzo (es: 25.00)" className="border p-4 rounded-2xl outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
          <select className="border p-4 rounded-2xl outline-none" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
            <option value="">Scegli Categoria...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <textarea placeholder="Descrizione" className="border p-4 rounded-2xl h-24 outline-none" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
          <button className="bg-slate-800 text-white p-5 rounded-2xl font-bold uppercase tracking-widest">PUBBLICA ORA</button>
        </form>
      </section>

      {/* SEZIONE RUBRICA (RIPRISTINATA) */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2"><Database /> Rubrica Iscritti ({subscribers.length})</h2>
        <div className="space-y-4">
          {subscribers.length === 0 ? <p className="text-gray-400 italic">Caricamento rubrica...</p> : 
            subscribers.map(s => (
              <div key={s.id} className="flex justify-between items-center p-4 bg-rose-50/30 rounded-2xl border border-rose-100">
                <div>
                  <p className="font-bold text-gray-800">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.phone}</p>
                </div>
                <a href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} target="_blank" className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 shadow-md">
                  <MessageCircle size={20}/>
                </a>
              </div>
            ))
          }
        </div>
      </section>
    </div>
  );
}