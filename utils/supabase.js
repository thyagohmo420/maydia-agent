const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Salva novo lead no Supabase
async function salvarLeadNoSupabase(lead) {
  try {
    const { error } = await supabase.from('leads').insert([lead]);
    if (error) throw error;
    console.log('✅ Lead salvo no Supabase!');
  } catch (err) {
    console.error('❌ Erro ao salvar no Supabase:', err.message);
  }
}

// Retorna leads que estão inativos por X minutos
async function getLeadsSemResposta(minutosInativos = 30) {
  try {
    const limite = new Date(Date.now() - minutosInativos * 60000).toISOString();

    const { data, error } = await supabase
      .from('leads')
      .select('telefone')
      .lte('updated_at', limite);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('❌ Erro ao buscar leads inativos:', err.message);
    return [];
  }
}

module.exports = { salvarLeadNoSupabase, getLeadsSemResposta };
