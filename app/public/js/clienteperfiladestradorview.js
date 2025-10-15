let trainers = [];
let trainersFake = [
    {
        id: 1,
        name: "Ricardo Almeida",
        city: "São Paulo",
        state: "SP",
        specialties: ["obediencia", "comportamento"],
        rating: 5.0,
        reviews: 57,
        price: 180,
        phone: "(11) 98765-4321",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
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
        phone: "(21) 97654-3210",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop"
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
        phone: "(31) 96543-2109",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
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
        phone: "(41) 95432-1098",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
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
        phone: "(51) 94321-0987",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
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
        phone: "(61) 93210-9876",
        image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop"
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
        phone: "(71) 92109-8765",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
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
        phone: "(85) 91098-7654",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop"
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
        phone: "(81) 90987-6543",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
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
        phone: "(92) 99876-5432",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop"
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
        phone: "(11) 98876-5432",
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop"
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
        phone: "(21) 97765-4321",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop"
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
        phone: "(62) 96654-3210",
        image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop"
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
        phone: "(91) 95543-2109",
        image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop"
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
        phone: "(98) 94432-1098",
        image: "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=400&h=400&fit=crop"
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
        phone: "(84) 93321-0987",
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop"
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
        phone: "(48) 92210-9876",
        image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=400&fit=crop"
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
        phone: "(27) 91109-8765",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop"
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
        phone: "(67) 99998-7654",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop"
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
        phone: "(83) 98887-6543",
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop"
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
        phone: "(86) 97776-5432",
        image: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=400&h=400&fit=crop"
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
        phone: "(82) 96665-4321",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop"
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
        phone: "(79) 95554-3210",
        image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&fit=crop"
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
        phone: "(65) 94443-2109",
        image: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?w=400&h=400&fit=crop"
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
        phone: "(11) 93332-1098",
        image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop"
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
        phone: "(21) 92221-0987",
        image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop"
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
        phone: "(31) 91110-9876",
        image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop"
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
        phone: "(69) 99009-8765",
        image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=400&h=400&fit=crop"
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
        phone: "(95) 98898-7654",
        image: "https://images.unsplash.com/photo-1509305717900-84f40e786d82?w=400&h=400&fit=crop"
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
        phone: "(63) 97787-6543",
        image: "https://images.unsplash.com/photo-1507114845806-0bf8f8f0e3f0?w=400&h=400&fit=crop"
    }
];

async function loadTrainer(id) {
    try {
        const response = await fetch(`/api/adestrador/${id}`);
        if (response.ok) {
            const data = await response.json();
            const especialidadeMap = {
                1: 'obediencia',
                2: 'comportamento',
                3: 'truques',
                4: 'agressividade',
                5: 'filhotes'
            };
            return {
                id: id,
                name: data.nome,
                city: data.cidade || 'Não informado',
                state: data.estado || 'SP',
                specialties: [especialidadeMap[data.especialidade] || 'obediencia'],
                rating: data.avaliacao || 5.0,
                reviews: data.total_avaliacoes || 0,
                price: parseFloat(data.preco) || 150,
                phone: data.telefone || 'Não informado',
                image: data.ID_PERFIL && data.ID_PERFIL > 0 ? `/imagem/${data.ID_PERFIL}` : 'https://via.placeholder.com/400'
            };
        }
        return null;
    } catch (error) {
        console.error('Erro ao carregar adestrador:', error);
        return null;
    }
}

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

const urlParams = new URLSearchParams(window.location.search);
const trainerId = parseInt(urlParams.get('id'));

async function displayTrainer() {
    console.log('Carregando adestrador ID:', trainerId);
    let trainer = null;
    
    if (!trainerId || isNaN(trainerId)) {
        console.error('ID inválido:', trainerId);
        alert('ID do adestrador inválido');
        window.location.href = '/buscaradestradorcliente.ejs';
        return;
    }
    
    // Tentar carregar do banco primeiro
    trainer = await loadTrainer(trainerId);
    console.log('Resultado do banco:', trainer);
    
    // Se não encontrou, busca nos fictícios
    if (!trainer) {
        console.log('Buscando nos fictícios...');
        trainer = trainersFake.find(t => t.id === trainerId);
        console.log('Resultado fictício:', trainer);
    }
    
    if (!trainer) {
        console.error('Adestrador não encontrado');
        alert('Adestrador não encontrado');
        window.location.href = '/buscaradestradorcliente.ejs';
        return;
    }
    
    const especialidadeMap = {
        1: 'obediencia',
        2: 'comportamento',
        3: 'truques',
        4: 'agressividade',
        5: 'filhotes'
    };
    
    if (typeof trainer.specialties[0] === 'number') {
        trainer.specialties = [especialidadeMap[trainer.specialties[0]] || 'obediencia'];
    }
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
    
    document.getElementById('trainerImage').src = trainer.image;
    document.getElementById('trainerName').textContent = trainer.name;
    document.getElementById('trainerLocation').textContent = `${trainer.city}, ${trainer.state}`;
    document.getElementById('trainerStars').innerHTML = generateStars(trainer.rating);
    document.getElementById('trainerRating').textContent = `${trainer.rating.toFixed(1)} (${trainer.reviews} avaliações)`;
    document.getElementById('trainerPrice').textContent = `R$ ${trainer.price},00`;
    document.getElementById('trainerPhone').textContent = trainer.phone;
    
    const specialtiesHTML = trainer.specialties
        .map(spec => `<span class="specialty-tag">${specNames[spec]}</span>`)
        .join('');
    document.getElementById('trainerSpecialties').innerHTML = specialtiesHTML;
}

displayTrainer();

document.getElementById('btnMessage').addEventListener('click', () => {
    if (trainerId) {
        window.location.href = `/mensagenscliente.ejs?adestrador=${trainerId}`;
    }
});
