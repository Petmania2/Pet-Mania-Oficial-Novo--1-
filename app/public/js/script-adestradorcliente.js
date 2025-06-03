// script-adestradorcliente.js - Funcionalidades da página de Clientes

document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    const viewBtns = document.querySelectorAll('.view-btn');
    const clientsTable = document.querySelector('.clients-table-wrapper');
    const clientsGrid = document.querySelector('.clients-grid');
    const searchInput = document.getElementById('clienteSearch');
    const advancedFilterToggle = document.getElementById('advancedFilterToggle');
    const advancedFilters = document.querySelector('.advanced-filters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const statusOptions = document.querySelectorAll('.status-option');
    const activeFilters = document.querySelector('.active-filters');
    const clienteDetailsModal = document.getElementById('clienteDetailsModal');
    const clienteFormModal = document.getElementById('clienteFormModal');
    const formTabBtns = document.querySelectorAll('.form-tab-btn');
    const addClienteBtn = document.getElementById('addClienteBtn');
    const clientRows = document.querySelectorAll('.client-row');
    const notificationFloat = document.querySelector('.notification-float');

    // Toggle menu no mobile
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Alternar entre visualização em lista e grade
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewType = this.getAttribute('data-view');
            
            // Atualizar botões ativos
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar a visualização apropriada
            if (viewType === 'list') {
                clientsTable.style.display = 'block';
                clientsGrid.style.display = 'none';
            } else {
                clientsTable.style.display = 'none';
                clientsGrid.style.display = 'grid';
                populateGridView(); // Preencher a visualização em grade
            }
        });
    });

    // Mostrar/ocultar filtros avançados
    if (advancedFilterToggle) {
        advancedFilterToggle.addEventListener('click', function() {
            const isVisible = advancedFilters.style.display !== 'none';
            advancedFilters.style.display = isVisible ? 'none' : 'grid';
            this.querySelector('i').className = isVisible ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
        });
    }
    
    // Tratamento das opções de status (múltipla seleção)
    statusOptions.forEach(option => {
        option.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('active', checkbox.checked);
        });
    });
    
    // Resetar todos os filtros
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Resetar dropdowns
            document.querySelectorAll('.filter-select').forEach(select => {
                select.selectedIndex = 0;
            });
            
            // Resetar checkboxes de status
            statusOptions.forEach(option => {
                const checkbox = option.querySelector('input[type="checkbox"]');
                checkbox.checked = false;
                option.classList.remove('active');
            });
            
            // Resetar datas
            if (document.getElementById('filterStartDate')) {
                document.getElementById('filterStartDate').value = '';
            }
            if (document.getElementById('filterEndDate')) {
                document.getElementById('filterEndDate').value = '';
            }
            
            // Limpar filtros ativos
            clearActiveFilterTags();
            
            // Recarregar dados da tabela
            reloadTableData();
        });
    }
    
    // Aplicar filtros
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // Atualizar tags de filtro ativo
            updateActiveFilterTags();
            
            // Aplicar filtros na tabela
            applyTableFilters();
        });
    }

    // Função de pesquisa
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterTableBySearch(searchTerm);
        });
    }
    
    // Funções para gerenciar filtros
    
    // Atualizar tags de filtros ativos
    function updateActiveFilterTags() {
        // Limpar tags existentes
        clearActiveFilterTags();
        
        // Adicionar tag para cada status selecionado
        statusOptions.forEach(option => {
            const checkbox = option.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                const statusText = option.textContent.trim();
                addActiveFilterTag(`Status: ${statusText}`);
            }
        });
        
        // Adicionar tags para outros filtros selecionados
        const serviceSelect = document.getElementById('filterServico');
        if (serviceSelect && serviceSelect.value !== 'todos') {
            addActiveFilterTag(`Serviço: ${serviceSelect.options[serviceSelect.selectedIndex].text}`);
        }
        
        const breedSelect = document.getElementById('filterBreed');
        if (breedSelect && breedSelect.value !== 'todos') {
            addActiveFilterTag(`Raça: ${breedSelect.options[breedSelect.selectedIndex].text}`);
        }
        
        const ageSelect = document.getElementById('filterAge');
        if (ageSelect && ageSelect.value !== 'todos') {
            addActiveFilterTag(`Idade: ${ageSelect.options[ageSelect.selectedIndex].text}`);
        }
        
        const progressSelect = document.getElementById('filterProgress');
        if (progressSelect && progressSelect.value !== 'todos') {
            addActiveFilterTag(`Progresso: ${progressSelect.options[progressSelect.selectedIndex].text}`);
        }
        
        // Adicionar tag para datas, se definidas
        const startDate = document.getElementById('filterStartDate')?.value;
        const endDate = document.getElementById('filterEndDate')?.value;
        
        if (startDate && endDate) {
            const formatDate = date => {
                const d = new Date(date);
                return d.toLocaleDateString('pt-BR');
            };
            addActiveFilterTag(`Período: ${formatDate(startDate)} - ${formatDate(endDate)}`);
        } else if (startDate) {
            const formatDate = date => {
                const d = new Date(date);
                return d.toLocaleDateString('pt-BR');
            };
            addActiveFilterTag(`A partir de: ${formatDate(startDate)}`);
        } else if (endDate) {
            const formatDate = date => {
                const d = new Date(date);
                return d.toLocaleDateString('pt-BR');
            };
            addActiveFilterTag(`Até: ${formatDate(endDate)}`);
        }
    }
    
    // Adicionar uma nova tag de filtro ativo
    function addActiveFilterTag(text) {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.innerHTML = `${text} <i class="fas fa-times"></i>`;
        
        // Adicionar evento para remover o filtro ao clicar no X
        tag.querySelector('i').addEventListener('click', function() {
            // Remover tag visualmente
            tag.remove();
            
            // Identificar e resetar o filtro correspondente
            const filterText = text.split(':')[0].trim().toLowerCase();
            
            if (filterText === 'status') {
                const statusName = text.split(':')[1].trim();
                // Encontrar e desmarcar o checkbox correspondente
                statusOptions.forEach(option => {
                    if (option.textContent.trim() === statusName) {
                        const checkbox = option.querySelector('input[type="checkbox"]');
                        checkbox.checked = false;
                        option.classList.remove('active');
                    }
                });
            } else if (filterText === 'serviço') {
                document.getElementById('filterServico').value = 'todos';
            } else if (filterText === 'raça') {
                document.getElementById('filterBreed').value = 'todos';
            } else if (filterText === 'idade') {
                document.getElementById('filterAge').value = 'todos';
            } else if (filterText === 'progresso') {
                document.getElementById('filterProgress').value = 'todos';
            } else if (filterText === 'período' || filterText === 'a partir de' || filterText === 'até') {
                document.getElementById('filterStartDate').value = '';
                document.getElementById('filterEndDate').value = '';
            }
            
            // Replicar filtros na tabela
            applyTableFilters();
        });
        
        activeFilters.appendChild(tag);
    }
    
    // Limpar todas as tags de filtro ativo
    function clearActiveFilterTags() {
        while (activeFilters.firstChild) {
            activeFilters.removeChild(activeFilters.firstChild);
        }
    }
    
    // Aplicar filtros na tabela
    function applyTableFilters() {
        const rows = Array.from(document.querySelectorAll('.client-row'));
        
        // Obter valores de filtro selecionados
        const selectedStatus = [];
        statusOptions.forEach(option => {
            const checkbox = option.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                selectedStatus.push(checkbox.value);
            }
        });
        
        const selectedService = document.getElementById('filterServico').value;
        const selectedBreed = document.getElementById('filterBreed').value;
        const selectedAge = document.getElementById('filterAge').value;
        const selectedProgress = document.getElementById('filterProgress').value;
        const startDate = document.getElementById('filterStartDate').value ? new Date(document.getElementById('filterStartDate').value) : null;
        const endDate = document.getElementById('filterEndDate').value ? new Date(document.getElementById('filterEndDate').value) : null;
        
        // Aplicar filtros em cada linha
        rows.forEach(row => {
            let showRow = true;
            
            // Filtrar por status
            if (selectedStatus.length > 0) {
                const statusElement = row.querySelector('.status-badge');
                const rowStatus = getStatusValueFromClass(statusElement.className);
                if (!selectedStatus.includes(rowStatus)) {
                    showRow = false;
                }
            }
            
            // Filtrar por serviço
            if (showRow && selectedService !== 'todos') {
                const service = row.cells[2].textContent.trim().toLowerCase();
                if (!service.includes(selectedService.toLowerCase())) {
                    showRow = false;
                }
            }
            
            // Filtrar por raça
            if (showRow && selectedBreed !== 'todos') {
                const breedText = row.querySelector('.pet-breed').textContent.toLowerCase();
                if (!breedText.includes(selectedBreed.toLowerCase())) {
                    showRow = false;
                }
            }
            
            // Filtrar por idade
            if (showRow && selectedAge !== 'todos') {
                const ageText = row.querySelector('.pet-breed').textContent.toLowerCase();
                
                // Lógica para interpretar a idade
                const ageMatch = ageText.match(/(\d+)\s+(ano|anos|mes|meses)/);
                
                if (ageMatch) {
                    const age = parseInt(ageMatch[1]);
                    const unit = ageMatch[2];
                    
                    if (selectedAge === 'filhote' && (unit.includes('mes') || (unit.includes('ano') && age < 1))) {
                        // Mostrar filhotes
                    } else if (selectedAge === 'jovem' && unit.includes('ano') && age >= 1 && age <= 3) {
                        // Mostrar jovens
                    } else if (selectedAge === 'adulto' && unit.includes('ano') && age > 3 && age <= 8) {
                        // Mostrar adultos
                    } else if (selectedAge === 'senior' && unit.includes('ano') && age > 8) {
                        // Mostrar seniores
                    } else {
                        showRow = false;
                    }
                } else {
                    // Se não conseguir determinar a idade
                    showRow = false;
                }
            }
            
            // Filtrar por progresso
            if (showRow && selectedProgress !== 'todos') {
                const progressElement = row.querySelector('.progress');
                const progressWidth = parseInt(progressElement.style.width);
                
                if (selectedProgress === 'nao-iniciado' && progressWidth > 0) {
                    showRow = false;
                } else if (selectedProgress === 'em-andamento' && (progressWidth === 0 || progressWidth >= 70)) {
                    showRow = false;
                } else if (selectedProgress === 'quase-completo' && (progressWidth < 70 || progressWidth === 100)) {
                    showRow = false;
                } else if (selectedProgress === 'completo' && progressWidth !== 100) {
                    showRow = false;
                }
            }
            
            // Filtrar por data
            if (showRow && (startDate || endDate)) {
                const dateText = row.cells[3].textContent.trim();
                const rowDate = parseBrazilianDate(dateText);
                
                if (startDate && rowDate < startDate) {
                    showRow = false;
                }
                
                if (endDate && rowDate > endDate) {
                    showRow = false;
                }
            }
            
            // Aplicar visibilidade na linha
            row.style.display = showRow ? '' : 'none';
        });
        
        // Atualizar contagem
        updateClientCount();
    }
    
    // Converter classe do status para valor
    function getStatusValueFromClass(className) {
        if (className.includes('active')) return 'active';
        if (className.includes('pending')) return 'pending';
        if (className.includes('new')) return 'new';
        if (className.includes('inactive')) return 'inactive';
        return '';
    }
    
    // Converter data formato brasileiro para Date
    function parseBrazilianDate(dateStr) {
        const parts = dateStr.split('/');
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    
    // Filtrar tabela com base na pesquisa
    function filterTableBySearch(searchTerm) {
        const rows = Array.from(document.querySelectorAll('.client-row'));
        
        rows.forEach(row => {
            let showRow = false;
            
            // Verificar nome do cliente
            const clientName = row.querySelector('.client-basic-info h4').textContent.toLowerCase();
            if (clientName.includes(searchTerm)) {
                showRow = true;
            }
            
            // Verificar nome do pet
            const petName = row.querySelector('.pet-tag').textContent.toLowerCase();
            if (petName.includes(searchTerm)) {
                showRow = true;
            }
            
            // Verificar número de telefone
            const phoneNumber = row.querySelector('.client-basic-info p').textContent.toLowerCase();
            if (phoneNumber.includes(searchTerm)) {
                showRow = true;
            }
            
            // Verificar raça do pet
            const petBreed = row.querySelector('.pet-breed').textContent.toLowerCase();
            if (petBreed.includes(searchTerm)) {
                showRow = true;
            }
            
            // Verificar serviço
            const service = row.cells[2].textContent.toLowerCase();
            if (service.includes(searchTerm)) {
                showRow = true;
            }
            
            // Aplicar visibilidade
            row.style.display = showRow ? '' : 'none';
        });
        
        // Atualizar contagem
        updateClientCount();
    }
    
    // Recarregar dados da tabela
    function reloadTableData() {
        const rows = Array.from(document.querySelectorAll('.client-row'));
        rows.forEach(row => {
            row.style.display = '';
        });
        
        // Atualizar contagem
        updateClientCount();
    }
    
    // Preencher a visualização em grade com base nos dados da tabela
    function populateGridView() {
        const grid = document.querySelector('.clients-grid');
        grid.innerHTML = ''; // Limpar conteúdo anterior
        
        const rows = Array.from(document.querySelectorAll('.client-row')).filter(row => row.style.display !== 'none');
        
        rows.forEach(row => {
            const clientName = row.querySelector('.client-basic-info h4').textContent;
            const phone = row.querySelector('.client-basic-info p').textContent;
            const petName = row.querySelector('.pet-tag').textContent;
            const petBreed = row.querySelector('.pet-breed').textContent;
            const service = row.cells[2].textContent;
            const date = row.cells[3].textContent;
            const status = row.querySelector('.status-badge').outerHTML;
            const progressBar = row.querySelector('.progress-bar').outerHTML;
            const progressText = row.querySelector('.progress-text').textContent;
            
            const card = document.createElement('div');
            card.className = 'client-card';
            card.setAttribute('data-id', row.getAttribute('data-id'));
            
            card.innerHTML = `
                <div class="client-card-header">
                    <div class="client-card-avatar"></div>
                    <div class="client-card-name">
                        <h3>${clientName}</h3>
                        <p>${phone}</p>
                    </div>
                    ${status}
                </div>
                <div class="client-card-pet">
                    <span class="pet-tag dog">${petName}</span>
                    <p>${petBreed}</p>
                </div>
                <div class="client-card-info">
                    <p><strong>Serviço:</strong> ${service}</p>
                    <p><strong>Início:</strong> ${date}</p>
                    <div class="client-card-progress">
                        ${progressBar}
                        <span>${progressText}</span>
                    </div>
                </div>
                <div class="client-card-actions">
                    <button class="btn btn-small btn-icon view-details-btn" title="Ver Detalhes"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-small btn-icon edit-client-btn" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-small btn-icon message-client-btn" title="Mensagem"><i class="fas fa-comment"></i></button>
                </div>
            `;
            
            grid.appendChild(card);
        });
        
        // Adicionar eventos para os botões nos cards
        addCardEventListeners();
    }
    
    // Adicionar eventos aos botões nos cards da visualização em grade
    function addCardEventListeners() {
        // Botão de visualizar detalhes
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.client-card');
                const clientId = card.getAttribute('data-id');
                openClientDetailsModal(clientId);
            });
        });
        
        // Botão de editar cliente
        document.querySelectorAll('.edit-client-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.client-card');
                const clientId = card.getAttribute('data-id');
                openClientFormModal(clientId);
            });
        });
        
        // Botão de enviar mensagem
        document.querySelectorAll('.message-client-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.client-card');
                const clientId = card.getAttribute('data-id');
                openMessageDialog(clientId);
            });
        });
    }
    
    // Atualizar contagem de clientes visíveis
    function updateClientCount() {
        const visibleRows = document.querySelectorAll('.client-row:not([style*="display: none"])').length;
        document.querySelector('.card-header h2').textContent = `Lista de Clientes (${visibleRows})`;
    }
    
    // Configurar eventos para botões nas linhas da tabela
    clientRows.forEach(row => {
        // Botão de visualizar detalhes
        row.querySelector('.actions-cell button:nth-child(1)').addEventListener('click', function() {
            const clientId = row.getAttribute('data-id');
            openClientDetailsModal(clientId);
        });
        
        // Botão de editar cliente
        const editBtn = row.querySelector('.actions-cell button:nth-child(2)');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                const clientId = row.getAttribute('data-id');
                openClientFormModal(clientId);
            });
        }
        
        // Botão de enviar mensagem ou botão específico dependendendo do status
        const messageBtn = row.querySelector('.actions-cell button:nth-child(3)');
        if (messageBtn) {
            messageBtn.addEventListener('click', function() {
                const clientId = row.getAttribute('data-id');
                openMessageDialog(clientId);
            });
        }
        
        // Botões de aceitar/recusar para clientes pendentes
        const acceptBtn = row.querySelector('.btn-accept');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                acceptClient(row.getAttribute('data-id'));
            });
        }
        
        const rejectBtn = row.querySelector('.btn-reject');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', function() {
                rejectClient(row.getAttribute('data-id'));
            });
        }
    });
    
    // Modal de detalhes do cliente
    function openClientDetailsModal(clientId) {
        // Obter dados do cliente
        const clientData = getClientDataById(clientId);
        
        if (!clientData) {
            showNotification('Cliente não encontrado', 'error');
            return;
        }
        
        // Preencher o modal com os dados do cliente
        const modalBody = clienteDetailsModal.querySelector('.modal-body');
        
        modalBody.innerHTML = `
            <div class="client-details">
                <div class="client-details-header">
                    <div class="client-details-avatar"></div>
                    <div class="client-details-info">
                        <h3>${clientData.name}</h3>
                        <p><i class="fas fa-phone"></i> ${clientData.phone}</p>
                        <p><i class="fas fa-envelope"></i> ${clientData.email || 'Email não cadastrado'}</p>
                        <div class="client-status">
                            <span class="status-badge ${clientData.statusClass}">${clientData.statusText}</span>
                        </div>
                    </div>
                </div>
                
                <div class="details-section">
                    <h4>Informações do Pet</h4>
                    <div class="pet-details">
                        <div class="pet-avatar ${clientData.petType}"></div>
                        <div class="pet-info">
                            <h3>${clientData.petName}</h3>
                            <p>Raça: ${clientData.petBreed}</p>
                            <p>Idade: ${clientData.petAge}</p>
                            <p>Sexo: ${clientData.petGender || 'Não informado'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="details-section">
                    <h4>Serviço Contratado</h4>
                    <p><strong>Tipo:</strong> ${clientData.service}</p>
                    <p><strong>Data de Início:</strong> ${clientData.startDate}</p>
                    <p><strong>Sessões:</strong> ${clientData.completedSessions}/${clientData.totalSessions}</p>
                    <div class="progress-container">
                        <div class="progress-label">Progresso:</div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${clientData.progressPercentage}%;"></div>
                        </div>
                        <div class="progress-value">${clientData.progressPercentage}%</div>
                    </div>
                </div>
                
                <div class="details-section">
                    <h4>Próximas Sessões</h4>
                    <div class="sessions-list">
                        ${clientData.nextSessions ? clientData.nextSessions.map(session => `
                            <div class="session-item">
                                <div class="session-date">
                                    <span class="date">${session.date}</span>
                                    <span class="time">${session.time}</span>
                                </div>
                                <div class="session-info">
                                    <span class="session-number">Sessão ${session.number}</span>
                                    <span class="session-topic">${session.topic}</span>
                                </div>
                                <div class="session-actions">
                                    <button class="btn btn-small btn-outlined">Reagendar</button>
                                </div>
                            </div>
                        `).join('') : '<p>Nenhuma sessão agendada.</p>'}
                    </div>
                </div>
                
                <div class="details-section">
                    <h4>Histórico e Anotações</h4>
                    <div class="notes-list">
                        ${clientData.notes ? clientData.notes.map(note => `
                            <div class="note-item">
                                <div class="note-header">
                                    <span class="note-date">${note.date}</span>
                                    <span class="note-session">Sessão ${note.session}</span>
                                </div>
                                <div class="note-content">
                                    <p>${note.content}</p>
                                </div>
                            </div>
                        `).join('') : '<p>Nenhuma anotação registrada.</p>'}
                    </div>
                    <button class="btn btn-outlined btn-sm mt-3">
                        <i class="fas fa-plus"></i> Adicionar Anotação
                    </button>
                </div>
            </div>
        `;
        
        // Mostrar o modal
        clienteDetailsModal.style.display = 'flex';
        
        // Event listener para fechar o modal
        const closeBtn = clienteDetailsModal.querySelector('.modal-close');
        const closeDetailsBtn = document.getElementById('closeDetailsBtn');
        
        closeBtn.addEventListener('click', function() {
            clienteDetailsModal.style.display = 'none';
        });
        
        closeDetailsBtn.addEventListener('click', function() {
            clienteDetailsModal.style.display = 'none';
        });
    }
    
    // Modal de formulário para adicionar/editar cliente
    function openClientFormModal(clientId = null) {
        const isEditing = clientId !== null;
        const formModalTitle = document.getElementById('formModalTitle');
        
        // Atualizar título do modal
        formModalTitle.textContent = isEditing ? 'Editar Cliente' : 'Adicionar Novo Cliente';
        
        // Se estiver editando, preencher o formulário com os dados do cliente
        if (isEditing) {
            const clientData = getClientDataById(clientId);
            
            if (!clientData) {
                showNotification('Cliente não encontrado', 'error');
                return;
            }
            
            // Preencher os campos do formulário com os dados do cliente
            fillClientForm(clientData);
        } else {
            // Resetar o formulário
            document.getElementById('clienteForm').reset();
            
            // Definir data de início para hoje
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('dataInicio').value = today;
        }
        
        // Mostrar o modal
        clienteFormModal.style.display = 'flex';
        
        // Event listener para fechar o modal
        const closeBtns = clienteFormModal.querySelectorAll('.modal-close, .modal-close-btn');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                clienteFormModal.style.display = 'none';
            });
        });
        
        // Event listener para o botão Salvar
        const saveBtn = document.getElementById('saveClienteBtn');
        saveBtn.addEventListener('click', function() {
            saveClient(isEditing ? clientId : null);
        });
    }
    
    // Salvar cliente (novo ou editado)
    function saveClient(clientId = null) {
        // TODO: Implementar validação do formulário
        
        // Simulação de salvamento bem-sucedido
        const message = clientId ? 'Cliente atualizado com sucesso!' : 'Novo cliente adicionado com sucesso!';
        showNotification(message, 'success');
        
        // Fechar o modal
        clienteFormModal.style.display = 'none';
        
        // Recarregar a tabela (em uma aplicação real, isso atualizaria com dados do servidor)
        // Para efeito de demonstração, vamos apenas recarregar a página após um breve delay
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
    
    // Abrir diálogo de mensagens
    function openMessageDialog(clientId) {
        // Para efeito de demonstração, apenas mostrar uma notificação
        const clientData = getClientDataById(clientId);
        
        if (!clientData) {
            showNotification('Cliente não encontrado', 'error');
            return;
        }
        
        showNotification(`Abrindo mensagens com ${clientData.name}...`, 'info');
        
        // Redirecionar para a página de mensagens
        // Em uma aplicação real, isso poderia abrir uma nova página ou um modal
        setTimeout(() => {
            //window.location.href = `mensagensadestrador.html?cliente=${clientId}`;
            // Para efeito de demonstração, vamos apenas mostrar outra notificação
            showNotification('Redirecionando para mensagens...', 'info');
        }, 1500);
    }
    
    // Aceitar cliente pendente
    function acceptClient(clientId) {
        // Para efeito de demonstração, apenas mostrar uma notificação
        showNotification('Cliente aceito com sucesso!', 'success');
        // Aceitar cliente pendente
    function acceptClient(clientId) {
        // Para efeito de demonstração, apenas mostrar uma notificação
        showNotification('Cliente aceito com sucesso!', 'success');
        
        // Atualizar status na interface
        const row = document.querySelector(`.client-row[data-id="${clientId}"]`);
        if (row) {
            const statusCell = row.querySelector('.status-badge');
            statusCell.className = 'status-badge active';
            statusCell.textContent = 'Ativo';
            
            // Atualizar botões de ação
            const actionsCell = row.querySelector('.actions-cell');
            actionsCell.innerHTML = `
                <button class="btn btn-small btn-icon" title="Ver Detalhes"><i class="fas fa-eye"></i></button>
                <button class="btn btn-small btn-icon" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn btn-small btn-icon" title="Mensagem"><i class="fas fa-comment"></i></button>
            `;
            
            // Reconfigurar eventos para os novos botões
            actionsCell.querySelector('button:nth-child(1)').addEventListener('click', function() {
                openClientDetailsModal(clientId);
            });
            
            actionsCell.querySelector('button:nth-child(2)').addEventListener('click', function() {
                openClientFormModal(clientId);
            });
            
            actionsCell.querySelector('button:nth-child(3)').addEventListener('click', function() {
                openMessageDialog(clientId);
            });
        }
    }
    
    // Recusar cliente pendente
    function rejectClient(clientId) {
        if (confirm('Tem certeza que deseja recusar este cliente?')) {
            // Para efeito de demonstração, apenas mostrar uma notificação
            showNotification('Cliente recusado.', 'info');
            
            // Atualizar status na interface ou remover da lista
            const row = document.querySelector(`.client-row[data-id="${clientId}"]`);
            if (row) {
                // Opção 1: Remover da lista
                row.remove();
                
                // Opção 2: Atualizar status para inativo
                // const statusCell = row.querySelector('.status-badge');
                // statusCell.className = 'status-badge inactive';
                // statusCell.textContent = 'Inativo';
                
                // Atualizar contagem
                updateClientCount();
            }
        }
    }
    
    // Exibir notificação
    function showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Adicionar ao corpo da página
        document.body.appendChild(notification);
        
        // Animação de entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Configurar botão de fechar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            closeNotification(notification);
        });
        
        // Fechar automaticamente após alguns segundos
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
    }
    
    // Fechar uma notificação
    function closeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
    
    // Obter ícone para notificação com base no tipo
    function getNotificationIcon(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            case 'info':
            default:
                return 'fa-info-circle';
        }
    }
    
    // Configurar navegação por abas no formulário
    formTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Atualizar botões ativos
            formTabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar conteúdo da aba selecionada
            const tabContents = document.querySelectorAll('.form-tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Botão para adicionar novo cliente
    if (addClienteBtn) {
        addClienteBtn.addEventListener('click', function() {
            openClientFormModal();
        });
    }
    
    // Configuração do botão de notificação flutuante
    if (notificationFloat) {
        notificationFloat.addEventListener('click', function() {
            showNotificationPanel();
        });
    }
    
    // Mostrar painel de notificações
    function showNotificationPanel() {
        // Verificar se já existe um painel
        let notificationPanel = document.getElementById('notificationPanel');
        
        if (notificationPanel) {
            // Se já existir, apenas alternar visibilidade
            notificationPanel.classList.toggle('show');
            return;
        }
        
        // Criar painel de notificações
        notificationPanel = document.createElement('div');
        notificationPanel.id = 'notificationPanel';
        notificationPanel.className = 'notification-panel';
        
        notificationPanel.innerHTML = `
            <div class="notification-panel-header">
                <h3>Notificações</h3>
                <button class="notification-panel-close">&times;</button>
            </div>
            <div class="notification-list">
                <div class="notification-item unread">
                    <div class="notification-icon"><i class="fas fa-bell"></i></div>
                    <div class="notification-content">
                        <p class="notification-text">Nova solicitação de cliente: <strong>Rodrigo Alves</strong></p>
                        <p class="notification-time">Hoje, 10:45</p>
                    </div>
                    <div class="notification-actions">
                        <button class="btn btn-small btn-icon"><i class="fas fa-eye"></i></button>
                    </div>
                </div>
                <div class="notification-item unread">
                    <div class="notification-icon"><i class="fas fa-calendar"></i></div>
                    <div class="notification-content">
                        <p class="notification-text">Sessão agendada para amanhã com <strong>Pedro Mendes</strong></p>
                        <p class="notification-time">Hoje, 09:30</p>
                    </div>
                    <div class="notification-actions">
                        <button class="btn btn-small btn-icon"><i class="fas fa-eye"></i></button>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon"><i class="fas fa-comment"></i></div>
                    <div class="notification-content">
                        <p class="notification-text">Nova mensagem de <strong>Amanda Silva</strong></p>
                        <p class="notification-time">Ontem, 18:15</p>
                    </div>
                    <div class="notification-actions">
                        <button class="btn btn-small btn-icon"><i class="fas fa-eye"></i></button>
                    </div>
                </div>
            </div>
            <div class="notification-panel-footer">
                <button class="btn btn-outlined btn-sm">Marcar todas como lidas</button>
                <button class="btn btn-text btn-sm">Ver todas</button>
            </div>
        `;
        
        // Adicionar ao corpo da página
        document.body.appendChild(notificationPanel);
        
        // Mostrar o painel
        setTimeout(() => {
            notificationPanel.classList.add('show');
        }, 10);
        
        // Configurar botão de fechar
        notificationPanel.querySelector('.notification-panel-close').addEventListener('click', () => {
            notificationPanel.classList.remove('show');
        });
        
        // Configurar evento de clique fora do painel para fechar
        document.addEventListener('click', function(event) {
            if (notificationPanel.classList.contains('show') && 
                !notificationPanel.contains(event.target) && 
                !notificationFloat.contains(event.target)) {
                notificationPanel.classList.remove('show');
            }
        });
    }
    
    // Função para obter dados do cliente pelo ID
    function getClientDataById(clientId) {
        // Em uma aplicação real, isso buscaria dados do servidor
        // Para este exemplo, usaremos dados simulados
        
        const clientsData = {
            '1': {
                id: '1',
                name: 'Amanda Silva',
                phone: '(11) 98765-4321',
                email: 'amanda.silva@email.com',
                address: 'Av. Paulista, 1000, São Paulo - SP',
                statusText: 'Novo',
                statusClass: 'new',
                petName: 'Rex',
                petType: 'dog',
                petBreed: 'Golden Retriever',
                petAge: '2 anos',
                petGender: 'Macho',
                service: 'Obediência Básica',
                startDate: '28/02/2025',
                completedSessions: 1,
                totalSessions: 10,
                progressPercentage: 10,
                nextSessions: [
                    { date: '14/04/2025', time: '15:00', number: 2, topic: 'Comando Senta/Fica' },
                    { date: '21/04/2025', time: '15:00', number: 3, topic: 'Caminhada com Guia' }
                ],
                notes: [
                    { date: '28/02/2025', session: 1, content: 'Primeira sessão de avaliação. Rex demonstrou boa disposição para aprender, mas tem dificuldade em manter foco. Recomendado praticar exercícios básicos de foco em casa.' }
                ]
            },
            '2': {
                id: '2',
                name: 'Pedro Mendes',
                phone: '(11) 97654-3210',
                email: 'pedro.mendes@email.com',
                address: 'Rua Augusta, 500, São Paulo - SP',
                statusText: 'Ativo',
                statusClass: 'active',
                petName: 'Luna',
                petType: 'dog',
                petBreed: 'Border Collie',
                petAge: '1 ano',
                petGender: 'Fêmea',
                service: 'Comportamento Avançado',
                startDate: '15/01/2025',
                completedSessions: 6,
                totalSessions: 10,
                progressPercentage: 60,
                nextSessions: [
                    { date: '11/04/2025', time: '10:00', number: 7, topic: 'Comportamento com Estranhos' },
                    { date: '18/04/2025', time: '10:00', number: 8, topic: 'Resposta a Distrações' }
                ],
                notes: [
                    { date: '15/01/2025', session: 1, content: 'Luna é extremamente inteligente e aprende comandos rapidamente. Demonstrou ansiedade em ambientes novos.' },
                    { date: '22/01/2025', session: 2, content: 'Trabalhamos com comandos básicos. Luna responde muito bem ao reforço positivo.' },
                    { date: '29/01/2025', session: 3, content: 'Focamos em socialização com outros cães. Mostra sinais de medo inicial, mas adapta-se rapidamente.' },
                    { date: '05/02/2025', session: 4, content: 'Introduzimos comandos mais complexos. Luna absorve com facilidade. O tutor relatou bom progresso em casa.' },
                    { date: '12/02/2025', session: 5, content: 'Trabalho em ambientes com distrações. Consegue manter foco por períodos mais longos.' },
                    { date: '19/02/2025', session: 6, content: 'Revisão geral dos comandos. Luna apresenta excelente retenção e consistência.' }
                ]
            },
            '3': {
                id: '3',
                name: 'Mariana Costa',
                phone: '(11) 95432-1098',
                email: 'mariana.costa@email.com',
                address: 'Rua Oscar Freire, 300, São Paulo - SP',
                statusText: 'Ativo',
                statusClass: 'active',
                petName: 'Max',
                petType: 'dog',
                petBreed: 'Labrador',
                petAge: '3 anos',
                petGender: 'Macho',
                service: 'Socialização',
                startDate: '05/02/2025',
                completedSessions: 4,
                totalSessions: 10,
                progressPercentage: 40,
                nextSessions: [
                    { date: '12/04/2025', time: '14:00', number: 5, topic: 'Socialização em Parque' }
                ],
                notes: [
                    { date: '05/02/2025', session: 1, content: 'Max tem bom temperamento, mas demonstra ansiedade ao ver outros cães. Começamos com exposição à distância.' },
                    { date: '12/02/2025', session: 2, content: 'Reduzimos a distância com outros cães. Max mostra menos sinais de ansiedade.' },
                    { date: '19/02/2025', session: 3, content: 'Primeira interação direta com outro cão controlado. Resultado positivo, mas ainda com alguma tensão.' },
                    { date: '26/02/2025', session: 4, content: 'Interação com múltiplos cães. Max mostrou grande progresso, com pouca ansiedade inicial.' }
                ]
            },
            '4': {
                id: '4',
                name: 'Rodrigo Alves',
                phone: '(11) 98765-1234',
                email: 'rodrigo.alves@email.com',
                address: 'Av. Brigadeiro Faria Lima, 2000, São Paulo - SP',
                statusText: 'Pendente',
                statusClass: 'pending',
                petName: 'Thor',
                petType: 'dog',
                petBreed: 'Pastor Alemão',
                petAge: '8 meses',
                petGender: 'Macho',
                service: 'Obediência Básica',
                startDate: '25/02/2025',
                completedSessions: 0,
                totalSessions: 10,
                progressPercentage: 0,
                nextSessions: [],
                notes: []
            }
        };
        
        return clientsData[clientId] || null;
    }
    
    // Preencher formulário com dados do cliente
    function fillClientForm(clientData) {
        // Esta é uma implementação simulada
        // Em uma aplicação real, você preencheria todos os campos do formulário
        
        // Se o formulário tiver abas, vamos configurar para mostrar a primeira aba
        const firstTabBtn = document.querySelector('.form-tab-btn');
        if (firstTabBtn) {
            firstTabBtn.click();
        }
        
        // Simular preenchimento de alguns campos apenas para demonstração
        // Na implementação real, você preencheria todos os campos necessários
        
        // Exemplo: Preencher campos do serviço na terceira aba
        const servicoTab = document.querySelector('.form-tab-btn[data-tab="servico-info"]');
        if (servicoTab) {
            servicoTab.click();
            
            // Preencher campos do serviço
            document.getElementById('tipoServico').value = getServicoValue(clientData.service);
            document.getElementById('totalSessoes').value = clientData.totalSessions;
            document.getElementById('dataInicio').value = convertDateToInput(clientData.startDate);
            
            // Valores simulados para os demais campos
            document.getElementById('valorSessao').value = '150.00';
            document.getElementById('observacoesServico').value = 'Cliente solicitou foco especial em socialização e comandos básicos.';
            
            // Marcar alguns checkboxes de objetivos
            const objetivosCheckboxes = document.querySelectorAll('input[name="objetivos"]');
            objetivosCheckboxes.forEach(checkbox => {
                if (['comandos', 'socializacao'].includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
        }
    }
    
    // Funções auxiliares
    
    // Converter nome do serviço para valor no select
    function getServicoValue(serviceName) {
        const serviceMap = {
            'Obediência Básica': 'obediencia',
            'Comportamento Avançado': 'comportamento',
            'Socialização': 'socializacao',
            'Correção de Problemas': 'problemas'
        };
        
        return serviceMap[serviceName] || 'outro';
    }
    
    // Converter data formato brasileiro para formato input date (yyyy-mm-dd)
    function convertDateToInput(dateStr) {
        const parts = dateStr.split('/');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    // Inicialização adicional
    
    // Atualizar contagem inicial de clientes
    updateClientCount();
    
    // Fechar modais se o usuário clicar fora deles
    window.addEventListener('click', function(event) {
        if (event.target === clienteDetailsModal) {
            clienteDetailsModal.style.display = 'none';
        }
        
        if (event.target === clienteFormModal) {
            clienteFormModal.style.display = 'none';
        }
    });
}});