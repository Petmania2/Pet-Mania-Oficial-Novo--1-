// Conectar ao Socket.io
const socket = io();

let idUsuarioAtual = null;
let idConversaAtual = null;
let digitandoTimeout = null;
let tipoUsuario = null;

// Autenticar usuário ao conectar
async function inicializarChat() {
    try {
        const response = await fetch('/check-auth');
        const data = await response.json();
        
        if (data.loggedIn) {
            idUsuarioAtual = data.user.id;
            tipoUsuario = data.user.tipo;
            socket.emit('autenticar', idUsuarioAtual);
            carregarConversas();
        }
    } catch (erro) {
        console.error('Erro ao inicializar chat:', erro);
    }
}

// Carregar lista de conversas
async function carregarConversas() {
    try {
        const response = await fetch('/chat/conversas');
        const data = await response.json();
        
        // Suporta ambas as páginas
        const listaConversas = document.getElementById('listaConversas') || document.querySelector('.contacts-list');
        if (!listaConversas) return;
        
        listaConversas.innerHTML = '';
        
        if (data.conversas.length === 0) {
            const mensagemVazia = document.createElement('section');
            mensagemVazia.style.cssText = 'padding: 20px; text-align: center; color: #999;';
            mensagemVazia.textContent = 'Nenhuma conversa ainda';
            listaConversas.appendChild(mensagemVazia);
            return;
        }
        
        data.conversas.forEach(conversa => {
            const item = document.createElement('section');
            item.className = 'contact-item';
            item.onclick = () => abrirConversa(conversa.id_conversa, conversa.nome_outro_usuario, conversa.id_outro_usuario);
            
            const avatar = document.createElement('section');
            avatar.className = 'contact-avatar';
            avatar.style.backgroundImage = `url('https://i.pravatar.cc/150?img=${conversa.id_outro_usuario}')`;
            
            const info = document.createElement('section');
            info.className = 'contact-info';
            info.innerHTML = `
                <h4>${conversa.nome_outro_usuario}</h4>
                <p class="last-message">Clique para ver mensagens</p>
                <span class="message-time">${new Date(conversa.ultima_mensagem).toLocaleDateString('pt-BR')}</span>
            `;
            
            item.appendChild(avatar);
            item.appendChild(info);
            
            if (conversa.nao_lidas > 0) {
                const status = document.createElement('section');
                status.className = 'contact-status';
                status.innerHTML = `<span class="status-badge new">${conversa.nao_lidas}</span>`;
                item.appendChild(status);
            }
            
            listaConversas.appendChild(item);
        });
    } catch (erro) {
        console.error('Erro ao carregar conversas:', erro);
    }
}

// Abrir conversa específica
async function abrirConversa(idConversa, nomeOutroUsuario, idOutroUsuario) {
    idConversaAtual = idConversa;
    
    // Entrar na sala da conversa
    socket.emit('entrar_conversa', idConversa);
    
    // Atualizar UI - suporta ambas as páginas
    const chatVazio = document.getElementById('chatVazio');
    const chatAtivo = document.getElementById('chatAtivo');
    const chatContactName = document.getElementById('chatContactName') || document.getElementById('chatNome');
    const chatAvatarImg = document.getElementById('chatAvatarImg');
    
    if (chatVazio) chatVazio.style.display = 'none';
    if (chatAtivo) chatAtivo.style.display = 'flex';
    if (chatContactName) chatContactName.textContent = nomeOutroUsuario;
    if (chatAvatarImg) chatAvatarImg.src = `https://i.pravatar.cc/150?img=${idOutroUsuario}`;
    
    // Carregar histórico
    await carregarHistorico(idConversa);
    
    // Marcar como lida
    await fetch(`/chat/marcar-lida/${idConversa}`, { method: 'POST' });
    carregarConversas(); // Atualizar contador
}

// Carregar histórico de mensagens
async function carregarHistorico(idConversa) {
    try {
        const response = await fetch(`/chat/historico/${idConversa}`);
        const data = await response.json();
        
        const mensagensDiv = document.getElementById('mensagensArea') || document.getElementById('chatMessages');
        if (!mensagensDiv) return;
        
        mensagensDiv.innerHTML = '';
        
        if (data.mensagens.length === 0) {
            const mensagemVazia = document.createElement('section');
            mensagemVazia.style.cssText = 'text-align: center; color: #999; padding: 20px;';
            mensagemVazia.textContent = 'Nenhuma mensagem ainda. Envie a primeira!';
            mensagensDiv.appendChild(mensagemVazia);
        } else {
            data.mensagens.forEach(msg => {
                adicionarMensagemNaTela(msg);
            });
        }
        
        mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
    } catch (erro) {
        console.error('Erro ao carregar histórico:', erro);
    }
}

// Enviar mensagem
function enviarMensagem() {
    const input = document.getElementById('inputMensagem') || document.getElementById('messageInput');
    if (!input) return;
    
    const mensagem = input.value.trim();
    
    if (!mensagem || !idConversaAtual) return;
    
    socket.emit('enviar_mensagem', {
        idConversa: idConversaAtual,
        idRemetente: idUsuarioAtual,
        mensagem
    });
    
    input.value = '';
    pararDigitar();
}

// Expor função globalmente
window.enviarMensagem = enviarMensagem;

// Adicionar mensagem na tela
function adicionarMensagemNaTela(msg) {
    const mensagensDiv = document.getElementById('mensagensArea') || document.getElementById('chatMessages');
    if (!mensagensDiv) return;
    
    const mensagem = document.createElement('section');
    const ehMinhaMsg = msg.id_remetente === idUsuarioAtual;
    mensagem.className = `message ${ehMinhaMsg ? 'sent' : 'received'}`;
    
    const hora = new Date(msg.data_envio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const conteudo = document.createElement('section');
    conteudo.className = 'message-content';
    
    const texto = document.createElement('p');
    texto.textContent = msg.mensagem;
    
    const tempo = document.createElement('span');
    tempo.className = 'message-time';
    tempo.textContent = hora;
    
    conteudo.appendChild(texto);
    conteudo.appendChild(tempo);
    mensagem.appendChild(conteudo);
    
    mensagensDiv.appendChild(mensagem);
    mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
}

// Indicador de digitação
function usuarioDigitando() {
    if (!idConversaAtual) return;
    
    socket.emit('digitando', {
        idConversa: idConversaAtual,
        idUsuario: idUsuarioAtual,
        nome: 'Usuário'
    });
    
    clearTimeout(digitandoTimeout);
    digitandoTimeout = setTimeout(pararDigitar, 3000);
}

function pararDigitar() {
    if (!idConversaAtual) return;
    
    socket.emit('parou_digitar', {
        idConversa: idConversaAtual,
        idUsuario: idUsuarioAtual
    });
}

// Eventos Socket.io
socket.on('nova_mensagem', (msg) => {
    if (msg.id_conversa === idConversaAtual) {
        adicionarMensagemNaTela(msg);
    }
    carregarConversas(); // Atualizar lista
});

socket.on('usuario_digitando', (dados) => {
    document.getElementById('indicador-digitando').textContent = `${dados.nome} está digitando...`;
});

socket.on('usuario_parou_digitar', () => {
    document.getElementById('indicador-digitando').textContent = '';
});

// Inicializar ao carregar página
document.addEventListener('DOMContentLoaded', () => {
    inicializarChat();
    
    // Enter para enviar - suporta ambas as páginas
    const inputMensagem = document.getElementById('inputMensagem') || document.getElementById('messageInput');
    if (inputMensagem) {
        inputMensagem.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                enviarMensagem();
            }
        });
        inputMensagem.addEventListener('input', usuarioDigitando);
    }
    
    // Botão enviar
    const btnEnviar = document.getElementById('btnEnviar') || document.getElementById('sendBtn');
    if (btnEnviar) {
        btnEnviar.addEventListener('click', enviarMensagem);
    }
});
