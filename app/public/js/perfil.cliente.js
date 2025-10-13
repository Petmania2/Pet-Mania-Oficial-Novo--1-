// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Modal Management
const editModal = document.getElementById('editModal');
const editProfileBtn = document.getElementById('editProfileBtn');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');

editProfileBtn?.addEventListener('click', () => {
    editModal.classList.add('active');
});

closeModal?.addEventListener('click', () => {
    editModal.classList.remove('active');
});

cancelBtn?.addEventListener('click', () => {
    editModal.classList.remove('active');
});

// Close modal when clicking outside
editModal?.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.classList.remove('active');
    }
});

// Form submission
const modalForm = document.querySelector('.modal-form');
modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    
    // Aqui você faria a requisição para o servidor
    console.log('Perfil atualizado:', { fullName, email, phone, location });
    
    // Fechar modal
    editModal.classList.remove('active');
    
    // Mostrar mensagem de sucesso (opcional)
    showNotification('Perfil atualizado com sucesso!', 'success');
});

// Add Pet Button
const addPetBtn = document.getElementById('addPetBtn');
addPetBtn?.addEventListener('click', () => {
    console.log('Abrir formulário para adicionar pet');
    // Você pode implementar um modal para adicionar pet
    showNotification('Funcionalidade de adicionar pet em desenvolvimento!', 'info');
});

// Pet Actions
const editPetBtns = document.querySelectorAll('.pet-card .btn-icon:not(.danger)');
const deletePetBtns = document.querySelectorAll('.pet-card .btn-icon.danger');

editPetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const petCard = e.currentTarget.closest('.pet-card');
        const petName = petCard.querySelector('.pet-name').textContent;
        console.log(`Editar pet: ${petName}`);
        showNotification(`Editando ${petName}...`, 'info');
    });
});

deletePetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const petCard = e.currentTarget.closest('.pet-card');
        const petName = petCard.querySelector('.pet-name').textContent;
        
        if (confirm(`Deseja remover ${petName}? Esta ação não pode ser desfeita.`)) {
            petCard.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                petCard.remove();
                showNotification(`${petName} removido com sucesso!`, 'success');
            }, 300);
        }
    });
});

// Session Actions
const sessionBtns = document.querySelectorAll('.session-footer .btn');
sessionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const btnText = e.currentTarget.textContent.trim();
        const sessionItem = e.currentTarget.closest('.session-item');
        const sessionName = sessionItem.querySelector('.session-header h3').textContent;
        
        if (btnText === 'Cancelar') {
            if (confirm(`Deseja cancelar a sessão "${sessionName}"?`)) {
                const status = sessionItem.querySelector('.session-status');
                status.textContent = 'Cancelado';
                status.className = 'session-status cancelled';
                showNotification('Sessão cancelada com sucesso!', 'success');
            }
        } else if (btnText === 'Remarcar') {
            console.log(`Remarcar: ${sessionName}`);
            showNotification('Abrindo ferramenta de remarcação...', 'info');
        } else if (btnText === 'Ver Detalhes') {
            console.log(`Ver detalhes: ${sessionName}`);
            showNotification('Carregando detalhes da sessão...', 'info');
        }
    });
});

// Preference Buttons
const preferenceBtns = document.querySelectorAll('.preference-card .btn-link');
preferenceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const preferenceCard = e.currentTarget.closest('.preference-card');
        const preferenceTitle = preferenceCard.querySelector('h3').textContent.trim();
        console.log(`Configurar: ${preferenceTitle}`);
        showNotification(`Abrindo configurações de ${preferenceTitle}...`, 'info');
    });
});

// Notification System
function showNotification(message, type = 'info') {
    // Remover notificações anteriores
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <section class="notification-content">
            <i class="fas fa-${getIconByType(type)}"></i>
            <span>${message}</span>
        </section>
        <button class="notification-close" aria-label="Fechar notificação">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getIconByType(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add fade-out animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
    
    .notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        z-index: 3000;
        animation: slideInRight 0.3s ease forwards;
        opacity: 0;
    }
    
    .notification.show {
        opacity: 1;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        color: #2c3e50;
    }
    
    .notification-success {
        border-left: 4px solid #2ecc71;
    }
    
    .notification-success .notification-content i {
        color: #2ecc71;
    }
    
    .notification-error {
        border-left: 4px solid #e74c3c;
    }
    
    .notification-error .notification-content i {
        color: #e74c3c;
    }
    
    .notification-info {
        border-left: 4px solid #3498db;
    }
    
    .notification-info .notification-content i {
        color: #3498db;
    }
    
    .notification-warning {
        border-left: 4px solid #f39c12;
    }
    
    .notification-warning .notification-content i {
        color: #f39c12;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        color: #999;
        cursor: pointer;
        padding: 0;
        transition: color 0.3s ease;
    }
    
    .notification-close:hover {
        color: #2c3e50;
    }
    
    @media (max-width: 768px) {
        .notification {
            bottom: 20px;
            right: 20px;
            left: 20px;
            width: auto;
        }
    }
`;
document.head.appendChild(style);

// Inicializar tooltips em elementos com data-tooltip
const tooltips = document.querySelectorAll('[data-tooltip]');
tooltips.forEach(element => {
    element.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    });
    
    element.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) tooltip.remove();
    });
});

// Log de inicialização
console.log('Página de perfil do cliente carregada com sucesso!');

// Event listeners para navegação
document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
        // Remover classe active de todos os links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Adicionar classe active ao link clicado
        this.classList.add('active');
    });
});