
// ==========================================
// CONFIGURAÇÃO DO AGENTE
// ==========================================
const CONFIG = {
    nomeBot: "Atendente Virtual",     
    numeroWhatsApp: "5519999946371", // Seu número correto sem espaços
    
    // Lista de perguntas que o robô vai fazer
    perguntas: [
        "Olá! Seja bem-vindo(a). Para iniciarmos seu agendamento, por favor, digite seu **Nome Completo**:",
        "Perfeito! Agora digite o **Serviço ou Procedimento** que você deseja realizar:",
        "E para finalizar, qual o **Melhor Dia e Horário** para você?"
    ],
    
    // Rótulos simples para o resumo final (evita erros no código)
    titulos: ["Nome", "Serviço", "Data/Hora"],
    
    textoSucesso: "Perfeito! Seus dados foram salvos temporariamente pelo assistente.",
    textoInstrucaoBotao: "Clique no botão abaixo para enviar os detalhes diretamente para o nosso WhatsApp e garantir sua vaga!"
};

// ==========================================
// MOTOR DO CHAT
// ==========================================
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

if (document.getElementById('botNome')) {
    document.getElementById('botNome').innerText = CONFIG.nomeBot;
}

let passo = 0;
let respostasUsuario = [];

// Inicializa a primeira mensagem na tela
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
    // Se ainda tem perguntas, faz a próxima
    if (passo < CONFIG.perguntas.length) {
        adicionarMensagem(CONFIG.perguntas[passo], 'bot');
    } 
    // Se acabaram as perguntas, gera o resumo e o botão
    else if (passo === CONFIG.perguntas.length) {
        let resumo = "<strong>Resumo do Agendamento:</strong><br><br>";
        
        CONFIG.titulos.forEach((titulo, index) => {
            resumo += `• <strong>${titulo}:</strong> ${respostasUsuario[index]}<br>`;
        });

        adicionarMensagem(CONFIG.textoSucesso, 'bot');
        adicionarMensagem(resumo, 'bot');
        
        setTimeout(() => {
            adicionarMensagem(CONFIG.textoInstrucaoBotao, 'bot');
            
            // Monta o texto limpo para o WhatsApp
            let textoFormatadoWhats = `Olá! Gostaria de confirmar meu agendamento:\n\n`;
            CONFIG.titulos.forEach((titulo, index) => {
                textoFormatadoWhats += `*${titulo}:* ${respostasUsuario[index]}\n`;
            });

            const linkFinal = `https://wa.me{CONFIG.numeroWhatsApp}?text=${encodeURIComponent(textoFormatadoWhats)}`;
            
            const btnWhats = document.getElementById('whatsappBtnNativo');
            if (btnWhats) {
                btnWhats.href = linkFinal;
                btnWhats.style.display = "flex"; // Exibe o botão estruturado do HTML
                chatMessages.appendChild(btnWhats);
            }
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}
