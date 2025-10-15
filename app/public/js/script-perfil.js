// Script para página de perfil do adestrador
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.profile-tab-content');
    const saveButtons = document.querySelectorAll('.btn-save');
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    
    // Navegação entre abas
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active de todas as abas
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adiciona active na aba clicada
            this.classList.add('active');
            document.getElementById(tabId + '-tab').classList.add('active');
        });
    });
    
    // Salvar alterações
    saveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const form = this.closest('form');
            const formData = new FormData(form);
            const dados = {};
            
            // Converter FormData para objeto
            for (let [key, value] of formData.entries()) {
                dados[key] = value;
            }
            
            // Adicionar dados específicos baseados na aba ativa
            const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
            
            if (activeTab === 'personal') {
                dados.nome = document.getElementById('name').value;
                dados.email = document.getElementById('email').value;
                dados.telefone = document.getElementById('phone').value;
                dados.logradouro = document.getElementById('address').value;
                dados.numero = document.getElementById('number').value;
                dados.complemento = document.getElementById('complement').value;
                dados.bairro = document.getElementById('neighborhood').value;
                dados.cidade = document.getElementById('city').value;
                dados.estado = document.getElementById('state').value;
                dados.cep = document.getElementById('cep').value;
            } else if (activeTab === 'professional') {
                dados.experiencia = document.getElementById('experience').value;
                dados.sobre = document.getElementById('bio').value;
                dados.preco = document.getElementById('price').value;
                
                // Especialidades selecionadas
                const especialidades = [];
                document.querySelectorAll('input[name="specialty"]:checked').forEach(checkbox => {
                    especialidades.push(checkbox.value);
                });
                dados.especialidades = JSON.stringify(especialidades);
            }
            
            // Enviar dados
            fetch('/atualizar-adestrador', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    showNotification('Perfil atualizado com sucesso!', 'success');
                } else {
                    showNotification(data.erro || 'Erro ao atualizar perfil', 'error');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                showNotification('Erro ao atualizar perfil', 'error');
            });
        });
    });
    
    // Upload de foto de perfil
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('foto', file);
                    
                    fetch('/upload-foto-perfil', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.sucesso) {
                            showNotification('Foto atualizada com sucesso!', 'success');
                            // Recarregar a página para mostrar a nova foto
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        } else {
                            showNotification(data.erro || 'Erro ao atualizar foto', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                        showNotification('Erro ao atualizar foto', 'error');
                    });
                }
            };
            
            input.click();
        });
    }
    
    // Função para mostrar notificações
    function showNotification(message, type = 'info') {
        // Remove notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Adiciona estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 300px;
        `;
        
        // Botão de fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            margin-left: 10px;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Máscara para CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });
    }
    
    // Validação de preço
    const priceInput = document.getElementById('price');
    if (priceInput) {
        priceInput.addEventListener('input', function(e) {
            let value = parseFloat(e.target.value);
            if (value < 50) {
                e.target.setCustomValidity('O preço mínimo é R$ 50,00');
            } else if (value > 99999999.99) {
                e.target.setCustomValidity('O preço máximo é R$ 99.999.999,99');
            } else {
                e.target.setCustomValidity('');
            }
        });
    }
});