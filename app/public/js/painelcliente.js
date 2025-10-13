// Modal Functions
function openAddPetModal() {
    document.getElementById('addPetModal').classList.add('show');
}

function closeAddPetModal() {
    document.getElementById('addPetModal').classList.remove('show');
}

function showModal(type) {
    const modal = document.getElementById('genericModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    switch(type) {
        case 'sessions':
            title.textContent = 'Minhas Sessões';
            body.innerHTML = '<p>Aqui você pode visualizar e gerenciar suas sessões de adestramento.</p><p>Em breve, novas funcionalidades!</p>';
            break;

        case 'security':
            title.textContent = 'Segurança';
            body.innerHTML = `
                <div class="form-group">
                    <input type="password" class="form-input" placeholder="Nova senha" id="newPassword">
                </div>
                <button class="btn-primary" onclick="changePassword()">
                    <i class="fas fa-lock"></i> Alterar Senha
                </button>
            `;
            break;
    }
    modal.classList.add('show');
}

function closeGenericModal() {
    document.getElementById('genericModal').classList.remove('show');
}

function changePassword() {
    const password = document.getElementById('newPassword').value;
    if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres');
        return;
    }
    showNotification('Senha alterada com sucesso!');
    closeGenericModal();
}

// Add Pet Form
document.addEventListener('DOMContentLoaded', function() {
    const addPetForm = document.getElementById('addPetForm');
    if (addPetForm) {
        addPetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('petName').value;
            const species = document.getElementById('petSpecies').value;
            const breed = document.getElementById('petBreed').value;
            const age = document.getElementById('petAge').value;
            const weight = document.getElementById('petWeight').value;
            
            // Simulate adding pet
            const petsList = document.querySelector('.pets-list');
            const emoji = species === 'dog' ? '🐕' : species === 'cat' ? '🐱' : species === 'bird' ? '🐦' : '🐾';
            
            const newPetItem = document.createElement('div');
            newPetItem.className = 'pet-item';
            newPetItem.innerHTML = `
                <div class="pet-info">
                    <span class="pet-emoji">${emoji}</span>
                    <div class="pet-details">
                        <h4>${name}</h4>
                        <small>${breed} • ${age} anos</small>
                    </div>
                </div>
            `;
            
            petsList.appendChild(newPetItem);
            closeAddPetModal();
            showNotification('Pet adicionado com sucesso!');
            this.reset();
        });
    }
});

// Notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    document.getElementById('notificationText').textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Logout Function
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        fetch('/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                window.location.href = '/';
            } else {
                alert('Erro ao fazer logout');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            window.location.href = '/';
        });
    }
}

// Close modals on outside click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});