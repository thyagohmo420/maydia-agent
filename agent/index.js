const fs = require('fs');
const path = require('path');
const axios = require('axios');

const promptPath = path.resolve(__dirname, './prompts/prompt.txt');
const systemPrompt = fs.readFileSync(promptPath, 'utf-8');

async function generateResponse(message) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const respostaTexto = response.data.choices[0].message.content;

    // Salva áudio usando ElevenLabs
    await gerarAudio(respostaTexto, './temp/audio-resposta.mp3');

    return {
      text: respostaTexto,
      nome: 'Lead do WhatsApp',
      interesse: 'IA para loja Apple',
      horario: '',
    };

  } catch (error) {
    console.error('❌ Erro ao gerar resposta com IA:', error.message || error);
    return {
      text: 'Tivemos um erro aqui, pode repetir rapidinho?',
      nome: 'Desconhecido',
      interesse: 'Erro IA',
      horario: ''
    };
  }
}

async function gerarAudio(texto, outputPath) {
  try {
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech/' + process.env.ELEVENLABS_VOICE_ID,
      {
        text: texto,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.9
        }
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    );

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

  } catch (err) {
    console.error('❌ Erro ao gerar áudio:', err.message);
  }
}

module.exports = { generateResponse };
