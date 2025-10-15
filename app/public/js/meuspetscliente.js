let editingPetId = null;
const petsGrid = document.getElementById('petsGrid');
const btnAddPet = document.getElementById('btnAddPet');
const petModal = document.getElementById('petModal');
const closeModal = document.getElementById('closeModal');
const btnCancel = document.getElementById('btnCancel');
const petForm = document.getElementById('petForm');
const uploadArea = document.getElementById('uploadArea');
const petFoto = document.getElementById('petFoto');
const previewImage = document.getElementById('previewImage');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const modalTitle = document.getElementById('modalTitle');
let currentImageUrl = null;

function renderPets(pets) {
    const addCard = petsGrid.querySelector('.add-pet-card');
    petsGrid.innerHTML = '';
    petsGrid.appendChild(addCard);

    pets.forEach(pet => {
        const petCard = document.createElement('article');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
            <figure class="pet-photo">
                <i class="fas fa-dog" style="font-size: 80px; color: #FFA500; display: flex; align-items: center; justify-content: center; height: 100%;"></i>
            </figure>
            <section class="pet-info">
                <h3>${pet.NOME_PET}</h3>
                <section class="pet-details">
                    <span class="pet-detail">
                        <i class="fas fa-paw"></i>
                        ${pet.RACA_PET || 'Não informado'}
                    </span>
                    ${pet.IDADE_PET ? `
                    <span class="pet-detail">
                        <i class="fas fa-calendar"></i>
                        ${pet.IDADE_PET}
                    </span>
                    ` : ''}
                    ${pet.SEXO_PET ? `
                    <span class="pet-detail">
                        <i class="fas fa-venus-mars"></i>
                        ${pet.SEXO_PET === 'macho' ? 'Macho' : 'Fêmea'}
                    </span>
                    ` : ''}
                </section>
                ${pet.PROBLEMA_COMPORTAMENTO ? `
                    <section class="pet-problema">
                        <h4><i class="fas fa-exclamation-circle"></i> Problema de Comportamento</h4>
                        <p>${pet.PROBLEMA_COMPORTAMENTO}</p>
                    </section>
                ` : ''}
                <section class="pet-actions">
                    <button class="btn-edit" onclick="editPetDB(${pet.ID_PET})">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn-delete" onclick="deletePetDB(${pet.ID_PET})">
                        <i class="fas fa-trash"></i>
                        Excluir
                    </button>
                </section>
            </section>
        `;
        petsGrid.appendChild(petCard);
    });
}

function openModal() {
    editingPetId = null;
    modalTitle.textContent = 'Adicionar Pet';
    petForm.reset();
    previewImage.innerHTML = '<i class="fas fa-dog"></i>';
    currentImageUrl = null;
    petModal.classList.add('active');
}

function closeModalFunc() {
    petModal.classList.remove('active');
    editingPetId = null;
    currentImageUrl = null;
}

async function editPetDB(id) {
    try {
        const response = await fetch(`/pets/${id}`);
        const pet = await response.json();
        
        editingPetId = id;
        modalTitle.textContent = 'Editar Pet';
        
        document.getElementById('petNome').value = pet.NOME_PET;
        document.getElementById('petRaca').value = pet.RACA_PET || '';
        
        let idade = pet.IDADE_PET || '';
        if (idade) {
            idade = idade.toString().replace(' anos', '').replace('anos', '').trim();
        }
        document.getElementById('petIdade').value = idade;
        
        const sexo = pet.SEXO_PET ? pet.SEXO_PET.toLowerCase() : '';
        document.getElementById('petSexo').value = sexo;
        document.getElementById('petProblema').value = pet.PROBLEMA_COMPORTAMENTO || '';
        document.getElementById('petObservacoes').value = pet.OBSERVACOES || '';
        
        petModal.classList.add('active');
    } catch (error) {
        console.error('Erro ao carregar pet:', error);
        alert('Erro ao carregar dados do pet');
    }
}

async function deletePetDB(id) {
    if (confirm('Tem certeza que deseja excluir este pet?')) {
        try {
            const response = await fetch(`/pets/${id}`, { method: 'DELETE' });
            const result = await response.json();
            
            if (result.sucesso) {
                location.reload();
            } else {
                alert('Erro ao excluir pet');
            }
        } catch (error) {
            console.error('Erro ao excluir pet:', error);
            alert('Erro ao excluir pet');
        }
    }
}

uploadArea.addEventListener('click', () => {
    petFoto.click();
});

petFoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            currentImageUrl = e.target.result;
            previewImage.innerHTML = `<img src="${currentImageUrl}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

petForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const idade = document.getElementById('petIdade').value;
    const sexo = document.getElementById('petSexo').value;
    const petData = {
        nomePet: document.getElementById('petNome').value,
        racaPet: document.getElementById('petRaca').value,
        idadePet: idade ? idade + ' anos' : null,
        sexoPet: sexo || null,
        problemaComportamento: document.getElementById('petProblema').value || null,
        observacoes: document.getElementById('petObservacoes').value || null
    };
    
    try {
        let response;
        if (editingPetId) {
            response = await fetch(`/pets/${editingPetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(petData)
            });
        } else {
            response = await fetch('/pets/criar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(petData)
            });
        }
        
        const result = await response.json();
        
        if (result.sucesso) {
            location.reload();
        } else {
            alert('Erro ao salvar pet');
        }
    } catch (error) {
        console.error('Erro ao salvar pet:', error);
        alert('Erro ao salvar pet');
    }
});

btnAddPet.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunc);
btnCancel.addEventListener('click', closeModalFunc);

petModal.addEventListener('click', (e) => {
    if (e.target === petModal) {
        closeModalFunc();
    }
});

mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

window.editPetDB = editPetDB;
window.deletePetDB = deletePetDB;
