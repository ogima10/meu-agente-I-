const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Configurações simples
const NUMERO_WHATSAPP = "5519999946371";

const perguntas = [
    "Olá! Seja bem-vindo(a). Para iniciarmos seu agendamento, por favor, digite seu <strong>Nome Completo</strong>:",
    "Perfeito! Agora digite o <strong>Serviço ou Procedimento</strong> que você deseja realizar:",
    "E para finalizar, qual o <strong>Melhor Dia e Horário</strong> para você?"
];

const titulos = ["Nome", "Serviço", "Data/Hora"];
let passo = 0;
let respostasUsuario = [];

// Primeira pergunta
setTimeout(() => {
    adicionarMensagem(perguntas[0], 'bot');
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
    msgDiv.innerHTML = texto;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processarProximoPasso() {
    if (passo < perguntas.length) {
        adicionarMensagem(perguntas[passo], 'bot');
    } else if (passo === perguntas.length) {
        adicionarMensagem("Perfeito! Seus dados foram salvos temporariamente pelo assistente.", 'bot');
        
        let resumo = "<strong>Resumo do Agendamento:</strong><br><br>";
        titulos.forEach((titulo, index) => {
            resumo += `• <strong>${titulo}:</strong> ${respostasUsuario[index]}<br>`;
        });
        adicionarMensagem(resumo, 'bot');
        
        setTimeout(() => {
            adicionarMensagem("Clique no botão abaixo para enviar os detalhes diretamente para o nosso WhatsApp e garantir sua vaga!", 'bot');
            
            let textoFormatadoWhats = `Olá! Gostaria de confirmar meu agendamento:\n\n`;
            titulos.forEach((titulo, index) => {
                textoFormatadoWhats += `*${titulo}:* ${respostasUsuario[index]}\n`;
            });

            const linkFinal = `https://wa.me{NUMERO_WHATSAPP}?text=${encodeURIComponent(textoFormatadoWhats)}`;
            
            // Cria o botão dinamicamente de forma segura
            const btnWhats = document.createElement('a');
            btnWhats.href = linkFinal;
            btnWhats.target = "_blank";
            btnWhats.className = "whatsapp-btn";
            btnWhats.innerText = "Enviar para o WhatsApp";
            
            chatMessages.appendChild(btnWhats);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}
