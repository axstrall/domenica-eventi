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
    is_featured: false,
    brand: '',
    price: ''
  });

  const SECRET_PASSWORD = "Domenica2024";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) setIsAuthenticated(true);
    else alert("Password errata!");
  };

  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        setIsLoading(true);
        const [subsRes, catsRes] = await Promise.all([
          supabase.from('whatsapp_subscribers').select('*').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('name')
        ]);
        if (subsRes.data) setSubscribers(subsRes.data);
        if (catsRes.data) setCategories(catsRes.data);
        setIsLoading(false);
      };
      loadData();
    }
  }, [isAuthenticated]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      setNewProduct({ ...newProduct, image_url: publicUrl });
      alert("Immagine pronta!");
    } catch (error) {
      alert("Errore caricamento foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.image_url) { alert("Manca la foto!"); return; }
    if (!newProduct.category_id) { alert("Scegli una categoria!"); return; }

    try {
      // Pulizia del prezzo: sostituiamo la virgola col punto per il database
      const cleanPrice = parseFloat(newProduct.price.replace(',', '.'));
      
      // Creazione dello slug obbligatorio
      const generatedSlug = newProduct.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const { error } = await supabase.from('products').insert([{
        name: newProduct.name,
        description: newProduct.description || '',
        category_id: newProduct.category_id,
        image_url: newProduct.image_url,
        is_featured: newProduct.is_featured,
        brand: newProduct.brand || '',
        price: isNaN(cleanPrice) ? 0 : cleanPrice,
        slug: generatedSlug || `prodotto-${Math.random().toString(36).substr(2, 5)}`
      }]);

      if (error) throw error;
      
      alert("Prodotto pubblicato!");
      setNewProduct({ name: '', description: '', category_id: '', image_url: '', is_featured: false, brand: '', price: '' });
    } catch (err) {
      console.error(err);
      alert("Errore database: controlla che tutti i campi siano compilati");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50/30">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-rose-100 max-w-md w-full">
          <Lock className="text-rose-400 mx-auto mb-6" size={48} />
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" placeholder="Password" 
              className="w-full px-6 py-4 rounded-full bg-rose-50 border border-rose-100 text-center outline-none"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
            <button className="w-full bg-rose-400 text-white py-4 rounded-full font-bold uppercase shadow-lg">Entra</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-24 max-w-5xl mx-auto space-y-10">
      <Link to="/" className="text-rose-400 font-bold italic flex items-center">
        <ArrowLeft size={20} className="mr-2" /> Home
      </Link>

      <section className="bg-white/90 p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-3xl font-serif text-gray-800 mb-8 italic">Nuovo Articolo</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-rose-200 border-dashed rounded-3xl cursor-pointer bg-rose-50/30 overflow-hidden">
              {newProduct.image_url ? (
                <img src={newProduct.image_url} alt="Anteprima" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center">
                  {isUploading ? <Loader2 className="animate-spin text-rose-400" /> : <Upload className="text-rose-400" />}
                  <p className="text-rose-400 text-sm mt-2">Carica Foto</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          <input type="text" placeholder="Nome Articolo" className="px-6 py-4 rounded-2xl bg-gray-50 border outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
          <input type="text" placeholder="Marchio" className="px-6 py-4 rounded-2xl bg-gray-50 border outline-none" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
          <input type="text" placeholder="Prezzo (es: 10.50)" className="px-6 py-4 rounded-2xl bg-gray-50 border outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
          <select className="px-6 py-4 rounded-2xl bg-gray-50 border outline-none" value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required>
            <option value="">Categoria...</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <div className="flex items-center gap-3 px-2 md:col-span-2">
            <input type="checkbox" id="f" checked={newProduct.is_featured} onChange={e => setNewProduct({...newProduct, is_featured: e.target.checked})} />
            <label htmlFor="f" className="text-gray-600 italic">Metti in evidenza nella Home</label>
          </div>
          <button className="md:col-span-2 bg-slate-800 text-white py-5 rounded-2xl font-bold uppercase shadow-lg">Pubblica</button>
        </form>
      </section>
      
      {/* Rubrica in fondo */}
      <section className="bg-white/90 p-8 rounded-[3rem] shadow-xl border border-rose-100">
        <h2 className="text-2xl font-serif text-gray-800 mb-6 italic">Rubrica Clienti</h2>
        <div className="space-y-4">
          {subscribers.map(s => (
            <div key={s.id} className="flex justify-between items-center p-4 border-b">
              <div><p className="font-bold">{s.name}</p><p className="text-sm text-gray-500">{s.phone}</p></div>
              <a href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} target="_blank" className="bg-green-500 p-2 rounded-full text-white"><MessageCircle size={20}/></a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}