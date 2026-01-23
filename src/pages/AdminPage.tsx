// Aggiungi questo pezzo di codice per visualizzare la rubrica WhatsApp
const [subscribers, setSubscribers] = useState([]);

useEffect(() => {
  const fetchSubscribers = async () => {
    const { data } = await supabase
      .from('whatsapp_subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setSubscribers(data);
  };
  fetchSubscribers();
}, []);

// Nella parte del ritorno (HTML), aggiungi questa tabella:
<section className="mt-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
  <h2 className="text-2xl font-serif text-gray-800 mb-6 italic">Rubrica Clienti WhatsApp</h2>
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-gray-100 italic text-rose-400">
          <th className="py-3 px-4">Nome</th>
          <th className="py-3 px-4">Telefono</th>
          <th className="py-3 px-4">Data Iscrizione</th>
          <th className="py-3 px-4">Azione</th>
        </tr>
      </thead>
      <tbody>
        {subscribers.map((sub) => (
          <tr key={sub.id} className="border-b border-gray-50 hover:bg-rose-50/30 transition-colors">
            <td className="py-4 px-4 font-medium">{sub.name}</td>
            <td className="py-4 px-4">{sub.phone}</td>
            <td className="py-4 px-4 text-gray-400 text-sm">
              {new Date(sub.created_at).toLocaleDateString()}
            </td>
            <td className="py-4 px-4">
              <a 
                href={`https://wa.me/${sub.phone.replace(/\s+/g, '')}`} 
                target="_blank"
                className="text-green-500 hover:text-green-600 flex items-center gap-2 font-bold"
              >
                <MessageCircle size={18} /> Salva/Scrivi
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>