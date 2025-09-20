import { supabase } from '../lib/supabaseClient'

async function getCars() {
  const { data, error } = await supabase.from('cars').select('*')
  console.log(data, error)
}
