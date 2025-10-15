// Dados simulados de conversas
let conversas = [
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

    // Verificar se há um adestrador na URL
    const urlParams = new URLSearchParams(window.location.search);
    const adestradorId = parseInt(urlParams.get('adestrador'));
    
    if (adestradorId) {
        let conversa = conversas.find(c => c.id === adestradorId);
        
        if (!conversa) {
            // Se ID > 1000, buscar do banco
            if (adestradorId > 1000) {
                fetch(`/api/adestrador/${adestradorId - 1000}`)
                    .then(res => res.json())
                    .then(data => {
                        const agora = new Date();
                        const hora = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');
                        
                        const novaConversa = {
                            id: adestradorId,
                            nome: data.nome,
                            avatar: data.ID_PERFIL && data.ID_PERFIL > 0 ? `/imagem/${data.ID_PERFIL}` : 'https://via.placeholder.com/100',
                            status: 'online',
                            ultimaMensagem: 'Inicie uma conversa',
                            hora: hora,
                            naoLida: false,
                            mensagens: []
                        };
                        
                        conversas.unshift(novaConversa);
                        renderizarConversas();
                        selecionarConversa(novaConversa);
                    })
                    .catch(error => {
                        console.error('Erro ao carregar adestrador:', error);
                    });
                return;
            }
            
            const trainers = [
                { id: 1, name: "Ricardo Almeida", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
                { id: 2, name: "Juliana Costa", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
                { id: 3, name: "Carlos Mendes", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
                { id: 4, name: "Ana Silva", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
                { id: 5, name: "Fernando Santos", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
                { id: 6, name: "Patricia Lima", image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop" },
                { id: 7, name: "Roberto Ferreira", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
                { id: 8, name: "Mariana Oliveira", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
                { id: 9, name: "Lucas Rodrigues", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" },
                { id: 10, name: "Camila Souza", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop" },
                { id: 11, name: "Thiago Araújo", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop" },
                { id: 12, name: "Gabriela Martins", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop" },
                { id: 13, name: "Daniel Costa", image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop" },
                { id: 14, name: "Renata Alves", image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop" },
                { id: 15, name: "Marcelo Pereira", image: "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=100&h=100&fit=crop" },
                { id: 16, name: "Beatriz Ribeiro", image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop" },
                { id: 17, name: "Rafael Silva", image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=100&h=100&fit=crop" },
                { id: 18, name: "Amanda Carvalho", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" },
                { id: 19, name: "Bruno Nascimento", image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop" },
                { id: 20, name: "Larissa Gomes", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop" },
                { id: 21, name: "Eduardo Santos", image: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=100&h=100&fit=crop" },
                { id: 22, name: "Fernanda Lima", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop" },
                { id: 23, name: "Paulo Henrique", image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&h=100&fit=crop" },
                { id: 24, name: "Juliane Rocha", image: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?w=100&h=100&fit=crop" },
                { id: 25, name: "André Moreira", image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop" },
                { id: 26, name: "Bianca Teixeira", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop" },
                { id: 27, name: "Rodrigo Fernandes", image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop" },
                { id: 28, name: "Vanessa Dias", image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=100&h=100&fit=crop" },
                { id: 29, name: "Guilherme Barros", image: "https://images.unsplash.com/photo-1509305717900-84f40e786d82?w=100&h=100&fit=crop" },
                { id: 30, name: "Carolina Mendes", image: "https://images.unsplash.com/photo-1507114845806-0bf8f8f0e3f0?w=100&h=100&fit=crop" }
            ];
            
            const trainer = trainers.find(t => t.id === adestradorId);
            
            if (trainer) {
                const agora = new Date();
                const hora = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');
                
                conversa = {
                    id: adestradorId,
                    nome: trainer.name,
                    avatar: trainer.image,
                    status: 'online',
                    ultimaMensagem: 'Inicie uma conversa',
                    hora: hora,
                    naoLida: false,
                    mensagens: []
                };
                
                conversas.unshift(conversa);
                renderizarConversas();
            }
        }
        
        if (conversa) {
            selecionarConversa(conversa);
        }
    } else if (window.innerWidth > 768 && conversas.length > 0) {
        selecionarConversa(conversas[0]);
    }
});