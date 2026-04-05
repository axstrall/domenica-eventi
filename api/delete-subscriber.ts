import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // 1. Configurazione immediata con fallback
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: "Configurazione Supabase mancante sul server." });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // 2. Solo POST ammesso
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { id, password } = req.body;

  // 3. Controllo Password Admin
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Password errata' });
  }

  // 4. Eliminazione
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