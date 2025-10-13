// Dados simulados de conversas
const conversas = [
    {
        id: 1,
        nome: 'Ricardo Almeida',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        status: 'online',
        ultimaMensagem: 'Ótimo! Vamos agendar a primeira sessão.',
        hora: '14:35',
        naoLida: true,
        mensagens: [
            { id: 1, texto: 'Olá! Tudo bem?', tipo: 'recebida', hora: '14:20' },
            { id: 2, texto: 'Oi! Tudo certo!', tipo: 'enviada', hora: '14:22' },
            { id: 3, texto: 'Gostaria de agendar uma sessão para o seu cachorro.', tipo: 'recebida', hora: '14:30' },
            { id: 4, texto: 'Ótimo! Vamos agendar a primeira sessão.', tipo: 'recebida', hora: '14:35' },
        ]
    },
    {
        id: 2,
        nome: 'Juliana Costa',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        status: 'online',
        ultimaMensagem: 'Filhotes precisam de socialização desde cedo.',
        hora: '13:15',
        naoLida: true,
        mensagens: [
            { id: 1, texto: 'Eu tenho um filhote de 3 meses.', tipo: 'enviada', hora: '13:00' },
            { id: 2, texto: 'Que ótimo! Filhotes são o meu foco.', tipo: 'recebida', hora: '13:05' },
            { id: 3, texto: 'Filhotes precisam de socialização desde cedo.', tipo: 'recebida', hora: '13:15' },
        ]
    },
    {
        id: 3,
        nome: 'Carlos Mendes',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        status: 'offline',
        ultimaMensagem: 'Vou analisar o vídeo e retorno com um diagnóstico.',
        hora: '11:20',
        naoLida: false,
        mensagens: [
            { id: 1, texto: 'Meu cachorro tem problemas de agressividade.', tipo: 'enviada', hora: '10:50' },
            { id: 2, texto: 'Posso ajudá-lo. Você pode me enviar um vídeo?', tipo: 'recebida', hora: '11:00' },
            { id: 3, texto: 'Enviei o vídeo agora.', tipo: 'enviada', hora: '11:10' },
            { id: 4, texto: 'Vou analisar o vídeo e retorno com um diagnóstico.', tipo: 'recebida', hora: '11:20' },
        ]
    },
    {
        id: 4,
        nome: 'Ana Silva',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        status: 'online',
        ultimaMensagem: 'Você recebeu uma mensagem',
        hora: '09:45',
        naoLida: false,
        mensagens: [
            { id: 1, texto: 'Olá, tudo bem?', tipo: 'enviada', hora: '09:30' },
            { id: 2, texto: 'Oi! Tudo certo, e com você?', tipo: 'recebida', hora: '09:45' },
        ]
    },
];

// Elementos do DOM
const listaConversas = document.getElementById('listaConversas');
const chatVazio = document.getElementById('chatVazio');
const chatAtivo = document.getElementById('chatAtivo');
const mensagensArea = document.getElementById('mensagensArea');
const inputMensagem = document.getElementById('inputMensagem');
const btnEnviar = document.getElementById('btnEnviar');
const btnCloseSidebar = document.getElementById('btnCloseSidebar');
const btnOpenSidebar = document.getElementById('btnOpenSidebar');
const conversasSidebar = document.querySelector('.conversas-sidebar');
const searchConversas = document.getElementById('searchConversas');
const filtrosBtns = document.querySelectorAll('.filtro-btn');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const badgeMensagens = document.getElementById('badgeMensagens');

// Estado da aplicação
let conversaSelecionada = null;
let filtroAtivo = 'todas';

// Renderizar lista de conversas
function renderizarConversas(conversasParaRenderizar = conversas) {
    listaConversas.innerHTML = '';

    if (conversasParaRenderizar.length === 0) {
        listaConversas.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">Nenhuma conversa encontrada</p>';
        return;
    }

    conversasParaRenderizar.forEach(conversa => {
        const conversaElement = document.createElement('article');
        conversaElement.className = `conversa-item ${conversa.id === conversaSelecionada?.id ? 'ativo' : ''}`;
        conversaElement.innerHTML = `
            <figure class="conversa-avatar">
                <img src="${conversa.avatar}" alt="${conversa.nome}">
                <span class="status-dot ${conversa.status === 'offline' ? 'offline' : ''}"></span>
            </figure>
            <section class="conversa-content">
                <section class="conversa-header">
                    <h3 class="conversa-nome">${conversa.nome}</h3>
                    <span class="conversa-hora">${conversa.hora}</span>
                </section>
                <p class="conversa-mensagem ${conversa.naoLida ? 'nao-lida' : ''}">${conversa.ultimaMensagem}</p>
            </section>
        `;
        
        conversaElement.addEventListener('click', () => selecionarConversa(conversa));
        listaConversas.appendChild(conversaElement);
    });
}

// Selecionar conversa
function selecionarConversa(conversa) {
    conversaSelecionada = conversa;
    conversa.naoLida = false;
    
    // Atualizar UI
    renderizarConversas(filtrarConversas());
    renderizarChat();
    
    // Fechar sidebar em mobile
    if (window.innerWidth <= 768) {
        conversasSidebar.classList.remove('ativo');
    }
    
    // Focar input
    setTimeout(() => inputMensagem.focus(), 100);
    
    // Atualizar badge
    atualizarBadge();
}

// Renderizar chat ativo
function renderizarChat() {
    if (!conversaSelecionada) {
        chatVazio.style.display = 'flex';
        chatAtivo.style.display = 'none';
        return;
    }

    chatVazio.style.display = 'none';
    chatAtivo.style.display = 'flex';

    // Atualizar header do chat
    document.getElementById('chatAvatarImg').src = conversaSelecionada.avatar;
    document.getElementById('chatNome').textContent = conversaSelecionada.nome;
    document.getElementById('chatStatus').textContent = 
        conversaSelecionada.status === 'online' ? 'Online' : 'Offline';
    
    const statusIndicator = document.getElementById('statusIndicator');
    statusIndicator.classList.toggle('offline', conversaSelecionada.status === 'offline');

    // Renderizar mensagens
    renderizarMensagens();
}

// Renderizar mensagens
function renderizarMensagens() {
    mensagensArea.innerHTML = '';

    conversaSelecionada.mensagens.forEach(mensagem => {
        const messageGroup = document.createElement('section');
        messageGroup.className = `mensagem-grupo ${mensagem.tipo === 'enviada' ? 'enviada' : ''}`;

        const messageElement = document.createElement('article');
        messageElement.className = `mensagem ${mensagem.tipo}`;
        messageElement.innerHTML = `
            ${mensagem.texto}
            <time class="mensagem-timestamp">${mensagem.hora}</time>
        `;

        messageGroup.appendChild(messageElement);
        mensagensArea.appendChild(messageGroup);
    });

    // Scroll para o final
    setTimeout(() => {
        mensagensArea.scrollTop = mensagensArea.scrollHeight;
    }, 50);
}

// Enviar mensagem
function enviarMensagem() {
    const texto = inputMensagem.value.trim();
    
    if (!texto || !conversaSelecionada) return;

    // Obter hora atual
    const agora = new Date();
    const hora = agora.getHours().toString().padStart(2, '0') + ':' + 
                 agora.getMinutes().toString().padStart(2, '0');

    // Adicionar mensagem ao array
    conversaSelecionada.mensagens.push({
        id: conversaSelecionada.mensagens.length + 1,
        texto: texto,
        tipo: 'enviada',
        hora: hora
    });

    // Atualizar ultima mensagem
    conversaSelecionada.ultimaMensagem = texto;
    conversaSelecionada.hora = hora;

    // Limpar input
    inputMensagem.value = '';

    // Renderizar mensagens
    renderizarMensagens();

    // Simular resposta automática após 2 segundos
    setTimeout(() => {
        if (conversaSelecionada) {
            const respostas = [
                'Entendi! Que ótimo!',
                'Pode deixar comigo.',
                'Vamos agendar isso.',
                'Perfeito! Confirmo aqui.',
                'Ótimo! Vou processar isso.',
                'Tudo bem, sem problema.',
                'Combinado! Até breve.',
            ];

            const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
            
            const agoraResposta = new Date();
            const horaResposta = agoraResposta.getHours().toString().padStart(2, '0') + ':' + 
                                 agoraResposta.getMinutes().toString().padStart(2, '0');

            conversaSelecionada.mensagens.push({
                id: conversaSelecionada.mensagens.length + 1,
                texto: respostaAleatoria,
                tipo: 'recebida',
                hora: horaResposta
            });

            conversaSelecionada.ultimaMensagem = respostaAleatoria;
            conversaSelecionada.hora = horaResposta;

            renderizarMensagens();
            renderizarConversas(filtrarConversas());
        }
    }, 2000);
}

// Filtrar conversas
function filtrarConversas() {
    let conversasFiltradas = conversas;

    // Filtro por tipo
    if (filtroAtivo === 'nao-lidas') {
        conversasFiltradas = conversasFiltradas.filter(c => c.naoLida);
    }

    // Filtro por busca
    const textoBusca = searchConversas.value.toLowerCase();
    if (textoBusca) {
        conversasFiltradas = conversasFiltradas.filter(c =>
            c.nome.toLowerCase().includes(textoBusca) ||
            c.ultimaMensagem.toLowerCase().includes(textoBusca)
        );
    }

    return conversasFiltradas;
}

// Atualizar badge de mensagens não lidas
function atualizarBadge() {
    const naoLidas = conversas.filter(c => c.naoLida).length;
    badgeMensagens.textContent = naoLidas;
    badgeMensagens.style.display = naoLidas > 0 ? 'block' : 'none';
}

// Event Listeners

// Enviar mensagem - botão
btnEnviar.addEventListener('click', enviarMensagem);

// Enviar mensagem - Enter
inputMensagem.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
});

// Buscar conversas
searchConversas.addEventListener('input', () => {
    renderizarConversas(filtrarConversas());
});

// Filtros
filtrosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filtrosBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroAtivo = btn.dataset.filtro;
        renderizarConversas(filtrarConversas());
    });
});

// Abrir/fechar sidebar em mobile
btnCloseSidebar.addEventListener('click', () => {
    conversasSidebar.classList.remove('ativo');
});

btnOpenSidebar.addEventListener('click', () => {
    conversasSidebar.classList.add('ativo');
});

// Menu mobile
mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Botão anexar (simulação)
document.querySelector('.btn-anexar').addEventListener('click', () => {
    alert('Funcionalidade de anexar arquivos será implementada em breve!');
});

// Botão mais opções
document.querySelector('.btn-icon').addEventListener('click', () => {
    alert('Opções: Denunciar, Bloquear, Limpar Conversa');
});

// Responsividade - Fechar sidebar ao redimensionar
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        conversasSidebar.classList.remove('ativo');
    }
});

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    renderizarConversas();
    atualizarBadge();

    // Carregar primeira conversa automaticamente em desktop
    if (window.innerWidth > 768) {
        selecionarConversa(conversas[0]);
    }
});