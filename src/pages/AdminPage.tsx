import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- CAMBIA LA TUA PASSWORD QUI ---
  const SECRET_PASSWORD = "Domenica2024"; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Password errata!");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSubscribers = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('whatsapp_subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) setSubscribers(data);
        setIsLoading(false);
      };
      fetchSubscribers();
    }
  }, [isAuthenticated]);

  // Schermata di Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md p-10 rounded-[3rem] shadow-2xl border border-rose-100 max-w-md w-full text-center">
          <Lock className="text-rose-400 mx-auto mb-6" size={48} />
          <h2 className="text-3xl font-serif text-gray-800 mb-6 italic">Area Riservata</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Inserisci Password" 
              className="w-full px-6 py-4 rounded-full bg-rose-50 border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400 text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full bg-rose-400 text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg">
              Accedi
            </button>
          </form>
          <Link to="/" className="inline-block mt-8 text-rose-300 hover:text-rose-400 text-sm italic">
            ← Torna al sito
          </Link>
        </div>
      </div>
    );
  }

  // Se loggato, mostra la rubrica (il codice che avevi prima)
  return (
    <div className="min-h-screen p-8 pt-32">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="flex items-center text-rose-400 mb-8 hover:text-rose-500 transition-colors font-bold italic">
          <ArrowLeft size={20} className="mr-2" /> Torna alla Home
        </Link>

        <section className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-rose-100">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-serif text-gray-800 italic">Rubrica Clienti WhatsApp</h2>
            <span className="bg-rose-100 text-rose-500 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-tighter">
              {subscribers.length} Iscritti
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-rose-100 italic text-rose-400 text-[10px] uppercase tracking-[0.2em]">
                  <th className="py-4 px-4">Nome Cliente</th>
                  <th className="py-4 px-4">Cellulare</th>
                  <th className="py-4 px-4 text-center">Azione</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-50 hover:bg-rose-50/50 transition-colors text-gray-700">
                    <td className="py-6 px-4 font-serif text-xl">{sub.name}</td>
                    <td className="py-6 px-4 font-mono tracking-tighter">{sub.phone}</td>
                    <td className="py-6 px-4 flex justify-center">
                      <a 
                        href={`https://wa.me/${sub.phone.replace(/\D/g, '')}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-all shadow-md hover:scale-110"
                      >
                        <MessageCircle size={24} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}