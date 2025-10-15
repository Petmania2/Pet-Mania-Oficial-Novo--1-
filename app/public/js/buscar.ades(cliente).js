// Dados dos Adestradores - carregados do banco
let trainers = [];

// Carregar adestradores do banco
async function loadTrainers() {
    try {
        const response = await fetch('/api/adestradores');
        const data = await response.json();
        const especialidadeMap = {
            1: 'obediencia',
            2: 'comportamento',
            3: 'truques',
            4: 'agressividade',
            5: 'filhotes'
        };
        
        const trainersDB = data.map(a => ({
            id: a.id + 1000,
            name: a.nome,
            city: a.cidade || 'Não informado',
            state: a.estado || 'SP',
            specialties: [especialidadeMap[a.especialidade] || 'obediencia'],
            rating: a.avaliacao || 5.0,
            reviews: a.total_avaliacoes || 0,
            price: parseFloat(a.preco) || 150,
            available: a.ativo !== false,
            image: a.ID_PERFIL && a.ID_PERFIL > 0 ? `/imagem/${a.ID_PERFIL}` : 'https://via.placeholder.com/400',
            topTrainer: a.anos_experiencia >= 5,
            phone: a.telefone,
            about: a.sobre
        }));
        console.log('Adestradores carregados:', trainersDB);
        trainers = [...trainersDB, ...trainersFake];
        filteredTrainers = [...trainers];
        sortTrainers();
        renderTrainers(filteredTrainers);
    } catch (error) {
        console.error('Erro ao carregar adestradores:', error);
        trainers = [...trainersFake];
        filteredTrainers = [...trainers];
        sortTrainers();
        renderTrainers(filteredTrainers);
    }
}

const trainersFake = [
    {
        id: 1,
        name: "Ricardo Almeida",
        city: "São Paulo",
        state: "SP",
        specialties: ["obediencia", "comportamento"],
        rating: 5.0,
        reviews: 57,
        price: 180,
        available: true,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        topTrainer: true
    },
    {
        id: 2,
        name: "Juliana Costa",
        city: "Rio de Janeiro",
        state: "RJ",
        specialties: ["socializacao", "filhotes"],
        rating: 4.9,
        reviews: 43,
        price: 150,
        available: true,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 3,
        name: "Carlos Mendes",
        city: "Belo Horizonte",
        state: "MG",
        specialties: ["agressividade", "terapia"],
        rating: 4.8,
        reviews: 38,
        price: 200,
        available: false,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        topTrainer: true
    },
    {
        id: 4,
        name: "Ana Silva",
        city: "Curitiba",
        state: "PR",
        specialties: ["truques", "comandos"],
        rating: 4.7,
        reviews: 31,
        price: 140,
        available: true,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 5,
        name: "Fernando Santos",
        city: "Porto Alegre",
        state: "RS",
        specialties: ["obediencia", "socializacao"],
        rating: 4.9,
        reviews: 52,
        price: 170,
        available: true,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        topTrainer: true
    },
    {
        id: 6,
        name: "Patricia Lima",
        city: "Brasília",
        state: "DF",
        specialties: ["filhotes", "comportamento"],
        rating: 4.6,
        reviews: 28,
        price: 160,
        available: false,
        image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 7,
        name: "Roberto Ferreira",
        city: "Salvador",
        state: "BA",
        specialties: ["agressividade", "obediencia"],
        rating: 4.8,
        reviews: 45,
        price: 175,
        available: true,
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 8,
        name: "Mariana Oliveira",
        city: "Fortaleza",
        state: "CE",
        specialties: ["socializacao", "truques"],
        rating: 4.7,
        reviews: 35,
        price: 145,
        available: true,
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 9,
        name: "Lucas Rodrigues",
        city: "Recife",
        state: "PE",
        specialties: ["comportamento", "terapia"],
        rating: 4.9,
        reviews: 48,
        price: 190,
        available: false,
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
        topTrainer: true
    },
    {
        id: 10,
        name: "Camila Souza",
        city: "Manaus",
        state: "AM",
        specialties: ["filhotes", "comandos"],
        rating: 4.5,
        reviews: 22,
        price: 135,
        available: true,
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 11,
        name: "Thiago Araújo",
        city: "São Paulo",
        state: "SP",
        specialties: ["obediencia", "truques"],
        rating: 4.8,
        reviews: 41,
        price: 165,
        available: true,
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 12,
        name: "Gabriela Martins",
        city: "Rio de Janeiro",
        state: "RJ",
        specialties: ["agressividade", "comportamento"],
        rating: 4.9,
        reviews: 55,
        price: 195,
        available: true,
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
        topTrainer: true
    },
    {
        id: 13,
        name: "Daniel Costa",
        city: "Goiânia",
        state: "GO",
        specialties: ["socializacao", "filhotes"],
        rating: 4.6,
        reviews: 29,
        price: 150,
        available: false,
        image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 14,
        name: "Renata Alves",
        city: "Belém",
        state: "PA",
        specialties: ["terapia", "comportamento"],
        rating: 4.7,
        reviews: 33,
        price: 155,
        available: true,
        image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 15,
        name: "Marcelo Pereira",
        city: "São Luís",
        state: "MA",
        specialties: ["comandos", "obediencia"],
        rating: 4.8,
        reviews: 37,
        price: 170,
        available: true,
        image: "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 16,
        name: "Beatriz Ribeiro",
        city: "Natal",
        state: "RN",
        specialties: ["filhotes", "socializacao"],
        rating: 4.5,
        reviews: 25,
        price: 140,
        available: true,
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 17,
        name: "Rafael Silva",
        city: "Florianópolis",
        state: "SC",
        specialties: ["truques", "comportamento"],
        rating: 4.9,
        reviews: 50,
        price: 185,
        available: true,
        image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=400&fit=crop",
        topTrainer: true
    },
    {
        id: 18,
        name: "Amanda Carvalho",
        city: "Vitória",
        state: "ES",
        specialties: ["agressividade", "terapia"],
        rating: 4.7,
        reviews: 36,
        price: 180,
        available: false,
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 19,
        name: "Bruno Nascimento",
        city: "Campo Grande",
        state: "MS",
        specialties: ["obediencia", "comandos"],
        rating: 4.6,
        reviews: 27,
        price: 145,
        available: true,
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 20,
        name: "Larissa Gomes",
        city: "João Pessoa",
        state: "PB",
        specialties: ["socializacao", "filhotes"],
        rating: 4.8,
        reviews: 42,
        price: 160,
        available: true,
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 21,
        name: "Eduardo Santos",
        city: "Teresina",
        state: "PI",
        specialties: ["comportamento", "terapia"],
        rating: 4.7,
        reviews: 30,
        price: 155,
        available: true,
        image: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 22,
        name: "Fernanda Lima",
        city: "Maceió",
        state: "AL",
        specialties: ["truques", "comandos"],
        rating: 4.6,
        reviews: 24,
        price: 140,
        available: false,
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 23,
        name: "Paulo Henrique",
        city: "Aracaju",
        state: "SE",
        specialties: ["obediencia", "socializacao"],
        rating: 4.8,
        reviews: 39,
        price: 165,
        available: true,
        image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 24,
        name: "Juliane Rocha",
        city: "Cuiabá",
        state: "MT",
        specialties: ["filhotes", "comportamento"],
        rating: 4.7,
        reviews: 32,
        price: 150,
        available: true,
        image: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 25,
        name: "André Moreira",
        city: "São Paulo",
        state: "SP",
        specialties: ["agressividade", "terapia"],
        rating: 4.9,
        reviews: 53,
        price: 200,
        available: true,
        image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop",
        topTrainer: true
    },
    {
        id: 26,
        name: "Bianca Teixeira",
        city: "Rio de Janeiro",
        state: "RJ",
        specialties: ["truques", "comandos"],
        rating: 4.6,
        reviews: 26,
        price: 145,
        available: false,
        image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 27,
        name: "Rodrigo Fernandes",
        city: "Belo Horizonte",
        state: "MG",
        specialties: ["obediencia", "socializacao"],
        rating: 4.8,
        reviews: 44,
        price: 175,
        available: true,
        image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 28,
        name: "Vanessa Dias",
        city: "Porto Velho",
        state: "RO",
        specialties: ["filhotes", "comportamento"],
        rating: 4.5,
        reviews: 21,
        price: 135,
        available: true,
        image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 29,
        name: "Guilherme Barros",
        city: "Boa Vista",
        state: "RR",
        specialties: ["terapia", "agressividade"],
        rating: 4.7,
        reviews: 34,
        price: 160,
        available: true,
        image: "https://images.unsplash.com/photo-1509305717900-84f40e786d82?w=400&h=400&fit=crop",
        topTrainer: false
    },
    {
        id: 30,
        name: "Carolina Mendes",
        city: "Palmas",
        state: "TO",
        specialties: ["comandos", "truques"],
        rating: 4.6,
        reviews: 28,
        price: 150,
        available: true,
        image: "https://images.unsplash.com/photo-1507114845806-0bf8f8f0e3f0?w=400&h=400&fit=crop",
        topTrainer: false
    }
];

// Estado da aplicação
let filteredTrainers = [];

// Elementos DOM
const trainersGrid = document.getElementById('trainersGrid');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');
const filtersForm = document.getElementById('filtersForm');
const searchInput = document.getElementById('searchInput');
const specialtySelect = document.getElementById('specialtySelect');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const priceRange = document.getElementById('priceRange');
const ratingSelect = document.getElementById('ratingSelect');
const availableNow = document.getElementById('availableNow');
const sortSelect = document.getElementById('sortSelect');
const clearFiltersBtn = document.getElementById('clearFilters');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const mobileFilterBtn = document.getElementById('mobileFilterBtn');
const filtersPanel = document.getElementById('filtersPanel');
const filterToggle = document.getElementById('filterToggle');

// Função para gerar estrelas
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Função para renderizar os cards dos adestradores
function renderTrainers(trainersToRender) {
    trainersGrid.innerHTML = '';
    
    if (trainersToRender.length === 0) {
        trainersGrid.style.display = 'none';
        noResults.style.display = 'block';
        resultsCount.textContent = 'Nenhum adestrador encontrado';
        return;
    }
    
    trainersGrid.style.display = 'grid';
    noResults.style.display = 'none';
    resultsCount.textContent = `${trainersToRender.length} ${trainersToRender.length === 1 ? 'adestrador encontrado' : 'adestradores encontrados'}`;
    
    trainersToRender.forEach(trainer => {
        const card = document.createElement('article');
        card.className = 'trainer-card';
        
        const specialtiesHTML = trainer.specialties
            .map(spec => {
                const specNames = {
                    obediencia: 'Obediência',
                    comportamento: 'Comportamento',
                    socializacao: 'Socialização',
                    filhotes: 'Filhotes',
                    agressividade: 'Agressividade',
                    terapia: 'Terapia',
                    truques: 'Truques',
                    comandos: 'Comandos'
                };
                return `<span class="specialty-tag">${specNames[spec]}</span>`;
            })
            .join('');
        
        card.innerHTML = `
            <figure class="trainer-image">
                <img src="${trainer.image}" alt="${trainer.name}" loading="lazy">
                ${trainer.available ? '<span class="available-badge"><i class="fas fa-circle"></i> Disponível</span>' : ''}
                ${trainer.topTrainer ? '<span class="top-badge"><i class="fas fa-medal"></i> Top</span>' : ''}
            </figure>
            <section class="trainer-info">
                <h3 class="trainer-name">${trainer.name}</h3>
                <p class="trainer-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${trainer.city}, ${trainer.state}
                </p>
                <section class="trainer-specialties">
                    ${specialtiesHTML}
                </section>
                <section class="trainer-rating">
                    <section class="stars">
                        ${generateStars(trainer.rating)}
                    </section>
                    <span class="rating-text">${trainer.rating.toFixed(1)} (${trainer.reviews} avaliações)</span>
                </section>
                <p class="trainer-price">
                    A partir de <span class="price-amount">R$ ${trainer.price}</span> / sessão
                </p>
                <button class="btn-view-profile" data-trainer-id="${trainer.id}">Ver Perfil</button>
            </section>
        `;
        
        trainersGrid.appendChild(card);
    });
}

// Função para filtrar adestradores
function filterTrainers() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const specialty = specialtySelect.value;
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || 500;
    const minRating = parseFloat(ratingSelect.value) || 0;
    const onlyAvailable = availableNow.checked;
    
    filteredTrainers = trainers.filter(trainer => {
        // Filtro de busca (nome ou cidade)
        const matchesSearch = !searchTerm || 
            trainer.name.toLowerCase().includes(searchTerm) ||
            trainer.city.toLowerCase().includes(searchTerm);
        
        // Filtro de especialidade
        const matchesSpecialty = !specialty || trainer.specialties.includes(specialty);
        
        // Filtro de preço
        const matchesPrice = trainer.price >= minPrice && trainer.price <= maxPrice;
        
        // Filtro de avaliação
        const matchesRating = trainer.rating >= minRating;
        
        // Filtro de disponibilidade
        const matchesAvailability = !onlyAvailable || trainer.available;
        
        return matchesSearch && matchesSpecialty && matchesPrice && matchesRating && matchesAvailability;
    });
    
    sortTrainers();
    renderTrainers(filteredTrainers);
}

// Função para ordenar adestradores
function sortTrainers() {
    const sortBy = sortSelect.value;
    
    switch (sortBy) {
        case 'rating':
            filteredTrainers.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
            break;
        case 'price-asc':
            filteredTrainers.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredTrainers.sort((a, b) => b.price - a.price);
            break;
        case 'distance':
            // Simulando ordenação por distância (aleatória para exemplo)
            filteredTrainers.sort(() => Math.random() - 0.5);
            break;
        case 'relevance':
        default:
            // Ordenação padrão: Top trainers primeiro, depois por avaliação
            filteredTrainers.sort((a, b) => {
                if (a.topTrainer && !b.topTrainer) return -1;
                if (!a.topTrainer && b.topTrainer) return 1;
                return b.rating - a.rating;
            });
            break;
    }
}

// Event Listeners - Prevenir submit do formulário
filtersForm.addEventListener('submit', (e) => {
    e.preventDefault();
});



searchInput.addEventListener('input', () => {
    filterTrainers();
});

specialtySelect.addEventListener('change', () => {
    filterTrainers();
});

minPriceInput.addEventListener('input', () => {
    filterTrainers();
});

maxPriceInput.addEventListener('input', () => {
    priceRange.value = maxPriceInput.value;
    filterTrainers();
});

priceRange.addEventListener('input', () => {
    maxPriceInput.value = priceRange.value;
    filterTrainers();
});

ratingSelect.addEventListener('change', () => {
    filterTrainers();
});

availableNow.addEventListener('change', () => {
    filterTrainers();
});

sortSelect.addEventListener('change', () => {
    sortTrainers();
    renderTrainers(filteredTrainers);
});

clearFiltersBtn.addEventListener('click', () => {
    filtersForm.reset();
    minPriceInput.value = 0;
    maxPriceInput.value = 500;
    priceRange.value = 500;
    filteredTrainers = [...trainers];
    sortTrainers();
    renderTrainers(filteredTrainers);
});

// Mobile menu toggle
mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Mobile filter panel toggle
mobileFilterBtn.addEventListener('click', () => {
    filtersPanel.classList.add('active');
});

filterToggle.addEventListener('click', () => {
    filtersPanel.classList.remove('active');
});

// Fechar painel de filtros ao clicar fora (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && 
        filtersPanel.classList.contains('active') &&
        !filtersPanel.contains(e.target) &&
        !mobileFilterBtn.contains(e.target)) {
        filtersPanel.classList.remove('active');
    }
    
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('active');
    }
    
    if (e.target.classList.contains('btn-view-profile')) {
        const trainerId = parseInt(e.target.getAttribute('data-trainer-id'));
        openModalPerfil(trainerId);
    }
});

// Modal Perfil
const modalPerfil = document.getElementById('modalPerfil');
const closeModalPerfil = document.getElementById('closeModalPerfil');
const btnModalMessage = document.getElementById('btnModalMessage');

function openModalPerfil(trainerId) {
    const trainer = trainers.find(t => t.id === trainerId);
    if (!trainer) return;
    
    currentTrainerId = trainerId;
    
    const specNames = {
        obediencia: 'Obediência',
        comportamento: 'Comportamento',
        socializacao: 'Socialização',
        filhotes: 'Filhotes',
        agressividade: 'Agressividade',
        terapia: 'Terapia',
        truques: 'Truques',
        comandos: 'Comandos'
    };
    
    document.getElementById('modalTrainerImage').src = trainer.image;
    document.getElementById('modalTrainerName').textContent = trainer.name;
    document.getElementById('modalTrainerLocation').textContent = `${trainer.city}, ${trainer.state}`;
    document.getElementById('modalTrainerStars').innerHTML = generateStars(trainer.rating);
    document.getElementById('modalTrainerRating').textContent = `${trainer.rating.toFixed(1)} (${trainer.reviews} avaliações)`;
    document.getElementById('modalTrainerPrice').textContent = `R$ ${trainer.price},00 por sessão`;
    
    const specialtiesHTML = trainer.specialties
        .map(spec => `<span class="specialty-tag">${specNames[spec]}</span>`)
        .join('');
    document.getElementById('modalTrainerSpecialties').innerHTML = specialtiesHTML;
    
    modalPerfil.classList.add('active');
}

function closeModal() {
    modalPerfil.classList.remove('active');
}

closeModalPerfil.addEventListener('click', closeModal);

modalPerfil.addEventListener('click', (e) => {
    if (e.target === modalPerfil) {
        closeModal();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-view-profile')) {
        const trainerId = parseInt(e.target.getAttribute('data-trainer-id'));
        openModalPerfil(trainerId);
    }
});

const btnModalViewFull = document.getElementById('btnModalViewFull');
let currentTrainerId = null;

btnModalMessage.addEventListener('click', () => {
    if (currentTrainerId) {
        window.location.href = `/mensagenscliente.ejs?adestrador=${currentTrainerId}`;
    }
});

btnModalViewFull.addEventListener('click', () => {
    if (currentTrainerId) {
        window.location.href = `/clienteperfiladestradorview.ejs?id=${currentTrainerId}`;
    }
});

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    loadTrainers();
});