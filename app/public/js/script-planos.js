// Script para a página de planos de adestrador (Pet Mania)
document.addEventListener('DOMContentLoaded', () => {
    // ======== FUNÇÕES GERAIS DA NAVEGAÇÃO ========
    
    // Variáveis globais - Navbar e navegação
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');
    const notifFloat = document.querySelector('.notification-float');

    // Toggle do menu mobile
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar em um link (mobile)
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // Adicionar classe 'scrolled' à navbar ao rolar
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Popup de notificação ao clicar no ícone de notificação
    if (notifFloat) {
        notifFloat.addEventListener('click', () => {
            // Simular redirecionamento para a página de mensagens
            window.location.href = 'mensagensadestrador.html';
        });
    }

    // Atualizar a data atual
    const currentDateElement = document.querySelector('.current-date');
    if (currentDateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const currentDate = new Date();
        currentDateElement.textContent = currentDate.toLocaleDateString('pt-BR', options);
    }

    // ======== FUNÇÕES ESPECÍFICAS DA PÁGINA DE PLANOS ========
    
    // Variáveis para o modal de pagamento
    const paymentModal = document.getElementById('paymentModal');
    const closeModal = document.getElementById('closeModal');
    const cancelPayment = document.getElementById('cancelPayment');
    const confirmPayment = document.getElementById('confirmPayment');
    const selectedPlan = document.getElementById('selectedPlan');
    const summaryPlan = document.getElementById('summaryPlan');
    const summaryPeriod = document.getElementById('summaryPeriod');
    const summaryPrice = document.getElementById('summaryPrice');

    // Variáveis para os formulários de pagamento
    const creditCardForm = document.getElementById('creditCardForm');
    const pixForm = document.getElementById('pixForm');
    const boletoForm = document.getElementById('boletoForm');

    // Variáveis para os botões de plano
    const planButtons = document.querySelectorAll('.btn-plan:not(.current-plan)');
    const renewButton = document.querySelector('.btn-renew');

    // Preços dos planos (mensal e anual)
    const planPrices = {
        'Bronze': { monthly: 49, annual: 539 },
        'Prata': { monthly: 89, annual: 979 },
        'Ouro': { monthly: 149, annual: 1639 }
    };

    // Toggle para os itens de FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');

    // Função: Atualizar o resumo de pagamento com base na seleção atual
    function updateSummary() {
        if (!summaryPlan || !summaryPeriod || !summaryPrice) return;
        
        const planType = summaryPlan.textContent;
        const periodType = document.querySelector('input[name="period"]:checked').value;
        
        // Atualizar o período no resumo
        summaryPeriod.textContent = periodType === 'monthly' ? 'Mensal' : 'Anual (1 mês grátis)';
        
        // Atualizar o preço
        const price = planPrices[planType][periodType];
        summaryPrice.textContent = `R$ ${price.toLocaleString('pt-BR')}${periodType === 'monthly' ? ',00' : ',00'}`;
    }

    // Abrir modal de pagamento ao clicar nos botões de plano
    planButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!paymentModal || !selectedPlan || !summaryPlan) return;
            
            // Obter o tipo de plano baseado na classe do card pai
            const planCard = button.closest('.plan-card');
            let planType = '';

            if (planCard.classList.contains('bronze-plan')) {
                planType = 'Bronze';
            } else if (planCard.classList.contains('silver-plan')) {
                planType = 'Prata';
            } else if (planCard.classList.contains('gold-plan')) {
                planType = 'Ouro';
            }

            // Atualizar o modal com informações do plano
            selectedPlan.textContent = planType;
            summaryPlan.textContent = planType;
            updateSummary();

            // Mostrar o modal
            paymentModal.classList.add('active');
        });
    });

    // Renovar plano atual
    if (renewButton && paymentModal && selectedPlan && summaryPlan) {
        renewButton.addEventListener('click', () => {
            selectedPlan.textContent = 'Bronze';
            summaryPlan.textContent = 'Bronze';
            updateSummary();
            paymentModal.classList.add('active');
        });
    }

    // Fechar o modal de pagamento
    if (closeModal && paymentModal) {
        closeModal.addEventListener('click', () => {
            paymentModal.classList.remove('active');
        });
    }

    if (cancelPayment && paymentModal) {
        cancelPayment.addEventListener('click', () => {
            paymentModal.classList.remove('active');
        });
    }

    // Confirmar pagamento
    if (confirmPayment && paymentModal) {
        confirmPayment.addEventListener('click', () => {
            // Simulação de processamento de pagamento
            confirmPayment.textContent = 'Processando...';
            confirmPayment.disabled = true;
            
            setTimeout(() => {
                // Adicionar mensagem de sucesso
                const modalBody = document.querySelector('.modal-body');
                const paymentOptions = document.querySelector('.payment-options');
                
                if (!modalBody || !paymentOptions) return;
                
                // Criar elemento de mensagem
                const messageDiv = document.createElement('div');
                messageDiv.className = 'payment-message success';
                messageDiv.innerHTML = '<p><i class="fas fa-check-circle"></i> Pagamento processado com sucesso! Seu plano foi atualizado.</p>';
                
                // Ocultar as opções de pagamento e mostrar a mensagem
                paymentOptions.style.display = 'none';
                modalBody.insertBefore(messageDiv, paymentOptions);
                
                // Mudar os botões do rodapé
                confirmPayment.style.display = 'none';
                cancelPayment.textContent = 'Fechar';
                
                // Atualizar a página após fechar
                cancelPayment.addEventListener('click', () => {
                    window.location.reload();
                });
                
            }, 2000);
        });
    }

    // Alternar entre períodos de pagamento (mensal/anual)
    const periodOptions = document.querySelectorAll('input[name="period"]');
    periodOptions.forEach(option => {
        option.addEventListener('change', updateSummary);
    });

    // Alternar entre métodos de pagamento
    if (creditCardForm && pixForm && boletoForm) {
        const paymentOptions = document.querySelectorAll('input[name="payment"]');
        paymentOptions.forEach(option => {
            option.addEventListener('change', () => {
                // Ocultar todos os formulários
                creditCardForm.classList.add('hidden');
                pixForm.classList.add('hidden');
                boletoForm.classList.add('hidden');
                
                // Mostrar apenas o formulário selecionado
                const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
                
                if (selectedMethod === 'credit') {
                    creditCardForm.classList.remove('hidden');
                } else if (selectedMethod === 'pix') {
                    pixForm.classList.remove('hidden');
                } else if (selectedMethod === 'boleto') {
                    boletoForm.classList.remove('hidden');
                }
            });
        });
    }

    // Abrir/fechar perguntas do FAQ
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Fechar todas as perguntas
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Abrir apenas a pergunta clicada, se não estava aberta
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // Funcionalidade do botão de cópia para o Pix
    const btnCopy = document.querySelector('.btn-copy');
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            const pixKeyInput = document.querySelector('.pix-key input');
            if (!pixKeyInput) return;
            
            pixKeyInput.select();
            document.execCommand('copy');
            
            // Feedback visual
            btnCopy.textContent = 'Copiado!';
            setTimeout(() => {
                btnCopy.textContent = 'Copiar';
            }, 2000);
        });
    }

    // Verificar se há FAQ e abrir o primeiro por padrão
    if (faqQuestions.length > 0) {
        faqQuestions[0].click();
    }
});