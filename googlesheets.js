const axios = require('axios');

async function salvarLeadNoSheets(data) {
  try {
    await axios.post(process.env.SHEETS_WEBHOOK_URL, data);
    console.log("📋 Lead enviado pro Google Sheets!");
  } catch (error) {
    console.error("❌ Erro ao enviar para Google Sheets:", error.message);
  }
}

module.exports = { salvarLeadNoSheets };
