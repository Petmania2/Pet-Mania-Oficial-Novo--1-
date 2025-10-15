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
        
        // Verificar se é um pet card
        if (mensagem.petCard) {
            messageElement.innerHTML = `
                <div class="pet-card-mensagem">
                    ${mensagem.petCard.foto ? `<img src="${mensagem.petCard.foto}" alt="${mensagem.petCard.nome}">` : '<div class="pet-card-no-photo"><i class="fas fa-dog"></i></div>'}
                    <div class="pet-card-info">
                        <h4>${mensagem.petCard.nome}</h4>
                        <p><i class="fas fa-paw"></i> ${mensagem.petCard.raca}</p>
                        <p><i class="fas fa-calendar"></i> ${mensagem.petCard.idade}</p>
                        <p><i class="fas fa-venus-mars"></i> ${mensagem.petCard.sexo}</p>
                        <p><i class="fas fa-exclamation-circle"></i> ${mensagem.petCard.problema}</p>
                        <p><i class="fas fa-comment"></i> ${mensagem.petCard.observacoes}</p>
                    </div>
                </div>
                <time class="mensagem-timestamp">${mensagem.hora}</time>
            `;
        } else if (mensagem.texto) {
            // Tentar parsear se for JSON (pet card salvo no banco)
            try {
                const parsed = JSON.parse(mensagem.texto);
                if (parsed.tipo === 'pet-card') {
                    messageElement.innerHTML = `
                        <div class="pet-card-mensagem">
                            ${parsed.foto ? `<img src="${parsed.foto}" alt="${parsed.nome}">` : '<div class="pet-card-no-photo"><i class="fas fa-dog"></i></div>'}
                            <div class="pet-card-info">
                                <h4>${parsed.nome}</h4>
                                <p><i class="fas fa-paw"></i> ${parsed.raca}</p>
                                <p><i class="fas fa-calendar"></i> ${parsed.idade}</p>
                                <p><i class="fas fa-venus-mars"></i> ${parsed.sexo}</p>
                                <p><i class="fas fa-exclamation-circle"></i> ${parsed.problema}</p>
                                <p><i class="fas fa-comment"></i> ${parsed.observacoes}</p>
                            </div>
                        </div>
                        <time class="mensagem-timestamp">${mensagem.hora}</time>
                    `;
                } else {
                    throw new Error('Não é pet card');
                }
            } catch {
                // Mensagem de texto normal
                messageElement.innerHTML = `
                    ${mensagem.texto}
                    <time class="mensagem-timestamp">${mensagem.hora}</time>
                `;
            }
        }

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

// Botão enviar pet
const btnAnexarPet = document.getElementById('btnAnexarPet');
btnAnexarPet.addEventListener('click', async () => {
    if (!conversaSelecionada) {
        alert('Selecione uma conversa primeiro!');
        return;
    }
    
    // Carregar pets do cliente
    try {
        const response = await fetch('/api/meus-pets');
        
        if (!response.ok) {
            if (response.status === 401) {
                alert('Você precisa estar logado!');
                window.location.href = '/Login.ejs';
                return;
            }
            throw new Error('Erro ao carregar pets');
        }
        
        const pets = await response.json();
        console.log('Pets carregados:', pets);
        
        if (!pets || pets.length === 0) {
            alert('Você ainda não tem pets cadastrados! Cadastre um pet em "Meus Pets".');
            return;
        }
        
        mostrarModalPets(pets);
    } catch (error) {
        console.error('Erro ao carregar pets:', error);
        alert('Erro ao carregar seus pets. Tente novamente.');
    }
});

// Mostrar modal de seleção de pets
function mostrarModalPets(pets) {
    const modal = document.createElement('div');
    modal.className = 'modal-pets';
    modal.innerHTML = `
        <div class="modal-pets-overlay"></div>
        <div class="modal-pets-content">
            <div class="modal-pets-header">
                <h3>Selecione um Pet</h3>
                <button class="modal-pets-close">&times;</button>
            </div>
            <div class="modal-pets-body">
                ${pets.map(pet => `
                    <div class="pet-card-modal" data-pet='${JSON.stringify(pet).replace(/'/g, '&apos;')}'>
                        <img src="${pet.ID_FOTO_PET ? `/imagem/${pet.ID_FOTO_PET}` : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"%3E%3Cpath d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.7 0-5.8 1.29-6 2h12c-.22-.72-3.31-2-6-2zM12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 12c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E'}" alt="${pet.NOME_PET}">
                        <div class="pet-card-info">
                            <h4>${pet.NOME_PET}</h4>
                            <p>${pet.RACA_PET || 'Raça não informada'}</p>
                            <p>${pet.IDADE_PET || 'Idade não informada'}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal
    modal.querySelector('.modal-pets-close').onclick = () => modal.remove();
    modal.querySelector('.modal-pets-overlay').onclick = () => modal.remove();
    
    // Selecionar pet
    modal.querySelectorAll('.pet-card-modal').forEach(card => {
        card.onclick = () => {
            const pet = JSON.parse(card.dataset.pet);
            enviarPetCard(pet);
            modal.remove();
        };
    });
}

// Enviar card do pet
async function enviarPetCard(pet) {
    const petCard = {
        tipo: 'pet-card',
        nome: pet.NOME_PET,
        raca: pet.RACA_PET || 'Raça não informada',
        idade: pet.IDADE_PET || 'Idade não informada',
        sexo: pet.SEXO_PET || 'Não informado',
        problema: pet.PROBLEMA_COMPORTAMENTO || 'Não informado',
        observacoes: pet.OBSERVACOES || 'Nenhuma observação',
        foto: pet.ID_FOTO_PET ? `/imagem/${pet.ID_FOTO_PET}` : null
    };
    
    const agora = new Date();
    const hora = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');
    
    conversaSelecionada.mensagens.push({
        id: conversaSelecionada.mensagens.length + 1,
        tipo: 'enviada',
        hora: hora,
        petCard: petCard
    });
    
    renderizarMensagens();
    
    // Enviar para o servidor
    try {
        const idAdestrador = conversaSelecionada.idAdestrador || conversaSelecionada.id;
        await fetch('/chat/enviar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idConversa: conversaSelecionada.idConversa,
                idAdestrador: idAdestrador,
                mensagem: JSON.stringify(petCard)
            })
        });
    } catch (error) {
        console.error('Erro ao enviar pet card:', error);
    }
}

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
                    avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E',
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
                    avatar: data.ID_PERFIL && data.ID_PERFIL > 0 ? `/imagem/${data.ID_PERFIL}` : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E',
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