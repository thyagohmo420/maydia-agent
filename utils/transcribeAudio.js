
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

async function transcribeAudioCLI(audioPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(audioPath);
    const command = `whisper "${fullPath}" --model tiny --language Portuguese --fp16 False --output_format txt`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Erro ao transcrever com Whisper CLI:', stderr);
        return reject(error);
      }

      const txtFile = fullPath.replace(/\.[^/.]+$/, '') + '.txt';
      if (fs.existsSync(txtFile)) {
        const texto = fs.readFileSync(txtFile, 'utf-8');
        return resolve(texto.trim());
      } else {
        return reject('Arquivo de transcrição não encontrado.');
      }
    });
  });
}

module.exports = { transcribeAudioCLI };
