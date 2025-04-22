require('dotenv').config(); // ⚠️ TEM que estar no topo
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_KEY não encontrada no .env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function salvarLeadNoSupabase(dados) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([dados]);

    if (error) throw error;

    console.log('✅ Lead salvo no Supabase:', data);
  } catch (err) {
    console.error('❌ Erro ao salvar no Supabase:', err.message || err);
  }
}

module.exports = { salvarLeadNoSupabase };
