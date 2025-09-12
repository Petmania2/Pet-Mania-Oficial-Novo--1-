// Pet Mania - JavaScript Completo

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // NAVBAR FUNCTIONALITY
    // ============================================
    
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    menuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu when clicking on links
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuBtn.querySelector('i').classList.remove('fa-times');
            menuBtn.querySelector('i').classList.add('fa-bars');
        });
    });
    
    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // LOCATION SEARCH FUNCTIONALITY
    // ============================================
    
    const locationInput = document.getElementById('locationInput');
    const findLocationBtn = document.getElementById('findLocationBtn');
    const locationTags = document.querySelectorAll('.location-tag');
    const mapPlaceholder = document.querySelector('.map-placeholder');
    
    // Location search
    findLocationBtn.addEventListener('click', function() {
        const location = locationInput.value.trim();
        if (location) {
            searchLocation(location);
        } else {
            showNotification('Por favor, digite uma localização', 'warning');
        }
    });
    
    // Enter key search
    locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            findLocationBtn.click();
        }
    });
    
    // Popular location tags
    locationTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const location = this.textContent;
            locationInput.value = location;
            searchLocation(location);
        });
    });
    
    function searchLocation(location) {
        // Simulate search loading
        findLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
        findLocationBtn.disabled = true;
        
        // Update map placeholder
        mapPlaceholder.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <p>Carregando mapa...</p>
            <span>Buscando adestradores em ${location}</span>
        `;
        
        setTimeout(() => {
            // Simulate found trainers
            const trainersFound = Math.floor(Math.random() * 15) + 5;
            
            mapPlaceholder.innerHTML = `
                <i class="fas fa-map-marked-alt"></i>
                <p>Adestradores encontrados em ${location}</p>
                <span><strong>${trainersFound}</strong> profissionais disponíveis na sua região</span>
                <div style="margin-top: 15px;">
                    <button class="btn btn-primary" onclick="scrollToTrainers()">Ver Adestradores</button>
                </div>
            `;
            
            findLocationBtn.innerHTML = '<i class="fas fa-search"></i> Buscar';
            findLocationBtn.disabled = false;
            
            showNotification(`${trainersFound} adestradores encontrados em ${location}!`, 'success');
        }, 2000);
    }
    
    // ============================================
    // TRAINERS SEARCH AND FILTER
    // ============================================
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const cityFilter = document.getElementById('cityFilter');
    const priceFilter = document.getElementById('priceFilter');
    const trainingFilter = document.getElementById('trainingFilter');
    const trainersGrid = document.querySelector('.trainers-grid');
    
    // Search trainers
    searchBtn.addEventListener('click', function() {
        performSearch();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Filter change events
    [cityFilter, priceFilter, trainingFilter].forEach(filter => {
        filter.addEventListener('change', function() {
            applyFilters();
        });
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const trainerCards = document.querySelectorAll('.trainer-card');
        let visibleCount = 0;
        
        trainerCards.forEach(card => {
            const name = card.querySelector('.trainer-name').textContent.toLowerCase();
            const specialty = card.querySelector('.trainer-specialty').textContent.toLowerCase();
            
            if (searchTerm === '' || name.includes(searchTerm) || specialty.includes(searchTerm)) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (searchTerm && visibleCount === 0) {
            showNotification('Nenhum adestrador encontrado com esse termo', 'warning');
        } else if (searchTerm) {
            showNotification(`${visibleCount} adestrador(es) encontrado(s)`, 'success');
        }
    }
    
    function applyFilters() {
        const city = cityFilter.value;
        const price = priceFilter.value;
        const training = trainingFilter.value;
        const trainerCards = document.querySelectorAll('.trainer-card');
        let visibleCount = 0;
        
        trainerCards.forEach(card => {
            let shouldShow = true;
            
            // City filter
            if (city) {
                const location = card.querySelector('.trainer-location').textContent.toLowerCase();
                const cityMap = {
                    'sao-paulo': 'são paulo',
                    'rio-de-janeiro': 'rio de janeiro',
                    'belo-horizonte': 'belo horizonte',
                    'curitiba': 'curitiba'
                };
                if (!location.includes(cityMap[city])) {
                    shouldShow = false;
                }
            }
            
            // Price filter
            if (price && shouldShow) {
                const priceText = card.querySelector('.price-value').textContent;
                const priceValue = parseInt(priceText.replace(/[^\d]/g, ''));
                
                switch(price) {
                    case 'ate-100':
                        if (priceValue > 100) shouldShow = false;
                        break;
                    case '100-200':
                        if (priceValue < 100 || priceValue > 200) shouldShow = false;
                        break;
                    case '200-300':
                        if (priceValue < 200 || priceValue > 300) shouldShow = false;
                        break;
                    case 'acima-300':
                        if (priceValue <= 300) shouldShow = false;
                        break;
                }
            }
            
            // Training filter
            if (training && shouldShow) {
                const specialty = card.querySelector('.trainer-specialty').textContent.toLowerCase();
                const trainingMap = {
                    'obediencia-basica': 'obediência básica',
                    'comportamento': 'comportamento',
                    'truques': 'truques',
                    'agressividade': 'agressividade'
                };
                if (!specialty.includes(trainingMap[training])) {
                    shouldShow = false;
                }
            }
            
            if (shouldShow) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (visibleCount === 0) {
            showNotification('Nenhum adestrador encontrado com esses filtros', 'warning');
        }
    }
    
    // ============================================
    // TRAINER CARD INTERACTIONS
    // ============================================
    
    const trainerBtns = document.querySelectorAll('.trainer-btn');
    trainerBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const trainerCard = this.closest('.trainer-card');
            const trainerName = trainerCard.querySelector('.trainer-name').textContent;
            const trainerPrice = trainerCard.querySelector('.price-value').textContent;
            
            // Simulate booking process
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
            this.disabled = true;
            
            setTimeout(() => {
                showBookingModal(trainerName, trainerPrice);
                this.innerHTML = 'Agendar Sessão';
                this.disabled = false;
            }, 1500);
        });
    });
    
    // ============================================
    // SCROLL TO TOP BUTTON
    // ============================================
    
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ============================================
    // HERO ANIMATIONS
    // ============================================
    
    // Animate hero content on load
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroText && heroImage) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateX(-50px)';
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            heroText.style.transition = 'all 1s ease';
            heroImage.style.transition = 'all 1s ease';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateX(0)';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 500);
    }
    
    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.benefit-card, .trainer-card, .step');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545',
            info: '#17a2b8'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    function showBookingModal(trainerName, price) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        modalContent.innerHTML = `
            <h2 style="color: #333; margin-bottom: 1rem;">Agendar Sessão</h2>
            <p style="color: #666; margin-bottom: 1.5rem;">
                Você está agendando uma sessão com <strong>${trainerName}</strong>
            </p>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem;">
                <p><strong>Valor da sessão:</strong> ${price}</p>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn btn-primary confirm-booking">Confirmar Agendamento</button>
                <button class="btn btn-outline close-modal">Cancelar</button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 100);
        
        // Event listeners
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.querySelector('.confirm-booking').addEventListener('click', function() {
            showNotification('Agendamento confirmado! Entraremos em contato em breve.', 'success');
            closeModal();
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
        
        function closeModal() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    // ============================================
    // GLOBAL FUNCTIONS
    // ============================================
    
    window.scrollToTrainers = function() {
        const trainersSection = document.getElementById('trainers');
        const offsetTop = trainersSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    };
    
    // ============================================
    // FORM VALIDATIONS (for future forms)
    // ============================================
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validatePhone(phone) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    }
    
    // ============================================
    // PERFORMANCE OPTIMIZATIONS
    // ============================================
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ============================================
    // ANALYTICS TRACKING (placeholder)
    // ============================================
    
    function trackEvent(action, category, label) {
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
        // Here you would integrate with Google Analytics or other tracking service
    }
    
    // Track button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')) {
            const btnText = e.target.textContent.trim();
            trackEvent('click', 'button', btnText);
        }
    });
    
    console.log('Pet Mania JavaScript loaded successfully! 🐾');
    
    // FAVORITAR/DESFAVORITAR ADSTRADOR
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            const adestradorId = this.getAttribute('data-id');
            const isFavorito = this.getAttribute('data-favorito') === 'true';
            const situacao = isFavorito ? 'favorito' : 'favoritar';
            try {
                const response = await fetch(`/favoritar?id=${adestradorId}&situacao=${situacao}`);
                const result = await response.json();
                if (result.sucesso) {
                    this.setAttribute('data-favorito', (!isFavorito).toString());
                    const icon = this.querySelector('i');
                    if (!isFavorito) {
                        icon.classList.remove('fa-heart-o');
                        icon.classList.add('fa-heart');
                    } else {
                        icon.classList.remove('fa-heart');
                        icon.classList.add('fa-heart-o');
                    }
                }
            } catch (err) {
                showNotification('Erro ao favoritar/desfavoritar!', 'error');
            }
        });
    });
});

