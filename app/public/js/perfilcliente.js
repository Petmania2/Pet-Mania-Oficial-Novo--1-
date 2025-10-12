// perfilcliente.js - Funções JS extraídas do CSS

document.addEventListener('DOMContentLoaded', function() {
    // Gerenciamento das tabs do perfil
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.profile-tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            const targetTab = document.getElementById(`${tabId}-tab`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // Função para exibir notificação de salvamento
    function showSaveNotification() {
        const notification = document.createElement('section');
        notification.className = 'save-notification';
        notification.innerHTML = '<i class="fas fa-check-circle"></i> Alterações salvas com sucesso!';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Evento de salvar alterações
    const saveButtons = document.querySelectorAll('.btn-save');
    saveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const originalText = button.innerHTML;
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = originalText;
                showSaveNotification();
            }, 1000);
        });
    });

    // Toggle de autenticação de dois fatores
    const twoFactorToggle = document.getElementById('two-factor');
    const toggleLabel = twoFactorToggle?.parentElement.parentElement.querySelector('.toggle-label');
    if (twoFactorToggle && toggleLabel) {
        twoFactorToggle.addEventListener('change', function() {
            if (this.checked) {
                toggleLabel.textContent = 'Ativado';
                setTimeout(() => {
                    alert('Esta é uma simulação da configuração da autenticação de dois fatores. Em um sistema real, aqui seria exibido um QR code ou enviado um código de verificação para o seu celular.');
                }, 500);
            } else {
                toggleLabel.textContent = 'Desativado';
            }
        });
    }

    // Validação da força da senha
    const newPasswordInput = document.getElementById('new-password');
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');
    if (newPasswordInput && strengthSegments.length > 0 && strengthText) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            if (password.length > 0) strength++;
            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            strength = Math.min(strength, 4);
            strengthSegments.forEach((segment, index) => {
                segment.style.backgroundColor = index < strength ? getStrengthColor(strength) : '#ddd';
            });
            strengthText.textContent = getStrengthText(strength);
            strengthText.style.color = getStrengthColor(strength);
        });
    }
    function getStrengthColor(strength) {
        switch(strength) {
            case 0: return '#ddd';
            case 1: return '#ff4d4d';
            case 2: return '#ffa64d';
            case 3: return '#ffff4d';
            case 4: return '#4CAF50';
            default: return '#ddd';
        }
    }
    function getStrengthText(strength) {
        switch(strength) {
            case 0: return 'Digite uma nova senha';
            case 1: return 'Muito fraca';
            case 2: return 'Fraca';
            case 3: return 'Média';
            case 4: return 'Forte';
            default: return 'Digite uma nova senha';
        }
    }

    // Gerenciamento de pets
    const addPetBtn = document.querySelector('.add-pet-card');
    const petsGrid = document.querySelector('.pets-grid');
    if (addPetBtn && petsGrid) {
        addPetBtn.addEventListener('click', function() {
            const modal = document.createElement('section');
            modal.className = 'modal';
            modal.innerHTML = `
                <section class="modal-content">
                    <header class="modal-header">
                        <h3>Adicionar Novo Pet</h3>
                        <button class="btn-close">&times;</button>
                    </header>
                    <section class="modal-body">
                        <form id="new-pet-form">
                            <section class="form-group">
                                <label for="pet-name">Nome do Pet</label>
                                <input type="text" id="pet-name" required>
                            </section>
                            <section class="form-group">
                                <label for="pet-species">Espécie</label>
                                <select id="pet-species" required>
                                    <option value="">Selecione...</option>
                                    <option value="dog">Cão</option>
                                    <option value="cat">Gato</option>
                                    <option value="bird">Pássaro</option>
                                    <option value="other">Outro</option>
                                </select>
                            </section>
                            <section class="form-group">
                                <label for="pet-breed">Raça</label>
                                <input type="text" id="pet-breed" required>
                            </section>
                            <section class="form-row">
                                <section class="form-group">
                                    <label for="pet-age">Idade</label>
                                    <input type="number" id="pet-age" min="0" required>
                                </section>
                                <section class="form-group">
                                    <label for="pet-weight">Peso (kg)</label>
                                    <input type="number" id="pet-weight" min="0" step="0.1" required>
                                </section>
                            </section>
                            <section class="form-group">
                                <label for="pet-gender">Sexo</label>
                                <select id="pet-gender" required>
                                    <option value="">Selecione...</option>
                                    <option value="male">Macho</option>
                                    <option value="female">Fêmea</option>
                                </select>
                            </section>
                            <footer class="form-actions">
                                <button type="button" class="btn btn-secondary" id="cancel-pet">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Adicionar Pet</button>
                            </footer>
                        </form>
                    </section>
                </section>
            `;
            document.body.appendChild(modal);
            const closeBtn = modal.querySelector('.btn-close');
            const cancelBtn = modal.querySelector('#cancel-pet');
            function closeModal() {
                modal.classList.add('fade-out');
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                }, 300);
            }
            closeBtn.addEventListener('click', closeModal);
            cancelBtn.addEventListener('click', closeModal);
            modal.querySelector('.modal-content').addEventListener('click', function(e) {
                e.stopPropagation();
            });
            modal.addEventListener('click', closeModal);
            const form = modal.querySelector('#new-pet-form');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('pet-name').value;
                const species = document.getElementById('pet-species').value;
                const breed = document.getElementById('pet-breed').value;
                const age = document.getElementById('pet-age').value;
                const weight = document.getElementById('pet-weight').value;
                const gender = document.getElementById('pet-gender').value;
                const petEmoji = species === 'dog' ? '🐕' : species === 'cat' ? '🐱' : species === 'bird' ? '🐦' : '🐾';
                const genderText = gender === 'male' ? 'Macho' : 'Fêmea';
                const newPet = document.createElement('article');
                newPet.className = 'pet-card';
                newPet.innerHTML = `
                    <section class="pet-info">
                        <figure class="pet-avatar">${petEmoji}</figure>
                        <h3 class="pet-name">${name}</h3>
                        <p class="pet-details">${breed} • ${age} anos • ${weight}kg • ${genderText}</p>
                    </section>
                `;
                petsGrid.appendChild(newPet);
                closeModal();
            });
        });
    }
});
