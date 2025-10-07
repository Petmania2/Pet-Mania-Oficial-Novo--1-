// adestradores.js - JavaScript para página de adestradores

// Dados mockados dos adestradores
const adestradoresData = [
    {
        id: 1,
        nome: "Ricardo Almeida",
        especialidade: "obediencia-basica",
        cidade: "sao-paulo",
        preco: 150,
        rating: 5.0,
        reviews: 57,
        experiencia: 8,
        disponibilidade: ["manha", "tarde"],
        imagem: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        badge: "Top Adestrador",
        descricao: "Especialista em obediência básica com 8 anos de experiência",
        telefone: "(11) 99999-1111"
    },
    {
        id: 2,
        nome: "Juliana Costa",
        especialidade: "comportamento",
        cidade: "rio-de-janeiro",
        preco: 180,
        rating: 4.9,
        reviews: 43,
        experiencia: 10,
        disponibilidade: ["tarde", "noite"],
        imagem: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        badge: "",
        descricao: "Especialista em comportamento canino",
        telefone: "(21) 99999-2222"
    },
    {
        id: 3,
        nome: "Carlos Mendes",
        especialidade: "agressividade",
        cidade: "belo-horizonte",
        preco: 220,
        rating: 4.8,
        reviews: 38,
        experiencia: 12,
        disponibilidade: ["manha", "fim-semana"],
        imagem: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        badge: "Especialista",
        descricao: "Controle de agressividade canina",
        telefone: "(31) 99999-3333"
    },
    {
        id: 4,
        nome: "Ana Silva",
        especialidade: "truques",
        cidade: "curitiba",
        preco: 160,
        rating: 4.7,
        reviews: 31,
        experiencia: 6,
        disponibilidade: ["tarde", "noite"],
        imagem: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        badge: "",
        descricao: "Truques e comandos avançados",
        telefone: "(41) 99999-4444"
    },
    {
        id: 5,
        nome: "Pedro Santos",
        especialidade: "filhotes",
        cidade: "porto-alegre",
        preco: 140,
        rating: 4.9,
        reviews: 64,
        experiencia: 9,
        disponibilidade: ["manha", "tarde"],
        imagem: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        badge: "Certificado",
        descricao: "Adestramento para filhotes",
        telefone: "(51) 99999-5555"
    },
    {
        id: 6,
        nome: "Mariana Lima",
        especialidade: "socializacao",
        cidade: "brasilia",
        preco: 170,
        rating: 4.6,
        reviews: 42,
        experiencia: 7,
        disponibilidade: ["fim-semana"],
        imagem: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        badge: "",
        descricao: "Socialização canina",
        telefone: "(61) 99999-6666"
    },
    {
        id: 7,
        nome: "Lucas Ferreira",
        especialidade: "guarda",
        cidade: "salvador",
        preco: 200,
        rating: 4.8,
        reviews: 29,
        experiencia: 11,
        disponibilidade: ["noite", "fim-semana"],
        imagem: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        badge: "Especialista",
        descricao: "Treinamento de cães de guarda",
        telefone: "(71) 99999-7777"
    },
    {
        id: 8,
        nome: "Fernanda Rocha",
        especialidade: "obediencia-basica",
        cidade: "fortaleza",
        preco: 130,
        rating: 4.5,
        reviews: 26,
        experiencia: 5,
        disponibilidade: ["manha"],
        imagem: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        badge: "",
        descricao: "Obediência básica e socialização",
        telefone: "(85) 99999-8888"
    }
];

// Mapeamento de especialidades e cidades para exibição
const especialidadesMap = {
    "obediencia-basica": "Obediência Básica",
    "comportamento": "Problemas de Comportamento",
    "truques": "Truques e Comandos",
    "agressividade": "Controle de Agressividade",
    "filhotes": "Adestramento para Filhotes",
    "socializacao": "Socialização Canina",
    "guarda": "Cães de Guarda"
};

const cidadesMap = {
    "sao-paulo": "São Paulo",
    "rio-de-janeiro": "Rio de Janeiro",
    "belo-horizonte": "Belo Horizonte",
    "curitiba": "Curitiba",
    "porto-alegre": "Porto Alegre",
    "brasilia": "Brasília",
    "salvador": "Salvador",
    "fortaleza": "Fortaleza"
};

// Variáveis globais
let filteredAdestradores = [...adestradoresData];
let currentPage = 1;
const itemsPerPage = 6;
let currentView = 'grid';

// Elementos do DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cityFilter = document.getElementById('cityFilter');
const specialtyFilter = document.getElementById('specialtyFilter');
const priceFilter = document.getElementById('priceFilter');
const ratingFilter = document.getElementById('ratingFilter');
const experienceFilter = document.getElementById('experienceFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const sortBy = document.getElementById('sortBy');
const gridContainer = document.getElementById('gridContainer');
const listContainer = document.getElementById('listContainer');
const gridView = document.getElementById('gridView');
const listView = document.getElementById('listView');
const resultsCount = document.getElementById('resultsCount');
const loadingSpinner = document.getElementById('loadingSpinner');
const noResults = document.getElementById('noResults');
const toggleFilters = document.getElementById('toggleFilters');
const advancedFilters = document.getElementById('advancedFilters');
const clearFilters = document.getElementById('clearFilters');
const resetSearch = document.getElementById('resetSearch');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    renderAdestradores();
    updateResultsCount();
});

// Event Listeners
function initializeEventListeners() {
    // Busca
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Filtros
    cityFilter.addEventListener('change', applyFilters);
    specialtyFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    ratingFilter.addEventListener('change', applyFilters);
    experienceFilter.addEventListener('change', applyFilters);
    availabilityFilter.addEventListener('change', applyFilters);
    sortBy.addEventListener('change', applySorting);

    // Visualizações
    gridView.addEventListener('click', () => switchView('grid'));
    listView.addEventListener('click', () => switchView('list'));

    // Controles de filtros
    toggleFilters.addEventListener('click', toggleAdvancedFilters);
    clearFilters.addEventListener('click', clearAllFilters);
    resetSearch.addEventListener('click', resetAllFilters);

    // Paginação
    document.getElementById('prevPage').addEventListener('click', () => changePage(currentPage - 1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(currentPage + 1));
}

// Funções de busca e filtros
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredAdestradores = [...adestradoresData];
    } else {
        filteredAdestradores = adestradoresData.filter(adestrador => 
            adestrador.nome.toLowerCase().includes(searchTerm) ||
            especialidadesMap[adestrador.especialidade].toLowerCase().includes(searchTerm) ||
            cidadesMap[adestrador.cidade].toLowerCase().includes(searchTerm)
        );
    }
    
    applyFilters();
}

function applyFilters() {
    let filtered = [...(searchInput.value.trim() ? filteredAdestradores : adestradoresData)];

    // Aplicar filtros
    if (cityFilter.value) {
        filtered = filtered.filter(a => a.cidade === cityFilter.value);
    }

    if (specialtyFilter.value) {
        filtered = filtered.filter(a => a.especialidade === specialtyFilter.value);
    }

    if (priceFilter.value) {
        const priceRange = priceFilter.value;
        filtered = filtered.filter(a => {
            if (priceRange === '0-100') return a.preco <= 100;
            if (priceRange === '100-150') return a.preco >= 100 && a.preco <= 150;
            if (priceRange === '150-200') return a.preco >= 150 && a.preco <= 200;
            if (priceRange === '200-300') return a.preco >= 200 && a.preco <= 300;
            if (priceRange === '300+') return a.preco > 300;
            return true;
        });
    }

    if (ratingFilter.value) {
        const minRating = parseFloat(ratingFilter.value);
        filtered = filtered.filter(a => a.rating >= minRating);
    }

    if (experienceFilter.value) {
        const expRange = experienceFilter.value;
        filtered = filtered.filter(a => {
            if (expRange === '0-2') return a.experiencia <= 2;
            if (expRange === '3-5') return a.experiencia >= 3 && a.experiencia <= 5;
            if (expRange === '6-10') return a.experiencia >= 6 && a.experiencia <= 10;
            if (expRange === '10+') return a.experiencia > 10;
            return true;
        });
    }

    if (availabilityFilter.value) {
        filtered = filtered.filter(a => a.disponibilidade.includes(availabilityFilter.value));
    }

    filteredAdestradores = filtered;
    applySorting();
}

function applySorting() {
    const sortOption = sortBy.value;
    
    filteredAdestradores.sort((a, b) => {
        switch (sortOption) {
            case 'rating':
                return b.rating - a.rating;
            case 'price-low':
                return a.preco - b.preco;
            case 'price-high':
                return b.preco - a.preco;
            case 'experience':
                return b.experiencia - a.experiencia;
            case 'newest':
                return b.id - a.id;
            default: // relevance
                return b.reviews - a.reviews;
        }
    });

    currentPage = 1;
    renderAdestradores();
    updateResultsCount();
    renderPagination();
}

// Funções de renderização
function renderAdestradores() {
    showLoading(true);
    
    setTimeout(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentItems = filteredAdestradores.slice(startIndex, endIndex);

        if (currentItems.length === 0) {
            showNoResults(true);
            showLoading(false);
            return;
        }

        showNoResults(false);
        
        if (currentView === 'grid') {
            renderGridView(currentItems);
        } else {
            renderListView(currentItems);
        }
        
        showLoading(false);
        renderPagination();
    }, 500);
}

function renderGridView(adestradores) {
    gridContainer.innerHTML = '';
    
    adestradores.forEach(adestrador => {
        const card = createTrainerCard(adestrador);
        gridContainer.appendChild(card);
    });
}

function renderListView(adestradores) {
    listContainer.innerHTML = '';
    
    adestradores.forEach(adestrador => {
        const item = createTrainerListItem(adestrador);
        listContainer.appendChild(item);
    });
}

function createTrainerCard(adestrador) {
    const card = document.createElement('article');
    card.className = 'trainer-card';
    card.innerHTML = `
        <div class="trainer-header">
            <div class="trainer-rating">
                <i class="fas fa-star"></i> ${adestrador.rating}
            </div>
            ${adestrador.badge ? `<div class="trainer-badge">
                <i class="fas fa-medal"></i> ${adestrador.badge}
            </div>` : ''}
        </div>
        <div class="trainer-img" onclick="verPerfil(${adestrador.id})" style="cursor: pointer;">
            <img src="${adestrador.imagem}" alt="${adestrador.nome}">
        </div>
        <div class="trainer-info">
            <h3 class="trainer-name" onclick="verPerfil(${adestrador.id})" style="cursor: pointer;">${adestrador.nome}</h3>
            <p class="trainer-specialty">
                <i class="fas fa-certificate"></i> ${especialidadesMap[adestrador.especialidade]}
            </p>
            <p class="trainer-location">
                <i class="fas fa-map-marker-alt"></i> ${cidadesMap[adestrador.cidade]}
            </p>
            <p class="trainer-experience">
                <i class="fas fa-clock"></i> ${adestrador.experiencia} anos de experiência
            </p>
            <div class="trainer-reviews">
                <div class="stars">${generateStars(adestrador.rating)}</div>
                <span>(${adestrador.reviews} avaliações)</span>
            </div>
            <div class="trainer-price-info">
                <span class="price-label">Preço por sessão:</span>
                <span class="price-value">R$ ${adestrador.preco}</span>
            </div>
            <div class="trainer-buttons">
                <button class="btn btn-primary trainer-btn" onclick="agendarSessao(${adestrador.id})">
                    Agendar Sessão
                </button>
                <button class="btn btn-outline trainer-btn" onclick="verPerfil(${adestrador.id})" style="margin-top: 0.5rem;">
                    Ver Perfil
                </button>
            </div>
        </div>
    `;
    return card;
}
function createTrainerListItem(adestrador) {
    const item = document.createElement('div');
    item.className = 'trainer-list-item';
    item.innerHTML = `
        <div class="trainer-list-img" onclick="verPerfil(${adestrador.id})" style="cursor: pointer;">
            <img src="${adestrador.imagem}" alt="${adestrador.nome}">
            ${adestrador.badge ? `<div class="trainer-badge">
                <i class="fas fa-medal"></i> ${adestrador.badge}
            </div>` : ''}
        </div>
        <div class="trainer-list-content">
            <div class="trainer-list-main">
                <h3 onclick="verPerfil(${adestrador.id})" style="cursor: pointer;">${adestrador.nome}</h3>
                <div class="trainer-rating">
                    <i class="fas fa-star"></i> ${adestrador.rating}
                    <span>(${adestrador.reviews} avaliações)</span>
                </div>
                <p class="trainer-specialty">
                    <i class="fas fa-certificate"></i> ${especialidadesMap[adestrador.especialidade]}
                </p>
                <p class="trainer-location">
                    <i class="fas fa-map-marker-alt"></i> ${cidadesMap[adestrador.cidade]}
                </p>
                <p class="trainer-experience">
                    <i class="fas fa-clock"></i> ${adestrador.experiencia} anos de experiência
                </p>
                <p class="trainer-description">${adestrador.descricao}</p>
            </div>
        </div>
        <div class="trainer-list-actions">
            <div class="price-info">
                <span class="price-value">R$ ${adestrador.preco}</span>
                <span class="price-label">por sessão</span>
            </div>
            <button class="btn btn-primary" onclick="agendarSessao(${adestrador.id})">
                Agendar Sessão
            </button>
            <button class="btn btn-outline" onclick="verPerfil(${adestrador.id})">
                Ver Perfil
            </button>
        </div>
    `;
    return item;
}
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    
    if (hasHalfStar) {
        stars += '⭐';
    }
    
    return stars;
}

// Funções de controle de visualização
function switchView(view) {
    currentView = view;
    
    if (view === 'grid') {
        gridView.classList.add('active');
        listView.classList.remove('active');
        gridContainer.style.display = 'grid';
        listContainer.style.display = 'none';
    } else {
        listView.classList.add('active');
        gridView.classList.remove('active');
        gridContainer.style.display = 'none';
        listContainer.style.display = 'block';
    }
    
    renderAdestradores();
}

function toggleAdvancedFilters() {
    const isVisible = advancedFilters.style.display !== 'none';
    advancedFilters.style.display = isVisible ? 'none' : 'block';
    
    const icon = toggleFilters.querySelector('i');
    icon.className = isVisible ? 'fas fa-filter' : 'fas fa-times';
    
    toggleFilters.innerHTML = isVisible ? 
        '<i class="fas fa-filter"></i> Filtros Avançados' : 
        '<i class="fas fa-times"></i> Fechar Filtros';
}

// Funções de paginação
function renderPagination() {
    const totalPages = Math.ceil(filteredAdestradores.length / itemsPerPage);
    const pageNumbers = document.getElementById('pageNumbers');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    // Atualizar botões prev/next
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Gerar números das páginas
    pageNumbers.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => changePage(i));
        pageNumbers.appendChild(pageBtn);
    }
}

function changePage(page) {
    const totalPages = Math.ceil(filteredAdestradores.length / itemsPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderAdestradores();
        updateResultsCount();
        
        // Scroll para o topo da seção de resultados
        document.getElementById('adestradoresContainer').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Funções utilitárias
function updateResultsCount() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredAdestradores.length);
    const total = filteredAdestradores.length;
    
    resultsCount.textContent = `Mostrando ${startIndex}-${endIndex} de ${total} adestradores`;
}

function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
    gridContainer.style.display = show ? 'none' : (currentView === 'grid' ? 'grid' : 'none');
    listContainer.style.display = show ? 'none' : (currentView === 'list' ? 'block' : 'none');
}

function showNoResults(show) {
    noResults.style.display = show ? 'flex' : 'none';
    document.getElementById('paginationContainer').style.display = show ? 'none' : 'flex';
}

function clearAllFilters() {
    // Limpar todos os filtros
    cityFilter.value = '';
    specialtyFilter.value = '';
    priceFilter.value = '';
    ratingFilter.value = '';
    experienceFilter.value = '';
    availabilityFilter.value = '';
    sortBy.value = 'relevance';
    
    // Resetar dados
    filteredAdestradores = [...adestradoresData];
    currentPage = 1;
    
    renderAdestradores();
    updateResultsCount();
    renderPagination();
}

function resetAllFilters() {
    searchInput.value = '';
    clearAllFilters();
}

// Funções de ação dos botões
async function agendarSessao(adestradorId) {
    // Verificar se usuário está logado
    const authRes = await fetch('/check-auth');
    const authData = await authRes.json();
    
    if (!authData.loggedIn) {
        window.location.href = '/Login.ejs';
        return;
    }
    
    const adestrador = adestradoresData.find(a => a.id === adestradorId);
    const whatsappNumber = adestrador.telefone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=Olá! Gostaria de agendar uma sessão de adestramento.`;
    
    if (confirm(`Entrar em contato com ${adestrador.nome}?\nTelefone: ${adestrador.telefone}\n\nClique OK para abrir WhatsApp`)) {
        window.open(whatsappUrl, '_blank');
    }
}

function verPerfil(adestradorId) {
    const adestrador = adestradoresData.find(a => a.id === adestradorId);
    
    // Simular redirecionamento para perfil do adestrador
    alert(`Visualizando perfil de ${adestrador.nome}...`);
    
    // Aqui você implementaria o redirecionamento real
    // window.location.href = `/perfil/${adestradorId}`;
}



// Dados adicionais dos adestradores (para completar as informações)
const adestradoresCompletos = {
    1: {
        nomeCompleto: "Ricardo Almeida Silva",
        endereco: "Rua das Flores, 123 - Vila Madalena",
        estado: "São Paulo",
        biografia: "Profissional apaixonado por cães com mais de 8 anos de experiência em adestramento. Formado em Medicina Veterinária com especialização em comportamento animal. Trabalho com métodos positivos e personalizados para cada pet, sempre respeitando o bem-estar animal e fortalecendo a relação entre tutor e cão.",
        especialidadesCompletas: ["Obediência Básica", "Socialização", "Caminhada sem Coleira"]
    },
    2: {
        nomeCompleto: "Juliana Costa Mendes",
        endereco: "Av. Copacabana, 456 - Copacabana",
        estado: "Rio de Janeiro",
        biografia: "Especialista em comportamento canino com 10 anos de experiência. Certificada pelo IBAC (Instituto Brasileiro de Adestramento de Cães). Dedico-me especialmente a casos de ansiedade, medo e comportamentos destrutivos, utilizando técnicas de reforço positivo e dessensibilização.",
        especialidadesCompletas: ["Problemas de Comportamento", "Ansiedade Canina", "Terapia Comportamental"]
    },
    3: {
        nomeCompleto: "Carlos Mendes Santos",
        endereco: "Rua da Liberdade, 789 - Centro",
        estado: "Minas Gerais",
        biografia: "Especialista em controle de agressividade canina com 12 anos de experiência. Trabalho com casos complexos de reabilitação comportamental, sempre priorizando a segurança de todos os envolvidos. Certificado pela ANAA (Associação Nacional de Adestradores de Animais).",
        especialidadesCompletas: ["Controle de Agressividade", "Reabilitação Comportamental", "Cães Dominantes"]
    },
    4: {
        nomeCompleto: "Ana Silva Rodrigues",
        endereco: "Rua XV de Novembro, 321 - Centro",
        estado: "Paraná",
        biografia: "Adestradora focada em truques e comandos avançados. Com 6 anos de experiência, transformo o treinamento em momentos divertidos e educativos. Especializada em preparação para competições e shows caninos.",
        especialidadesCompletas: ["Truques e Comandos", "Preparação para Shows", "Adestramento Lúdico"]
    },
    5: {
        nomeCompleto: "Pedro Santos Lima",
        endereco: "Av. Ipiranga, 654 - Cidade Baixa",
        estado: "Rio Grande do Sul",
        biografia: "Especialista em adestramento para filhotes com 9 anos de experiência. Trabalho com socialização precoce, educação básica e prevenção de problemas comportamentais futuros. Certificado em Psicologia Canina.",
        especialidadesCompletas: ["Adestramento para Filhotes", "Socialização Precoce", "Educação Básica"]
    },
    6: {
        nomeCompleto: "Mariana Lima Costa",
        endereco: "SHIS QI 15, Conjunto 3 - Lago Sul",
        estado: "Distrito Federal",
        biografia: "Especialista em socialização canina com 7 anos de experiência. Ajudo cães tímidos e medrosos a ganharem confiança e se relacionarem melhor com outros animais e pessoas. Utilizo técnicas de exposição gradual e reforço positivo.",
        especialidadesCompletas: ["Socialização Canina", "Cães Tímidos", "Integração Social"]
    },
    7: {
        nomeCompleto: "Lucas Ferreira Oliveira",
        endereco: "Rua da Barra, 987 - Barra",
        estado: "Bahia",
        biografia: "Especialista em treinamento de cães de guarda com 11 anos de experiência. Ex-militar com formação em segurança canina. Trabalho com desenvolvimento de instintos protetivos equilibrados e obediência em situações de stress.",
        especialidadesCompletas: ["Cães de Guarda", "Segurança Canina", "Treinamento Militar"]
    },
    8: {
        nomeCompleto: "Fernanda Rocha Silva",
        endereco: "Av. Beira Mar, 147 - Meireles",
        estado: "Ceará",
        biografia: "Adestradora com 5 anos de experiência em obediência básica e socialização. Formada em Zootecnia com pós-graduação em Comportamento Animal. Trabalho com métodos gentis e eficazes, sempre respeitando o ritmo de cada animal.",
        especialidadesCompletas: ["Obediência Básica", "Socialização", "Comandos Básicos"]
    }
};

// Função para mostrar o perfil do adestrador
function verPerfil(adestradorId) {
    const adestrador = adestradoresData.find(a => a.id === adestradorId);
    const dadosCompletos = adestradoresCompletos[adestradorId];
    
    if (!adestrador || !dadosCompletos) {
        alert('Perfil não encontrado!');
        return;
    }

    // Preencher dados do modal
    document.getElementById('profileImage').src = adestrador.imagem;
    document.getElementById('profileImage').alt = dadosCompletos.nomeCompleto;
    document.getElementById('profileName').textContent = dadosCompletos.nomeCompleto;
    document.getElementById('profileStars').innerHTML = generateStars(adestrador.rating);
    document.getElementById('profileReviews').textContent = `(${adestrador.reviews} avaliações)`;

    // Telefone parcial
    const telefoneCompleto = adestrador.telefone;
    const telefoneParcial = telefoneCompleto.substring(0, telefoneCompleto.length - 4) + '...';
    document.getElementById('phonePartial').textContent = telefoneParcial;

    // Outros dados
    document.getElementById('profileAddress').textContent = dadosCompletos.endereco;
    document.getElementById('profileCity').textContent = cidadesMap[adestrador.cidade];
    document.getElementById('profileState').textContent = dadosCompletos.estado;
    document.getElementById('profileExperience').textContent = `${adestrador.experiencia} anos`;
    document.getElementById('profilePrice').textContent = `R$ ${adestrador.preco}`;
    document.getElementById('profileBiography').textContent = dadosCompletos.biografia;

    // Especialidades
    const specialtiesContainer = document.getElementById('profileSpecialties');
    specialtiesContainer.innerHTML = '';
    dadosCompletos.especialidadesCompletas.forEach(especialidade => {
        const tag = document.createElement('span');
        tag.className = 'specialty-tag';
        tag.textContent = especialidade;
        specialtiesContainer.appendChild(tag);
    });

    // Badge
    const badgeElement = document.getElementById('profileBadge');
    const badgeTextElement = document.getElementById('badgeText');
    if (adestrador.badge) {
        badgeElement.style.display = 'flex';
        badgeTextElement.textContent = adestrador.badge;
    } else {
        badgeElement.style.display = 'none';
    }

    // Configurar botões
    setupModalButtons(adestrador);

    // Mostrar modal
    showModal();
}

// Função para configurar os botões do modal
function setupModalButtons(adestrador) {
    const seeMoreBtn = document.getElementById('seeMorePhone');
    const scheduleBtn = document.getElementById('scheduleSessionBtn');
 

    // Botão "Ver mais" do telefone
    seeMoreBtn.onclick = function() {
        // Redirecionar para página de cadastro
        window.location.href = '/cadastro-cliente';
    };

    // Botão agendar sessão
    scheduleBtn.onclick = async function() {
        // Verificar se usuário está logado
        const authRes = await fetch('/check-auth');
        const authData = await authRes.json();
        
        if (!authData.loggedIn) {
            window.location.href = '/Login.ejs';
            return;
        }
        
        const whatsappNumber = adestrador.telefone.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=Olá! Gostaria de agendar uma sessão de adestramento.`;
        
        if (confirm(`Entrar em contato com ${adestrador.nome}?\nTelefone: ${adestrador.telefone}\n\nClique OK para abrir WhatsApp`)) {
            window.open(whatsappUrl, '_blank');
        }
        hideModal();
    };


  
}

// Função para mostrar o modal
function showModal() {
    const modal = document.getElementById('trainerProfileModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Event listeners para fechar o modal
    document.getElementById('modalClose').onclick = hideModal;
    document.getElementById('modalOverlay').onclick = hideModal;

    // Fechar com ESC
    document.addEventListener('keydown', handleEscKey);
}

// Função para esconder o modal
function hideModal() {
    const modal = document.getElementById('trainerProfileModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    // Remover event listener do ESC
    document.removeEventListener('keydown', handleEscKey);
}

// Função para lidar com a tecla ESC
function handleEscKey(event) {
    if (event.key === 'Escape') {
        hideModal();
    }
}

// Função auxiliar para gerar estrelas (caso não exista)
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    // Estrelas completas
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star" style="color: #ffd700;"></i>';
    }
    
    // Meia estrela
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt" style="color: #ffd700;"></i>';
    }
    
    // Estrelas vazias
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star" style="color: #ffd700;"></i>';
    }
    
    return stars;
}

// Adicionar event listeners quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o modal já existe no DOM, senão adicionar
    if (!document.getElementById('trainerProfileModal')) {
        addModalToDOM();
    }
});

// Função para adicionar o modal ao DOM (caso não esteja no HTML)
function addModalToDOM() {
    const modalHTML = `
        <div class="trainer-profile-modal" id="trainerProfileModal">
            <div class="modal-overlay" id="modalOverlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Perfil do Adestrador</h2>
                    <button class="modal-close" id="modalClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="trainer-profile-card">
                        <div class="profile-image">
                            <img id="profileImage" src="" alt="Foto do Adestrador">
                            <div class="profile-badge" id="profileBadge" style="display: none;">
                                <i class="fas fa-medal"></i>
                                <span id="badgeText"></span>
                            </div>
                        </div>
                        
                        <div class="profile-info">
                            <div class="profile-section">
                                <h3 id="profileName">Nome do Adestrador</h3>
                                <div class="profile-rating">
                                    <div class="stars" id="profileStars"></div>
                                    <span id="profileReviews">(0 avaliações)</span>
                                </div>
                            </div>

                            <div class="profile-details">
                                <div class="detail-item">
                                    <i class="fas fa-phone"></i>
                                    <label>Telefone:</label>
                                    <span class="phone-number">
                                        <span id="phonePartial"></span>
                                        <button class="see-more-btn" id="seeMorePhone">Ver mais</button>
                                    </span>
                                </div>

                                <div class="detail-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <label>Endereço:</label>
                                    <span id="profileAddress"></span>
                                </div>

                                <div class="detail-item">
                                    <i class="fas fa-city"></i>
                                    <label>Cidade:</label>
                                    <span id="profileCity"></span>
                                </div>

                                <div class="detail-item">
                                    <i class="fas fa-map"></i>
                                    <label>Estado:</label>
                                    <span id="profileState"></span>
                                </div>

                                <div class="detail-item">
                                    <i class="fas fa-clock"></i>
                                    <label>Experiência:</label>
                                    <span id="profileExperience"></span>
                                </div>

                                <div class="detail-item">
                                    <i class="fas fa-certificate"></i>
                                    <label>Especialidades:</label>
                                    <div class="specialties-list" id="profileSpecialties"></div>
                                </div>

                                <div class="detail-item">
                                    <i class="fas fa-dollar-sign"></i>
                                    <label>Preço por Sessão:</label>
                                    <span class="price-highlight" id="profilePrice"></span>
                                </div>

                                <div class="detail-item biography-section">
                                    <i class="fas fa-user"></i>
                                    <label>Sobre:</label>
                                    <p id="profileBiography"></p>
                                </div>
                            </div>

                            <div class="profile-actions">
                                <button class="btn btn-primary" id="scheduleSessionBtn">
                                    <i class="fas fa-calendar-alt"></i>
                                    Agendar Sessão
                                </button>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// 3. Verificar se o modal existe quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar o modal ao DOM se não existir
    if (!document.getElementById('trainerProfileModal')) {
        addModalToDOM();
    }
    
    // Aguardar um pouco para garantir que tudo foi carregado
    setTimeout(() => {
        console.log('Sistema de perfil carregado!');
        
        // Verificar se existem adestradores carregados
        if (adestradoresData && adestradoresData.length > 0) {
            console.log(`${adestradoresData.length} adestradores disponíveis`);
        }
    }, 1000);
});

// 4. Dados adicionais dos adestradores (caso não estejam definidos)
if (typeof adestradoresCompletos === 'undefined') {
    const adestradoresCompletos = {
        1: {
            nomeCompleto: "Ricardo Almeida Silva",
            endereco: "Rua das Flores, 123 - Vila Madalena",
            estado: "São Paulo",
            biografia: "Profissional apaixonado por cães com mais de 8 anos de experiência em adestramento. Formado em Medicina Veterinária com especialização em comportamento animal. Trabalho com métodos positivos e personalizados para cada pet, sempre respeitando o bem-estar animal e fortalecendo a relação entre tutor e cão.",
            especialidadesCompletas: ["Obediência Básica", "Socialização", "Caminhada sem Coleira"]
        },
        2: {
            nomeCompleto: "Juliana Costa Mendes",
            endereco: "Av. Copacabana, 456 - Copacabana",
            estado: "Rio de Janeiro",
            biografia: "Especialista em comportamento canino com 10 anos de experiência. Certificada pelo IBAC (Instituto Brasileiro de Adestramento de Cães). Dedico-me especialmente a casos de ansiedade, medo e comportamentos destrutivos, utilizando técnicas de reforço positivo e dessensibilização.",
            especialidadesCompletas: ["Problemas de Comportamento", "Ansiedade Canina", "Terapia Comportamental"]
        },
        3: {
            nomeCompleto: "Carlos Mendes Santos",
            endereco: "Rua da Liberdade, 789 - Centro",
            estado: "Minas Gerais",
            biografia: "Especialista em controle de agressividade canina com 12 anos de experiência. Trabalho com casos complexos de reabilitação comportamental, sempre priorizando a segurança de todos os envolvidos. Certificado pela ANAA (Associação Nacional de Adestradores de Animais).",
            especialidadesCompletas: ["Controle de Agressividade", "Reabilitação Comportamental", "Cães Dominantes"]
        },
        4: {
            nomeCompleto: "Ana Silva Rodrigues",
            endereco: "Rua XV de Novembro, 321 - Centro",
            estado: "Paraná",
            biografia: "Adestradora focada em truques e comandos avançados. Com 6 anos de experiência, transformo o treinamento em momentos divertidos e educativos. Especializada em preparação para competições e shows caninos.",
            especialidadesCompletas: ["Truques e Comandos", "Preparação para Shows", "Adestramento Lúdico"]
        },
        5: {
            nomeCompleto: "Pedro Santos Lima",
            endereco: "Av. Ipiranga, 654 - Cidade Baixa",
            estado: "Rio Grande do Sul",
            biografia: "Especialista em adestramento para filhotes com 9 anos de experiência. Trabalho com socialização precoce, educação básica e prevenção de problemas comportamentais futuros. Certificado em Psicologia Canina.",
            especialidadesCompletas: ["Adestramento para Filhotes", "Socialização Precoce", "Educação Básica"]
        },
        6: {
            nomeCompleto: "Mariana Lima Costa",
            endereco: "SHIS QI 15, Conjunto 3 - Lago Sul",
            estado: "Distrito Federal",
            biografia: "Especialista em socialização canina com 7 anos de experiência. Ajudo cães tímidos e medrosos a ganharem confiança e se relacionarem melhor com outros animais e pessoas. Utilizo técnicas de exposição gradual e reforço positivo.",
            especialidadesCompletas: ["Socialização Canina", "Cães Tímidos", "Integração Social"]
        },
        7: {
            nomeCompleto: "Lucas Ferreira Oliveira",
            endereco: "Rua da Barra, 987 - Barra",
            estado: "Bahia",
            biografia: "Especialista em treinamento de cães de guarda com 11 anos de experiência. Ex-militar com formação em segurança canina. Trabalho com desenvolvimento de instintos protetivos equilibrados e obediência em situações de stress.",
            especialidadesCompletas: ["Cães de Guarda", "Segurança Canina", "Treinamento Militar"]
        },
        8: {
            nomeCompleto: "Fernanda Rocha Silva",
            endereco: "Av. Beira Mar, 147 - Meireles",
            estado: "Ceará",
            biografia: "Adestradora com 5 anos de experiência em obediência básica e socialização. Formada em Zootecnia com pós-graduação em Comportamento Animal. Trabalho com métodos gentis e eficazes, sempre respeitando o ritmo de cada animal.",
            especialidadesCompletas: ["Obediência Básica", "Socialização", "Comandos Básicos"]
        }
    };
}

