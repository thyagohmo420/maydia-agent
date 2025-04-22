const axios = require('axios');

async function agendarReuniaoGoogleCalendar({ nome, email, horario, data }) {
  try {
    const payload = {
      nome,
      email,
      horario,
      data
    };

    const resp = await axios.post(process.env.CALENDAR_WEBHOOK_URL, payload);
    console.log('✅ Reunião enviada pro Google Calendar:', resp.data);
  } catch (error) {
    console.error('❌ Erro ao agendar no Google Calendar:', error.response?.data || error.message);
  }
}

module.exports = { agendarReuniaoGoogleCalendar };
