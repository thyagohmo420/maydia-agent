const axios = require('axios');

async function fazerLigacao(phone, mensagem) {
  try {
    const response = await axios.post(process.env.SYNTHFLOW_API_URL, {
      phone,
      message: mensagem || 'Fala aí, bora bater um papo sobre como a IA pode transformar suas vendas?',
      model: 'gpt-4o'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SYNTHFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📞 Ligação iniciada via Synthflow:', response.data);
  } catch (error) {
    console.error('❌ Erro ao iniciar ligação:', error.response?.data || error.message);
  }
}

module.exports = { fazerLigacao };
