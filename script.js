// ==========================================
// CONFIGURAÇÃO DO AGENTE
// ==========================================
const CONFIG = {
    nomeBot: "Atendente Virtual",     
    numeroWhatsApp: "5519999946371", // Seu número correto salvos com aspas e sem espaços
    
    perguntas: [
        "Olá! Seja bem-vindo(a). Para iniciarmos seu agendamento, por favor, digite seu **Nome Completo**:",
        "Perfeito! Agora digite o **Serviço ou Procedimento** que você deseja realizar:",
        "E para finalizar, qual o **Melhor Dia e Horário** para você?"
    ],
    
    textoSucesso: "Perfeito! Seus dados foram salvos temporariamente pelo assistente.",
    textoInstrucaoBotao: "Clique no botão abaixo para enviar os detalhes diretamente para o nosso WhatsApp e garantir sua vaga!"
};

// ==========================================
// MOTOR DO CHAT
// ==========================================
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

document.getElementById('botNome').innerText = CONFIG.nomeBot;

let passo = 0;
let respostasUsuario = [];

setTimeout(() => {
    adicionarMensagem(CONFIG.perguntas[0], 'bot');
}, 500);

sendBtn.addEventListener('click', enviarMensagem);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarMensagem();
});

function enviarMensagem() {
    const texto = userInput.value.trim();
    if (texto === "") return;

    adicionarMensagem(texto, 'user');
    userInput.value = "";
    respostasUsuario.push(texto);

    setTimeout(() => {
        passo++;
        processarProximoPasso();
    }, 800);
}

function adicionarMensagem(texto, remetente) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', remetente);
    msgDiv.innerHTML = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processarProximoPasso() {
    if (passo < CONFIG.perguntas.length) {
        adicionarMensagem(CONFIG.perguntas[passo], 'bot');
    } else if (passo === CONFIG.perguntas.length) {
        let resumo = "<strong>Resumo do Agendamento:</strong><br><br>";
        CONFIG.perguntas.forEach((pergunta, index) => {
            const label = pergunta.match(/\*\*(.*?)\*\*/)?.[1] || `Dado ${index + 1}`;
            resumo += `• <strong>${label}:</strong> ${respostasUsuario[index]}<br>`;
        });

        adicionarMensagem(CONFIG.textoSucesso, 'bot');
        adicionarMensagem(resumo, 'bot');
        
        setTimeout(() => {
            adicionarMensagem(CONFIG.textoInstrucaoBotao, 'bot');
            
            let textoFormatadoWhats = `Olá! Gostaria de confirmar meu agendamento:\n\n`;
            CONFIG.perguntas.forEach((pergunta, index) => {
                const label = pergunta.match(/\*\*(.*?)\*\*/)?.[1] || `Dado ${index + 1}`;
                textoFormatadoWhats += `*${label}:* ${respostasUsuario[index]}\n`;
            });

            const linkFinal = `https://wa.me{CONFIG.numeroWhatsApp}?text=${encodeURIComponent(textoFormatadoWhats)}`;
            
            const btnWhats = document.getElementById('whatsappBtnNativo');
            btnWhats.href = linkFinal;
            btnWhats.style.display = "flex"; // Revela o botão escondido
            
            chatMessages.appendChild(btnWhats);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}
