const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Configuração do seu número de WhatsApp (DDD + Número)
const SEU_NUMERO_WHATSAPP = "5511999999999"; 

let passo = 0;
let dadosAgendamento = {
    nome: "",
    data: "",
    servico: ""
};

sendBtn.addEventListener('click', enviarMensagem);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarMensagem();
});

function enviarMensagem() {
    const texto = userInput.value.trim();
    if (texto === "") return;

    // Adiciona mensagem do usuário na tela
    adicionarMensagem(texto, 'user');
    userInput.value = "";

    // Processa a resposta da "IA" baseada no fluxo
    setTimeout(() => {
        processarFluxo(texto);
    }, 800);
}

function adicionarMensagem(texto, remetente) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', remetente);
    msgDiv.innerText = texto;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processarFluxo(texto) {
    if (passo === 0) {
        dadosAgendamento.nome = texto;
        adicionarMensagem(`Prazer, ${dadosAgendamento.nome}! Qual serviço você deseja agendar? (Ex: Consulta, Corte de Cabelo, Manutenção)`, 'bot');
        passo = 1;
    } else if (passo === 1) {
        dadosAgendamento.servico = texto;
        adicionarMensagem(`Ótimo! E qual o melhor dia e horário para você?`, 'bot');
        passo = 2;
    } else if (passo === 2) {
        dadosAgendamento.data = texto;
        
        // Mensagem de confirmação
        adicionarMensagem(`Perfeito! Confirmando: \n\n• Nome: ${dadosAgendamento.nome}\n• Serviço: ${dadosAgendamento.servico}\n• Data/Hora: ${dadosAgendamento.data}`, 'bot');
        
        // Criação do link do WhatsApp
        setTimeout(() => {
            const textoWhatsapp = encodeURIComponent(`Olá! Gostaria de confirmar meu agendamento:\nNome: ${dadosAgendamento.nome}\nServiço: ${dadosAgendamento.servico}\nData: ${dadosAgendamento.data}`);
            const linkWhatsapp = `https://wa.me{55 19 999946371 }?text=${textoWhatsapp}`;
            
            adicionarMensagem(`Clique no botão abaixo para enviar o agendamento para o nosso WhatsApp e finalizar!`, 'bot');
            
            // Cria um botão real de clique dentro do chat
            const btnWhats = document.createElement('a');
            btnWhats.href = linkWhatsapp;
            btnWhats.target = "_blank";
            btnWhats.innerText = "Confirmar no WhatsApp 🟢";
            btnWhats.style = "display: inline-block; background: #25d366; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; margin-top: 10px; font-weight: bold; text-align: center;";
            
            chatMessages.appendChild(btnWhats);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
        
        passo = 3; // Fim do fluxo básico
    }
}
