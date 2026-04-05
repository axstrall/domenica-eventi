import { supabase } from '../../lib/supabase'; 

export default async function handler(req, res) {
  // Accetta solo richieste POST per sicurezza
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { id, password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Accesso negato: Password errata' });
  }

  try {
    const { error } = await supabase
      .from('whatsapp_subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.status(200).json({ message: 'Contatto eliminato con successo' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}