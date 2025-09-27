// Script simplificado para a página de planos
document.addEventListener('DOMContentLoaded', () => {
    // Navegação mobile
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Atualizar data atual
    const currentDateElement = document.querySelector('.current-date');
    if (currentDateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const currentDate = new Date();
        currentDateElement.textContent = currentDate.toLocaleDateString('pt-BR', options);
    }

    // FAQ toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Fechar todas
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Abrir apenas a clicada
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // Sistema de pagamento simplificado - já implementado no HTML da página
    console.log('Script de planos carregado com sucesso');
});