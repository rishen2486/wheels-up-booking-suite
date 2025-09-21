import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  // Example: expects file in req.body.file (base64 string) and req.body.filename
  const { file, filename } = req.body;

  if (!file || !filename) {
    res.status(400).json({ error: 'Missing file or filename' });
    return;
  }

  // Upload to Supabase Storage (bucket name: 'uploads')
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filename, Buffer.from(file, 'base64'), {
      contentType: 'application/octet-stream',
      upsert: true,
    });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ data });
}