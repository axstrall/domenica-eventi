import { createClient } from '@supabase/supabase-js';

// Usiamo direttamente le variabili di Vercel per evitare errori di percorso
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // 1. Gestione metodo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { id, password } = req.body;

  // 2. Controllo password
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Password errata' });
  }

  // 3. Esecuzione eliminazione
  try {
    const { error } = await supabaseAdmin
      .from('whatsapp_subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}