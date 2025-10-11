document.addEventListener('DOMContentLoaded', function() {
    // Gerenciamento das tabs do perfil
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.profile-tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todas as tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar classe active na tab clicada
            button.classList.add('active');
            
            // Mostrar o conteúdo correspondente
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Função para exibir notificação de salvamento
    function showSaveNotification() {
        const notification = document.createElement('section');
        notification.className = 'save-notification';
        notification.innerHTML = '<i class="fas fa-check-circle"></i> Alterações salvas com sucesso!';
        
        document.body.appendChild(notification);
        
        // Animação de entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Evento de salvar alterações
    const saveButtons = document.querySelectorAll('.btn-save');
    saveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simular salvamento com delay
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
            
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = 'Salvar Alterações';
                showSaveNotification();
            }, 1000);
        });
    });
    
    // Funcionalidade do toggle de autenticação de dois fatores
    const twoFactorToggle = document.getElementById('two-factor');
    const toggleLabel = twoFactorToggle?.parentElement.querySelector('.toggle-label');
    
    if (twoFactorToggle && toggleLabel) {
        twoFactorToggle.addEventListener('change', function() {
            if (this.checked) {
                toggleLabel.textContent = 'Ativado';
                // Simulação de modal de configuração
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
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Lógica para avaliar força da senha
            if (password.length > 0) {
                strength++;
            }
            if (password.length >= 8) {
                strength++;
            }
            if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
                strength++;
            }
            if (/[0-9]/.test(password)) {
                strength++;
            }
            if (/[^A-Za-z0-9]/.test(password)) {
                strength++;
            }
            
            strength = Math.min(strength, 4);
            
            // Atualizar indicador visual
            strengthSegments.forEach((segment, index) => {
                segment.style.backgroundColor = index < strength ? getStrengthColor(strength) : '#ddd';
            });
            
            // Atualizar texto
            strengthText.textContent = getStrengthText(strength);
            strengthText.style.color = getStrengthColor(strength);
        });
    }
    
    // Funções para avaliação de força da senha
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
    
    // Gerenciamento de serviços
    const addServiceBtn = document.querySelector('.btn-add-service');
    const servicesList = document.querySelector('.services-list');
    
    if (addServiceBtn && servicesList) {
        addServiceBtn.addEventListener('click', function() {
            // Criar modal para adicionar novo serviço
            const modal = document.createElement('section');
            modal.className = 'modal';
            modal.innerHTML = `
                <section class="modal-content">
                    <section class="modal-header">
                        <h3>Adicionar Novo Serviço</h3>
                        <button class="btn-close">&times;</button>
                    </section>
                    <section class="modal-body">
                        <form id="new-service-form">
                            <section class="form-group">
                                <label for="service-name">Nome do Serviço</label>
                                <input type="text" id="service-name" required>
                            </section>
                            <section class="form-group">
                                <label for="service-price">Preço (R$)</label>
                                <input type="number" id="service-price" min="0" step="0.01" required>
                            </section>
                            <section class="form-group">
                                <label for="service-description">Descrição</label>
                                <textarea id="service-description" rows="3" required></textarea>
                            </section>
                            <section class="form-row">
                                <section class="form-group">
                                    <label for="service-duration">Duração</label>
                                    <input type="text" id="service-duration" placeholder="Ex: 1h30min" required>
                                </section>
                                <section class="form-group">
                                    <label for="service-location">Local</label>
                                    <input type="text" id="service-location" placeholder="Ex: Residência ou Parque" required>
                                </section>
                            </section>
                            <section class="form-actions">
                                <button type="button" class="btn btn-secondary" id="cancel-service">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Adicionar Serviço</button>
                            </section>
                        </form>
                    </section>
                </section>
            `;
            
            document.body.appendChild(modal);
            
            // Lógica para fechar o modal
            const closeBtn = modal.querySelector('.btn-close');
            const cancelBtn = modal.querySelector('#cancel-service');
            
            function closeModal() {
                modal.classList.add('fade-out');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
            
            closeBtn.addEventListener('click', closeModal);
            cancelBtn.addEventListener('click', closeModal);
            
            // Prevenir que cliques no conteúdo do modal fechem o modal
            modal.querySelector('.modal-content').addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            // Fechar modal ao clicar fora dele
            modal.addEventListener('click', closeModal);
            
            // Lógica para adicionar novo serviço
            const form = modal.querySelector('#new-service-form');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('service-name').value;
                const price = parseFloat(document.getElementById('service-price').value).toFixed(2);
                const description = document.getElementById('service-description').value;
                const duration = document.getElementById('service-duration').value;
                const location = document.getElementById('service-location').value;
                
                // Criar novo elemento de serviço
                const newService = document.createElement('section');
                newService.className = 'service-item';
                newService.innerHTML = `
                    <section class="service-header">
                        <h3>${name}</h3>
                        <section class="service-price">R$ ${price}</section>
                    </section>
                    <p>${description}</p>
                    <section class="service-details">
                        <span><i class="fas fa-clock"></i> ${duration}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${location}</span>
                    </section>
                    <section class="service-actions">
                        <button class="btn btn-small btn-outline"><i class="fas fa-edit"></i> Editar</button>
                        <button class="btn btn-small btn-danger"><i class="fas fa-trash"></i></button>
                    </section>
                `;
                
                // Adicionar antes do botão
                servicesList.insertBefore(newService, addServiceBtn);
                
                // Adicionar evento de edição e exclusão
                setupServiceActions(newService);
                
                // Fechar modal
                closeModal();
                
                // Mostrar notificação
                showSaveNotification();
            });
            
            // Mostrar o modal com animação
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        });
        
        // Configurar botões de ação nos serviços existentes
        document.querySelectorAll('.service-item').forEach(item => {
            setupServiceActions(item);
        });
    }
    
    // Função para configurar botões de ação nos serviços
    function setupServiceActions(serviceItem) {
        const editBtn = serviceItem.querySelector('.btn-outline');
        const deleteBtn = serviceItem.querySelector('.btn-danger');
        
        // Evento para exclusão
        deleteBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja excluir este serviço?')) {
                serviceItem.classList.add('fade-out');
                setTimeout(() => {
                    serviceItem.remove();
                    showSaveNotification();
                }, 300);
            }
        });
        
        // Evento para edição (simplificado - na implementação real seria similar ao adicionar)
        editBtn.addEventListener('click', function() {
            alert('Funcionalidade de edição seria implementada de forma similar à adição de serviços.');
        });
    }
    
    // Adicionar classe CSS para animações
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .save-notification {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .save-notification i {
            margin-right: 10px;
            font-size: 20px;
        }
        
        .save-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal.show {
            opacity: 1;
        }
        
        .modal.fade-out {
            opacity: 0;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        }
        
        .modal.show .modal-content {
            transform: scale(1);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .modal-header h3 {
            margin: 0;
        }
        
        .btn-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .service-item.fade-out {
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
        }
    `;
    
    document.head.appendChild(styleElement);
    
    // Verificar data atual e atualizar no DOM
    const currentDateElement = document.querySelector('.current-date');
    if (currentDateElement) {
        const today = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        currentDateElement.textContent = today.toLocaleDateString('pt-BR', options);
    }
    
    // Funcionalidade para visualizar como cliente
    const viewAsClientBtn = document.querySelector('.profile-actions .btn-primary');
    if (viewAsClientBtn) {
        viewAsClientBtn.addEventListener('click', function() {
            alert('Esta funcionalidade abriria uma prévia de como o seu perfil aparece para os clientes.');
        });
    }
    
    // Botão de alteração de avatar
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function() {
            // Criar um input file invisível
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            
            // Simular clique para abrir o seletor de arquivos
            fileInput.click();
            
            // Processar a imagem quando selecionada
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // Criar imagem e substituir o placeholder
                        const avatarPlaceholder = document.querySelector('.avatar-placeholder');
                        avatarPlaceholder.innerHTML = '';
                        
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        
                        avatarPlaceholder.appendChild(img);
                        
                        // Atualizar item de completude do perfil
                        const avatarTask = document.querySelector('.task-item:not(.completed)');
                        if (avatarTask && avatarTask.querySelector('span').textContent.includes('foto de perfil')) {
                            avatarTask.classList.add('completed');
                            avatarTask.querySelector('i').className = 'fas fa-check-circle';
                            
                            // Atualizar porcentagem
                            const progressFill = document.querySelector('.progress-fill');
                            progressFill.style.width = '95%';
                            
                            const progressText = document.querySelector('.progress-text');
                            progressText.textContent = '95% Completo';
                        }
                        
                        showSaveNotification();
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            });
        });
    }
});