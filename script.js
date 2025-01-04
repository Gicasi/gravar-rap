window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
  alert("Reconhecimento de fala não é suportado neste navegador.");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.continuous = true;
  recognition.interimResults = false;

  let isRecording = false;
  const transcriptionBox = document.getElementById("transcription");

  // Inicia a gravação
  document.getElementById("record").addEventListener("click", () => {
    if (!isRecording) {
      recognition.start();
      isRecording = true;
      transcriptionBox.value = ""; // Limpa a transcrição anterior
      document.getElementById("record").disabled = true;
      document.getElementById("stop").disabled = false;
    }
  });

  // Para a gravação
  document.getElementById("stop").addEventListener("click", () => {
    if (isRecording) {
      recognition.stop();
      isRecording = false;
      document.getElementById("record").disabled = false;
      document.getElementById("stop").disabled = true;
      document.getElementById("download").disabled = false;
    }
  });

  // Atualiza a transcrição em tempo real
  recognition.onresult = (event) => {
    const results = event.results;
    const transcript = results[results.length - 1][0].transcript;
    transcriptionBox.value += transcript + "\n";
  };

  // Trata erros de reconhecimento de fala
  recognition.onerror = (event) => {
    console.error("Erro de reconhecimento:", event.error);
    alert("Erro ao reconhecer a fala: " + event.error);
  };

  // Baixa o relatório de transcrição como arquivo de texto
  document.getElementById("download").addEventListener("click", () => {
    const transcriptionText = transcriptionBox.value;

    if (transcriptionText.trim() === "") {
      alert("Nenhuma transcrição disponível para download!");
      return;
    }

    const blob = new Blob([transcriptionText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transcricao.txt";

    // Simula o clique para forçar o download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
