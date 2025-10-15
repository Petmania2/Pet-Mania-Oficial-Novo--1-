// Navigation Active State
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Remove active from all links except logout
        if (!link.classList.contains('nav-link-logout')) {
            navLinks.forEach(l => {
                if (!l.classList.contains('nav-link-logout')) {
                    l.classList.remove('active');
                }
            });
            link.classList.add('active');
        }
    });
});

// Carousel Functionality
const carousel = document.getElementById('trainersCarousel');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
let currentPosition = 0;
let cardWidth = 0;
let visibleCards = 3;

function updateCarouselSettings() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 768) {
        visibleCards = 1;
        // Disable carousel controls on mobile
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        carousel.style.transform = 'translateX(0)';
        return;
    } else if (screenWidth < 1200) {
        visibleCards = 2;
    } else {
        visibleCards = 3;
    }
    
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
    
    const cards = carousel.querySelectorAll('.trainer-card');
    if (cards.length > 0) {
        const firstCard = cards[0];
        const cardStyle = window.getComputedStyle(firstCard);
        const gap = parseFloat(window.getComputedStyle(carousel).gap);
        cardWidth = firstCard.offsetWidth + gap;
    }
}

function updateCarousel() {
    carousel.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
    updateButtons();
}

function updateButtons() {
    const cards = carousel.querySelectorAll('.trainer-card');
    const maxPosition = Math.max(0, cards.length - visibleCards);
    
    prevBtn.disabled = currentPosition <= 0;
    nextBtn.disabled = currentPosition >= maxPosition;
    
    prevBtn.style.opacity = currentPosition <= 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentPosition >= maxPosition ? '0.5' : '1';
    prevBtn.style.cursor = currentPosition <= 0 ? 'not-allowed' : 'pointer';
    nextBtn.style.cursor = currentPosition >= maxPosition ? 'not-allowed' : 'pointer';
}

prevBtn.addEventListener('click', () => {
    if (currentPosition > 0) {
        currentPosition--;
        updateCarousel();
    }
});

nextBtn.addEventListener('click', () => {
    const cards = carousel.querySelectorAll('.trainer-card');
    const maxPosition = cards.length - visibleCards;
    
    if (currentPosition < maxPosition) {
        currentPosition++;
        updateCarousel();
    }
});

// Initialize carousel on load
updateCarouselSettings();
updateButtons();

// Update on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        currentPosition = 0;
        updateCarouselSettings();
        updateCarousel();
    }, 250);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Animate cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.summary-card, .trainer-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add click handlers to view profile buttons
const viewProfileBtns = document.querySelectorAll('.btn-view-profile');
viewProfileBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const trainerName = btn.closest('.trainer-card').querySelector('.trainer-name').textContent;
        alert(`Abrindo perfil de ${trainerName}...`);
        // Aqui você pode redirecionar para a página de perfil do adestrador
        // window.location.href = `/adestrador/${trainerId}`;
    });
});

// Update user name dynamically
function updateUserName(name) {
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = name;
    }
}

// Load user data on page load
window.addEventListener('DOMContentLoaded', () => {
    // Simulate fetching user data
    // Em produção, isso seria uma chamada de API
    const userData = {
        name: 'João Silva',
        nearbyTrainers: 12,
        newMessages: 3,
        scheduledSessions: 2,
        pendingReviews: 1
    };
    
    updateUserName(userData.name);
    
    // Update dashboard numbers
    const cardNumbers = document.querySelectorAll('.card-number');
    if (cardNumbers.length >= 4) {
        cardNumbers[0].textContent = userData.nearbyTrainers;
        cardNumbers[1].textContent = userData.newMessages;
        cardNumbers[2].textContent = userData.scheduledSessions;
        cardNumbers[3].textContent = userData.pendingReviews;
    }
    
    // Update badge
    const badge = document.querySelector('.badge');
    if (badge && userData.newMessages > 0) {
        badge.textContent = userData.newMessages;
    } else if (badge) {
        badge.style.display = 'none';
    }
});

// Navbar scroll effect (opcional)
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
    } else {
        navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
});