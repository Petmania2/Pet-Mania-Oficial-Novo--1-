// ============ DROPDOWN MENU ============
const avatarBtn = document.getElementById('avatarBtn');
const dropdownMenu = document.getElementById('dropdownMenu');

avatarBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.avatar-menu')) {
        dropdownMenu.classList.remove('active');
    }
});

// ============ CAROUSEL NAVIGATION ============
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carousel = document.querySelector('.trainers-carousel');

prevBtn.addEventListener('click', () => {
    carousel.scrollBy({
        left: -300,
        behavior: 'smooth'
    });
});

nextBtn.addEventListener('click', () => {
    carousel.scrollBy({
        left: 300,
        behavior: 'smooth'
    });
});

// ============ FAVORITE BUTTONS ============
const favoriteButtons = document.querySelectorAll('.favorite-btn');

favoriteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.classList.toggle('active');
        
        // Feedback visual
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 300);
    });
});

// ============ MESSAGE CARDS ============
const messageCards = document.querySelectorAll('.message-card');

messageCards.forEach(card => {
    card.addEventListener('click', () => {
        const trainerName = card.querySelector('.message-header h3').textContent;
        console.log(`Abrir conversa com ${trainerName}`);
        // Aqui você poderia redirecionar para a página de mensagens
    });
});

// ============ PET ACTIONS ============
const deleteButtons = document.querySelectorAll('.btn-icon.delete');
const editButtons = document.querySelectorAll('.btn-icon:not(.delete)');

deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const petName = btn.closest('.pet-card').querySelector('h3').textContent;
        
        if (confirm(`Deseja deletar ${petName}?`)) {
            btn.closest('.pet-card').style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                btn.closest('.pet-card').remove();
            }, 300);
        }
    });
});

editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const petName = btn.closest('.pet-card').querySelector('h3').textContent;
        console.log(`Editar ${petName}`);
        // Aqui você poderia abrir um modal para editar o pet
    });
});

// ============ ADD PET ============
const addPetCard = document.querySelector('.add-pet');

addPetCard.addEventListener('click', () => {
    console.log('Abrir modal para adicionar novo pet');
    // Aqui você poderia abrir um modal ou redirecionar para a página de adicionar pet
});

// ============ BUTTONS WITH FEEDBACK ============
const allButtons = document.querySelectorAll('a[class*="btn"]');

allButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.href === '#') {
            e.preventDefault();
            console.log(`Botão clicado: ${this.textContent.trim()}`);
        }
    });
});

// ============ NAVBAR SCROLL EFFECT ============
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.08)';
    }

    lastScrollTop = scrollTop;
});

// ============ LOGOUT ============
const logoutBtn = document.querySelector('.dropdown-item.logout');

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (confirm('Deseja fazer logout?')) {
        // Aqui você faria a chamada para a API de logout
        console.log('Logout realizado');
        // window.location.href = '/logout';
    }
});

// ============ NOTIFICATION BUTTON ============
const notificationBtn = document.getElementById('notificationBtn');

notificationBtn.addEventListener('click', () => {
    console.log('Abrir notificações');
    // Aqui você poderia abrir um painel de notificações
    notificationBtn.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        notificationBtn.style.animation = 'none';
    }, 500);
});

// ============ ANIMATIONS ============
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-20px);
        }
    }

    @keyframes shake {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ============ SMOOTH SCROLL ANIMATION ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.trainer-card-compact, .pet-card, .tip-card, .favorite-card, .message-card').forEach(el => {
    observer.observe(el);
});

// ============ TRAINER CARD CLICK ============
const trainerCardsCompact = document.querySelectorAll('.trainer-card-compact');

trainerCardsCompact.forEach(card => {
    const profileBtn = card.querySelector('.btn-outline-small');
    const messageBtn = card.querySelector('.btn-primary-small');

    profileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const trainerName = card.querySelector('h3').textContent;
        console.log(`Abrir perfil de ${trainerName}`);
        // Aqui você redirecionaria para o perfil do adestrador
    });

    messageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const trainerName = card.querySelector('h3').textContent;
        console.log(`Enviar mensagem para ${trainerName}`);
        // Aqui você abriria a conversa com o adestrador
    });
});

// ============ READ MORE LINKS ============
const readMoreLinks = document.querySelectorAll('.read-more');

readMoreLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tipTitle = link.closest('.tip-card').querySelector('h3').textContent;
        console.log(`Ler mais sobre: ${tipTitle}`);
        // Aqui você redirecionaria para o artigo completo
    });
});

// ============ FORM INTERACTIONS ============
function addFormValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#FFA500';
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = '#e0e0e0';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    addFormValidation();
    console.log('Home do Cliente carregada com sucesso!');
});

// ============ RESPONSIVE MENU ============
function handleResponsive() {
    const width = window.innerWidth;
    
    if (width <= 768) {
        // Comportamento móvel
        carousel.addEventListener('scroll', () => {
            prevBtn.style.display = carousel.scrollLeft === 0 ? 'none' : 'flex';
        });
    }
}

window.addEventListener('resize', handleResponsive);
handleResponsive();

// ============ UTILITY FUNCTIONS ============
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}