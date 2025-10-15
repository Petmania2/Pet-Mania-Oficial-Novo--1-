// ===================================
// MENU MOBILE GLOBAL - PET MANIA
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Selecionar todos os possíveis botões de menu
    const menuToggles = document.querySelectorAll(
        '#mobileToggle, #menuBtn, .mobile-toggle, .mobile-menu-btn, .hamburger-menu'
    );
    
    // Selecionar todos os possíveis menus
    const menus = document.querySelectorAll(
        '#navMenu, .nav-menu, .nav-links, #navLinks'
    );
    
    // Adicionar evento de clique em todos os botões encontrados
    menuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle em todos os menus
            menus.forEach(menu => {
                menu.classList.toggle('active');
            });
            
            // Toggle no próprio botão
            this.classList.toggle('active');
            
            // Prevenir scroll do body quando menu aberto
            if (document.querySelector('.nav-menu.active, .nav-links.active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-link, .nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menus.forEach(menu => {
                menu.classList.remove('active');
            });
            menuToggles.forEach(toggle => {
                toggle.classList.remove('active');
            });
            document.body.style.overflow = '';
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        const isMenuClick = Array.from(menuToggles).some(toggle => toggle.contains(e.target));
        const isMenuContent = Array.from(menus).some(menu => menu.contains(e.target));
        
        if (!isMenuClick && !isMenuContent) {
            menus.forEach(menu => {
                menu.classList.remove('active');
            });
            menuToggles.forEach(toggle => {
                toggle.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    });
    
    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            menus.forEach(menu => {
                menu.classList.remove('active');
            });
            menuToggles.forEach(toggle => {
                toggle.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    });
    
    // Garantir que botão hambúrguer seja visível em mobile
    if (window.innerWidth <= 1024) {
        menuToggles.forEach(toggle => {
            toggle.style.display = 'block';
        });
    }
});
