require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { generateResponse } = require('./agent/index');
const { sendMessage, sendAudio, salvarAudioTemporario } = require('./integrations/whatsapp');
const { transcreverAudioComWhisper } = require('./utils/transcribeAudio');
const { salvarLeadNoSupabase } = require('./utils/registraLeadsNoSupabase');
const { iniciarFollowUpLoop } = require('./utils/followup');
const { scheduleCall } = require('./utils/synthflow');
const { gerarAudio } = require('./utils/voice');

const app = express();
app.use(bodyParser.json());

iniciarFollowUpLoop();

app.post('/webhook', async (req, res) => {
  try {
    const body = req.body?.data?.body;
    const phone = req.body?.data?.from;
    const mediaType = req.body?.data?.type;
    const mediaUrl = req.body?.data?.media;

    if (!phone) return res.sendStatus(400);

    console.log(`📩 Mensagem de ${phone}: ${body || '[Áudio recebido]'}`);

    let message = body;
    if (mediaType === 'audio' && mediaUrl) {
      const audioPath = await salvarAudioTemporario(mediaUrl, `${Date.now()}.mp3`);
      message = await transcreverAudioComWhisper(audioPath);
      console.log('🗣️ Áudio transcrito:', message);
    }

    const resposta = await generateResponse(message);
    const textoResposta = typeof resposta === 'string' ? resposta : resposta.text;

    await sendMessage(phone, textoResposta);
    await new Promise(r => setTimeout(r, 3000));
    await gerarAudio(textoResposta); // Gera áudio com texto
    await sendAudio(phone, './temp/audio-resposta.mp3'); // Envia áudio

    if (resposta && typeof resposta === 'object') {
      await salvarLeadNoSupabase({
        nome: resposta.nome || '',
        telefone: phone,
        mensagem: message,
        resposta: textoResposta,
        email: resposta.email || '',
        horario: resposta.horario || '',
        interesse: resposta.interesse || '',
        etapa: resposta.etapa || '',
        problema: resposta.problema || '',
        solucao: resposta.solucao || ''
      });
    }

    const texto = textoResposta.toLowerCase();
    if (texto.includes('ligar') || texto.includes('teste da ligação')) {
      await scheduleCall(phone);
      await sendMessage(phone, '📞 Ligação automática iniciada! Você receberá em instantes.');
    }

    res.sendStatus(200);

  } catch (error) {
    console.error('❌ Erro geral no webhook:', error.message || error);
    await sendMessage(req.body?.data?.from, 'Tivemos um errinho aqui, mas já estamos resolvendo. Manda a última msg de novo, por favor!');
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Agente rodando em http://localhost:${PORT}`);
});