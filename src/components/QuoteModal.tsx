import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/database.types';

interface QuoteModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteModal({ product, isOpen, onClose }: QuoteModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Inserimento dati nella tabella quote_requests su Supabase
    const { error } = await supabase.from('quote_requests').insert([
      {
        product_id: product.id,
        customer_name: formData.get('name') as string,
        customer_email: formData.get('email') as string,
        customer_phone: formData.get('phone') as string,
        message: formData.get('message') as string,
        quantity: parseInt(formData.get('quantity') as string) || 1,
        status: 'pending' // Stato di default definito nel database
      },
    ]);

    setLoading(false);

    if (error) {
      console.error('Errore durante l\'invio:', error);
      alert('Si è verificato un errore. Riprova più tardi.');
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Header del Modal */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-rose-50/30">
          <div>
            <h2 className="text-2xl font-serif text-gray-800">Richiedi Preventivo</h2>
            <p className="text-sm text-gray-500 mt-1">Stai richiedendo info per: <span className="font-semibold text-rose-400">{product.name}</span></p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Corpo del Modal */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-10 space-y-4">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Send className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-800">Messaggio Inviato!</h3>
              <p className="text-gray-600">Ti ricontatteremo al più presto con tutti i dettagli.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nome e Cognome</label>
                  <input required name="name" type="text" placeholder="Mario Rossi" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input required name="email" type="email" placeholder="mario@esempio.it" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Telefono</label>
                  <input name="phone" type="tel" placeholder="+39 333..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Quantità desiderata</label>
                  <input name="quantity" type="number" min="1" defaultValue="1" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Messaggio (Opzionale)</label>
                <textarea name="message" rows={4} placeholder="Dacci qualche dettaglio in più sul tuo evento..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all resize-none"></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all transform active:scale-95 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-400 hover:bg-rose-500 shadow-lg shadow-rose-200'}`}
              >
                {loading ? 'Invio in corso...' : 'Invia Richiesta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}