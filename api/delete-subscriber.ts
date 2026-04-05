import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Leggiamo le variabili esattamente come appaiono nella tua foto di Vercel
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
  const adminPass = process.env.VITE_ADMIN_PASSWORD;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { id, password } = req.body;

  if (password !== adminPass) {
    return res.status(401).json({ error: 'Password errata' });
  }

  const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || '');

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