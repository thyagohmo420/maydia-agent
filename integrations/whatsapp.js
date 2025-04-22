const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function sendMessage(phone, message) {
  try {
    await axios.post(process.env.ULTRAMSG_URL, {
      token: process.env.ULTRAMSG_TOKEN,
      to: phone,
      body: message
    });
    console.log(`📤 Mensagem enviada para ${phone}: ${message}`);
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error.message);
  }
}

async function sendAudio(phone, filePath) {
  try {
    const audioBase64 = fs.readFileSync(filePath, { encoding: 'base64' });

    await axios.post(process.env.ULTRAMSG_URL, {
      token: process.env.ULTRAMSG_TOKEN,
      to: phone,
      filename: 'resposta.mp3',
      audio: audioBase64,
      type: 'audio',
    });

    console.log(`🔊 Áudio enviado para ${phone}`);
  } catch (error) {
    console.error('❌ Erro ao enviar áudio:', error.message);
  }
}

async function salvarAudioTemporario(mediaUrl, fileName = 'audio.mp3') {
  try {
    const filePath = path.resolve(__dirname, `../temp/${fileName}`);
    const writer = fs.createWriteStream(filePath);

    const response = await axios({
      url: mediaUrl,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('❌ Erro ao salvar áudio temporário:', error.message);
    return null;
  }
}

module.exports = {
  sendMessage,
  sendAudio,
  salvarAudioTemporario,
};
