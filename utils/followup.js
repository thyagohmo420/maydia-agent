const { sendMessage } = require('../integrations/whatsapp');
const { getLeadsSemResposta } = require('./supabase');

async function iniciarFollowUp() {
  try {
    const inativos = await getLeadsSemResposta(30); // Inativos há 30 minutos

    for (const lead of inativos) {
      const texto = `Oi de novo! Vi que você sumiu, bora retomar a conversa? Ainda tô por aqui se quiser trocar ideia sobre IA.`;

      await sendMessage(lead.telefone, texto);

      console.log(`🔁 Follow-up enviado para: ${lead.telefone}`);
    }
  } catch (error) {
    console.error('❌ Erro no follow-up automático:', error.message);
  }
}

function iniciarFollowUpLoop() {
  setInterval(() => {
    iniciarFollowUp();
  }, 10 * 60 * 1000); // a cada 10 minutos
}

module.exports = { iniciarFollowUp, iniciarFollowUpLoop };
