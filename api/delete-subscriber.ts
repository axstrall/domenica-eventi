import { createClient } from '@supabase/supabase-js';

// Vercel leggerà queste variabili dalle tue impostazioni "Environment Variables"
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req, res) {
  // Accetta solo richieste POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { id, password } = req.body;

  // Verifica la password segreta impostata su Vercel
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Accesso negato: Password errata' });
  }

  try {
    const { error } = await supabaseAdmin
      .from('whatsapp_subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return res.status(200).json({ message: 'Contatto eliminato con successo' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}