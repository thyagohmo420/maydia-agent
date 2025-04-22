const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function gerarAudio(respostaTexto, filePath = './temp/audio-resposta.mp3') {
  const VOICE_ID = process.env.ELEVEN_VOICE_ID;

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: respostaTexto,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8
        }
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVEN_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    fs.writeFileSync(filePath, response.data);
    console.log('✅ Áudio gerado com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao gerar áudio:', error.message);
    throw error;
  }
}

module.exports = { gerarAudio };