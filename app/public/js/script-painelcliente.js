// Script para o painel do cliente
document.addEventListener('DOMContentLoaded', function() {
    
    // Função de logout
    window.logout = function() {
        if (confirm('Tem certeza que deseja sair?')) {
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    window.location.href = '/';
                } else {
                    alert('Erro ao fazer logout');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                // Redirecionar mesmo com erro
                window.location.href = '/';
            });
        }
    };
    
    // Navegação do menu mobile
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Fechar menu mobile ao clicar em um link
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Cards de ação
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const link = card.querySelector('a');
            if (link) {
                window.location.href = link.href;
            }
        });
    });
    
    console.log('Painel do cliente carregado com sucesso!');
});