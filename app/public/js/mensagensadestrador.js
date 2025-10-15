// Conversas carregadas do banco
let conversas = [];
let conversaSelecionada = null;

// Carregar conversas do banco
async function carregarConversas() {
    try {
        const response = await fetch('/chat/conversas');
        const data = await response.json();
        
        if (data.conversas) {
            conversas = data.conversas.map(c => ({
                id: c.id_conversa,
                idConversa: c.id_conversa,
                idCliente: c.id_outro_usuario,
                nome: c.nome_outro_usuario,
                avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E',
                status: 'online',
                ultimaMensagem: 'Inicie uma conversa',
                hora: c.ultima_mensagem ? new Date(c.ultima_mensagem).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}) : '',
                naoLida: c.nao_lidas > 0,
                mensagens: []
            }));
        }
        
        renderizarConversas();
    } catch (error) {
        console.error('Erro ao carregar conversas:', error);
    }
}

// Renderizar lista de conversas
function renderizarConversas() {
    const contactsList = document.querySelector('.contacts-list');
    contactsList.innerHTML = '';

    if (conversas.length === 0) {
        contactsList.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">Nenhuma conversa</p>';
        return;
    }

    conversas.forEach(conversa => {
        const contactItem = document.createElement('section');
        contactItem.className = `contact-item ${conversa.id === conversaSelecionada?.id ? 'active' : ''}`;
        contactItem.innerHTML = `
            <section class="contact-avatar" style="background-image: url('${conversa.avatar}')"></section>
            <section class="contact-info">
                <h4>${conversa.nome}</h4>
                <p class="last-message">${conversa.ultimaMensagem}</p>
                <span class="message-time">${conversa.hora}</span>
            </section>
            ${conversa.naoLida ? '<section class="contact-status"><span class="status-badge new">Nova</span></section>' : ''}
        `;
        
        contactItem.addEventListener('click', () => selecionarConversa(conversa));
        contactsList.appendChild(contactItem);
    });
}

// Carregar mensagens da conversa
async function carregarMensagensConversa() {
    if (!conversaSelecionada || !conversaSelecionada.idConversa) return;
    
    try {
        const response = await fetch(`/chat/historico/${conversaSelecionada.idConversa}`);
        const data = await response.json();
        if (data.mensagens) {
            conversaSelecionada.mensagens = data.mensagens.map(m => ({
                id: m.id_mensagem,
                texto: m.mensagem,
                tipo: m.id_remetente === conversaSelecionada.idCliente ? 'recebida' : 'enviada',
                hora: new Date(m.data_envio).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
            }));
            renderizarMensagens();
        }
    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
    }
}

// Selecionar conversa
async function selecionarConversa(conversa) {
    conversaSelecionada = conversa;
    conversa.naoLida = false;
    
    // Atualizar nome no header
    document.getElementById('chatContactName').textContent = conversa.nome;
    
    // Carregar mensagens da conversa
    await carregarMensagensConversa();
    
    // Atualizar UI
    renderizarConversas();
    
    // Iniciar atualização automática
    if (window.intervalAtualizacao) {
        clearInterval(window.intervalAtualizacao);
    }
    window.intervalAtualizacao = setInterval(carregarMensagensConversa, 2000);
}

// Renderizar mensagens
function renderizarMensagens() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';

    conversaSelecionada.mensagens.forEach(mensagem => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${mensagem.tipo}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${mensagem.texto}</p>
                <span class="message-time">${mensagem.hora}</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
    });

    // Scroll para o final
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 50);
}

// Enviar mensagem
async function enviarMensagem() {
    const messageInput = document.getElementById('messageInput');
    const texto = messageInput.value.trim();
    
    if (!texto || !conversaSelecionada) return;

    messageInput.value = '';

    // Enviar mensagem para o servidor
    try {
        await fetch('/chat/enviar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idConversa: conversaSelecionada.idConversa,
                idAdestrador: conversaSelecionada.idCliente,
                mensagem: texto 
            })
        });
        
        // Recarregar mensagens
        await carregarMensagensConversa();
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
}

// Event listeners
document.getElementById('sendBtn').addEventListener('click', enviarMensagem);

document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
});

// Parar atualização ao sair da página
window.addEventListener('beforeunload', () => {
    if (window.intervalAtualizacao) {
        clearInterval(window.intervalAtualizacao);
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', async () => {
    await carregarConversas();
    
    if (conversas.length > 0) {
        selecionarConversa(conversas[0]);
    }
});
