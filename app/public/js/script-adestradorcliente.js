// Mobile Menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Search functionality
const searchInput = document.getElementById('clienteSearch');
const searchBtn = document.querySelector('.btn-search');

function searchClients() {
    const term = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('.client-row');
    
    rows.forEach(row => {
        const clientName = row.querySelector('.client-basic-info h4').textContent.toLowerCase();
        const petName = row.querySelector('.pet-tag').textContent.toLowerCase();
        
        if (clientName.includes(term) || petName.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

searchBtn?.addEventListener('click', searchClients);
searchInput?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchClients();
});

// Status filters
const statusOptions = document.querySelectorAll('.status-option');
statusOptions.forEach(option => {
    option.addEventListener('click', () => {
        const checkbox = option.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        option.classList.toggle('selected', checkbox.checked);
        applyFilters();
    });
});

// Advanced filters toggle
const advancedToggle = document.getElementById('advancedFilterToggle');
const advancedFilters = document.querySelector('.advanced-filters');

advancedToggle?.addEventListener('click', () => {
    const isVisible = advancedFilters.style.display === 'block';
    advancedFilters.style.display = isVisible ? 'none' : 'block';
    
    const icon = advancedToggle.querySelector('i');
    icon.className = isVisible ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
});

// Apply and reset filters
function applyFilters() {
    const rows = document.querySelectorAll('.client-row');
    const selectedStatuses = Array.from(document.querySelectorAll('input[name="status[]"]:checked')).map(cb => cb.value);
    const selectedService = document.getElementById('filterServico')?.value;
    
    rows.forEach(row => {
        let show = true;
        
        // Status filter
        if (selectedStatuses.length > 0) {
            const status = row.querySelector('.status-badge').textContent.toLowerCase();
            const statusMap = {
                'novo': 'new',
                'ativo': 'active',
                'pendente': 'pending',
                'inativo': 'inactive'
            };
            
            if (!selectedStatuses.includes(statusMap[status])) {
                show = false;
            }
        }
        
        // Service filter
        if (selectedService && selectedService !== 'todos') {
            const service = row.cells[2].textContent.toLowerCase();
            const serviceMap = {
                'obediencia': 'obediência básica',
                'comportamento': 'comportamento avançado',
                'socializacao': 'socialização',
                'problemas': 'correção de problemas'
            };
            
            if (!service.includes(serviceMap[selectedService] || selectedService)) {
                show = false;
            }
        }
        
        row.style.display = show ? '' : 'none';
    });
}

document.getElementById('applyFilters')?.addEventListener('click', applyFilters);

document.getElementById('resetFilters')?.addEventListener('click', () => {
    // Reset checkboxes
    document.querySelectorAll('input[name="status[]"]').forEach(cb => {
        cb.checked = false;
        cb.closest('.status-option').classList.remove('selected');
    });
    
    // Reset selects
    document.querySelectorAll('.filter-select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Reset date inputs
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.value = '';
    });
    
    // Show all rows
    document.querySelectorAll('.client-row').forEach(row => {
        row.style.display = '';
    });
});

// View toggle (list/grid)
const viewBtns = document.querySelectorAll('.view-btn');
const clientsTable = document.querySelector('.clients-table-wrapper');
const clientsGrid = document.querySelector('.clients-grid');

viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const view = btn.dataset.view;
        if (view === 'grid') {
            clientsTable.style.display = 'none';
            clientsGrid.style.display = 'grid';
        } else {
            clientsTable.style.display = 'block';
            clientsGrid.style.display = 'none';
        }
    });
});

// Client action buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-icon[title="Ver Detalhes"]')) {
        const row = e.target.closest('.client-row');
        const clientName = row.querySelector('.client-basic-info h4').textContent;
        showClientDetails(clientName);
    }
    
    if (e.target.closest('.btn-icon[title="Editar"]')) {
        const row = e.target.closest('.client-row');
        const clientName = row.querySelector('.client-basic-info h4').textContent;
        editClient(clientName);
    }
    
    if (e.target.closest('.btn-icon[title="Mensagem"]')) {
        const row = e.target.closest('.client-row');
        const clientName = row.querySelector('.client-basic-info h4').textContent;
        alert(`Enviando mensagem para ${clientName}`);
    }
    
    if (e.target.closest('.btn-accept')) {
        const row = e.target.closest('.client-row');
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.textContent = 'Ativo';
        statusBadge.className = 'status-badge active';
        
        // Change action buttons
        const actionsCell = row.querySelector('.actions-cell');
        actionsCell.innerHTML = `
            <button class="btn btn-small btn-icon" title="Ver Detalhes"><i class="fas fa-eye"></i></button>
            <button class="btn btn-small btn-icon" title="Editar"><i class="fas fa-edit"></i></button>
            <button class="btn btn-small btn-icon" title="Mensagem"><i class="fas fa-comment"></i></button>
        `;
        
        alert('Cliente aceito com sucesso!');
    }
    
    if (e.target.closest('.btn-reject')) {
        const row = e.target.closest('.client-row');
        if (confirm('Tem certeza que deseja recusar este cliente?')) {
            row.remove();
            alert('Cliente recusado e removido da lista.');
        }
    }
});

// Modals
const clientDetailsModal = document.getElementById('clienteDetailsModal');
const clientFormModal = document.getElementById('clienteFormModal');
const addClientBtn = document.getElementById('addClienteBtn');

function showModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showClientDetails(clientName) {
    const modalBody = clientDetailsModal.querySelector('.modal-body');
    modalBody.innerHTML = `
        <section class="client-details">
            <h3>${clientName}</h3>
            <p><strong>Telefone:</strong> (11) 98765-4321</p>
            <p><strong>Email:</strong> cliente@email.com</p>
            <p><strong>Pet:</strong> Rex - Golden Retriever</p>
            <p><strong>Serviço:</strong> Obediência Básica</p>
            <p><strong>Progresso:</strong> 1/10 sessões concluídas</p>
            <p><strong>Próxima sessão:</strong> 15/06/2025</p>
        </section>
    `;
    showModal(clientDetailsModal);
}

function editClient(clientName) {
    document.getElementById('formModalTitle').textContent = `Editar Cliente - ${clientName}`;
    showModal(clientFormModal);
}

addClientBtn?.addEventListener('click', () => {
    document.getElementById('formModalTitle').textContent = 'Adicionar Novo Cliente';
    showModal(clientFormModal);
});

// Modal close events
document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        hideModal(modal);
    });
});

document.getElementById('closeDetailsBtn')?.addEventListener('click', () => {
    hideModal(clientDetailsModal);
});

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
        }
    });
});

// Form tabs
const formTabBtns = document.querySelectorAll('.form-tab-btn');
const formTabContents = document.querySelectorAll('.form-tab-content');

formTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        
        // Remove active classes
        formTabBtns.forEach(b => b.classList.remove('active'));
        formTabContents.forEach(content => content.classList.remove('active'));
        
        // Add active classes
        btn.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
});

// Save client button
document.getElementById('saveClienteBtn')?.addEventListener('click', () => {
    alert('Cliente salvo com sucesso!');
    hideModal(clientFormModal);
});

// Pagination
const paginationBtns = document.querySelectorAll('.pagination-btn');
paginationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!btn.disabled && !btn.classList.contains('active')) {
            paginationBtns.forEach(b => b.classList.remove('active'));
            if (!btn.querySelector('i')) { // Not arrow button
                btn.classList.add('active');
            }
        }
    });
});

// Notification float
const notificationFloat = document.querySelector('.notification-float');
notificationFloat?.addEventListener('click', () => {
    alert('Você tem 3 notificações pendentes!');
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de clientes carregada');
});
