// Conversas carregadas do banco
let conversas = [];

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
async function selecionarConversa(conversa) {
    conversaSelecionada = conversa;
    conversa.naoLida = false;
    
    // Carregar mensagens da conversa
    if (conversa.idConversa) {
        try {
            const response = await fetch(`/chat/historico/${conversa.idConversa}`);
            const data = await response.json();
            if (data.mensagens) {
                conversa.mensagens = data.mensagens.map(m => ({
                    id: m.id_mensagem,
                    texto: m.mensagem,
                    tipo: m.id_remetente === conversa.idAdestrador ? 'recebida' : 'enviada',
                    hora: new Date(m.data_envio).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
                }));
            }
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        }
    }
    
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
async function enviarMensagem() {
    const texto = inputMensagem.value.trim();
    
    if (!texto || !conversaSelecionada) return;

    const agora = new Date();
    const hora = agora.getHours().toString().padStart(2, '0') + ':' + 
                 agora.getMinutes().toString().padStart(2, '0');

    conversaSelecionada.mensagens.push({
        id: conversaSelecionada.mensagens.length + 1,
        texto: texto,
        tipo: 'enviada',
        hora: hora
    });

    conversaSelecionada.ultimaMensagem = texto;
    conversaSelecionada.hora = hora;

    inputMensagem.value = '';
    renderizarMensagens();

    // Enviar mensagem para o servidor
    try {
        const idAdestrador = conversaSelecionada.idAdestrador || conversaSelecionada.id;
        await fetch('/chat/enviar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idConversa: conversaSelecionada.idConversa,
                idAdestrador: idAdestrador,
                mensagem: texto 
            })
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
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

// Carregar conversas do banco
async function carregarConversas() {
    try {
        const response = await fetch('/chat/conversas');
        const data = await response.json();
        console.log('Conversas recebidas:', data);
        
        if (data.conversas) {
            conversas = data.conversas.map(c => {
                console.log('Mapeando conversa:', c);
                return {
                    id: c.id_conversa,
                    idConversa: c.id_conversa,
                    idAdestrador: c.id_outro_usuario,
                    nome: c.nome_outro_usuario,
                    avatar: 'https://via.placeholder.com/100',
                    status: 'online',
                    ultimaMensagem: 'Inicie uma conversa',
                    hora: c.ultima_mensagem ? new Date(c.ultima_mensagem).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}) : '',
                    naoLida: c.nao_lidas > 0,
                    mensagens: []
                };
            });
        }
        
        console.log('Conversas processadas:', conversas);
        renderizarConversas();
        atualizarBadge();
    } catch (error) {
        console.error('Erro ao carregar conversas:', error);
    }
}

// Inicializar página
document.addEventListener('DOMContentLoaded', async () => {
    await carregarConversas();

    // Verificar se há um adestrador na URL
    const urlParams = new URLSearchParams(window.location.search);
    const adestradorId = parseInt(urlParams.get('adestrador'));
    
    if (adestradorId) {
        let conversa = conversas.find(c => c.idAdestrador === adestradorId);
        
        if (!conversa) {
            // Buscar adestrador e criar nova conversa
            try {
                const res = await fetch(`/api/adestrador/${adestradorId}`);
                const data = await res.json();
                
                const agora = new Date();
                const hora = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');
                
                conversa = {
                    id: Date.now(),
                    idAdestrador: adestradorId,
                    nome: data.nome,
                    avatar: data.ID_PERFIL && data.ID_PERFIL > 0 ? `/imagem/${data.ID_PERFIL}` : 'https://via.placeholder.com/100',
                    status: 'online',
                    ultimaMensagem: 'Inicie uma conversa',
                    hora: hora,
                    naoLida: false,
                    mensagens: []
                };
                
                conversas.unshift(conversa);
                renderizarConversas();
                selecionarConversa(conversa);
            } catch (error) {
                console.error('Erro ao carregar adestrador:', error);
            }
            return;
        }
        
        if (conversa) {
            selecionarConversa(conversa);
        }
    } else if (window.innerWidth > 768 && conversas.length > 0) {
        selecionarConversa(conversas[0]);
    }
});