import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('whatsapp_subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Errore caricamento iscritti:', error);
      } else if (data) {
        setSubscribers(data);
      }
      setIsLoading(false);
    };
    fetchSubscribers();
  }, []);

  return (
    <div className="min-h-screen p-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="flex items-center text-rose-400 mb-8 hover:text-rose-500 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Torna alla Home
        </Link>

        <section className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-rose-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif text-gray-800 italic">Rubrica Clienti WhatsApp</h2>
            <div className="bg-rose-100 text-rose-500 px-4 py-2 rounded-full text-sm font-bold">
              {subscribers.length} Iscritti
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10 text-rose-400 italic">
              Caricamento contatti...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-rose-100 italic text-rose-400 text-sm uppercase tracking-widest">
                    <th className="py-4 px-4">Nome Cliente</th>
                    <th className="py-4 px-4">Cellulare</th>
                    <th className="py-4 px-4 text-center">Azione</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-50 hover:bg-rose-50/50 transition-colors text-gray-700">
                      <td className="py-4 px-4 font-serif text-lg">{sub.name}</td>
                      <td className="py-4 px-4 font-mono">{sub.phone}</td>
                      <td className="py-4 px-4 flex justify-center">
                        <a 
                          href={`https://wa.me/${sub.phone.replace(/\D/g, '')}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-all shadow-md"
                        >
                          <MessageCircle size={20} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}