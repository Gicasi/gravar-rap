let recognition;
let isRecording = false;

document.getElementById("record").addEventListener('click', () => {
  if (!isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
});

document.getElementById("stop").addEventListener('click', stopRecording);

document.getElementById("download").addEventListener('click', () => {
  const transcriptionText = document.getElementById('transcription').value;
  if (!transcriptionText) {
    alert("Não há transcrição para baixar.");
    return;
  }

  const blob = new Blob([transcriptionText], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = "relatorio_transcricao.txt";
  link.click();
});

// Função para iniciar o reconhecimento de voz
function startRecording() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Seu navegador não suporta a API de reconhecimento de voz.");
    return;
  }

  recognition = new webkitSpeechRecognition();  // Usando o SpeechRecognition
  recognition.lang = 'pt-BR';  // Definindo o idioma para português
  recognition.interimResults = true;  // Resultados intermediários (para transcrição em tempo real)
  recognition.continuous = true;  // Permitir reconhecimento contínuo

  recognition.onstart = function() {
    isRecording = true;
    document.getElementById('record').textContent = "Gravando...";
    document.getElementById('stop').disabled = false;
  };

  recognition.onresult = function(event) {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    document.getElementById('transcription').value = transcript;  // Atualiza a transcrição na tela
  };

  recognition.onerror = function(event) {
    console.error("Erro de reconhecimento:", event.error);
    alert("Erro ao tentar reconhecer a fala.");
    stopRecording();
  };

  recognition.onend = function() {
    isRecording = false;
    document.getElementById('record').textContent = "Gravar";
    document.getElementById('stop').disabled = true;
  };

  recognition.start();
}

// Função para parar o reconhecimento de voz
function stopRecording() {
  if (recognition) {
    recognition.stop();
  }
}
