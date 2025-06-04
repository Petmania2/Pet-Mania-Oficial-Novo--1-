// Script para o Painel do Adestrador - Pet Mania
document.addEventListener('DOMContentLoaded', function() {
    
    // Menu Mobile
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });

    // Ações dos agendamentos
    const appointmentActions = document.querySelectorAll('.appointment-actions button');
    appointmentActions.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const appointmentItem = this.closest('.appointment-item');
            const clientName = appointmentItem.querySelector('h4').textContent.split(' ')[0];
            
            if (this.querySelector('.fa-check')) {
                // Confirmar agendamento
                appointmentItem.style.background = '#e8f5e8';
                appointmentItem.style.borderLeft = '4px solid #28a745';
                this.innerHTML = '<i class="fas fa-check-circle"></i>';
                this.style.background = '#28a745';
                showNotification(`Agendamento com ${clientName} confirmado!`, 'success');
            } else if (this.querySelector('.fa-times')) {
                // Cancelar agendamento
                if (confirm(`Deseja cancelar o agendamento com ${clientName}?`)) {
                    // Animação de saída
                    appointmentItem.style.transition = 'all 0.3s ease';
                    appointmentItem.style.transform = 'translateX(-100%)';
                    appointmentItem.style.opacity = '0';
                    
                    // Remover o elemento após a animação
                    setTimeout(() => {
                        appointmentItem.remove();
                    }, 300);
                    
                    showNotification(`Agendamento com ${clientName} cancelado!`, 'error');
                }
            }
        });
    });

    // Marcar mensagens como lidas
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('unread')) {
                this.classList.remove('unread');
                this.style.background = '#f8f9fa';
                
                // Atualizar contador de notificações
                const notifBadges = document.querySelectorAll('.notif-badge, .notif-count');
                notifBadges.forEach(badge => {
                    const currentCount = parseInt(badge.textContent);
                    if (currentCount > 0) {
                        badge.textContent = currentCount - 1;
                        if (currentCount - 1 === 0) {
                            badge.style.display = 'none';
                        }
                    }
                });
                
                showNotification('Mensagem marcada como lida!', 'info');
            }
        });
    });

    // Seletor de período das estatísticas
    const periodSelector = document.querySelector('.period-selector');
    if (periodSelector) {
        periodSelector.addEventListener('change', function() {
            const chartBars = document.querySelectorAll('.chart-bar');
            
            // Simular mudança de dados do gráfico
            chartBars.forEach(bar => {
                const randomHeight = Math.floor(Math.random() * 80) + 20;
                bar.style.height = randomHeight + '%';
                bar.style.transition = 'height 0.5s ease';
            });
            
            showNotification(`Estatísticas atualizadas para: ${this.value}`, 'info');
        });
    }

    // Botão de notificação flutuante
    const notificationFloat = document.querySelector('.notification-float');
    if (notificationFloat) {
        notificationFloat.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            
            // Mostrar painel de notificações
            showNotificationPanel();
        });
    }

    // Atualizar data atual
    updateCurrentDate();

    // Animações de entrada
    animateCards();

    // Auto-refresh dos dados a cada 30 segundos
    setInterval(updateDashboardData, 30000);
});

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('section');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover automaticamente após 4 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
    
    // Botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Ícones para diferentes tipos de notificação
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

// Painel de notificações
function showNotificationPanel() {
    const existingPanel = document.querySelector('.notification-panel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }
    
    const panel = document.createElement('section');
    panel.className = 'notification-panel';
    panel.innerHTML = `
        <h3><i class="fas fa-bell"></i> Notificações</h3>
        <section class="notification-list">
            <section class="notification-item">
                <i class="fas fa-calendar text-primary"></i>
                <span>Novo agendamento solicitado por Ana Costa</span>
                <small>Há 5 minutos</small>
            </section>
            <section class="notification-item">
                <i class="fas fa-star text-warning"></i>
                <span>Nova avaliação de 5 estrelas recebida</span>
                <small>Há 15 minutos</small>
            </section>
            <section class="notification-item">
                <i class="fas fa-message text-info"></i>
                <span>2 novas mensagens não lidas</span>
                <small>Há 1 hora</small>
            </section>
        </section>
        <button class="btn btn-small" onclick="this.parentElement.remove()">Fechar</button>
    `;
    
    document.body.appendChild(panel);
    setTimeout(() => panel.classList.add('show'), 100);
}

// Atualizar data atual
function updateCurrentDate() {
    const dateElement = document.querySelector('.current-date');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = now.toLocaleDateString('pt-BR', options);
        dateElement.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
}

// Animar cards na entrada
function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Simular atualização de dados
function updateDashboardData() {
    // Atualizar visitas ao perfil (simulação)
    const visitsElement = document.querySelector('.summary-card:last-child .card-number');
    if (visitsElement) {
        const currentVisits = parseInt(visitsElement.textContent);
        const newVisits = currentVisits + Math.floor(Math.random() * 5);
        visitsElement.textContent = newVisits.toString();
    }
    
    // Simular nova mensagem ocasionalmente
    if (Math.random() < 0.3) {
        const notifBadges = document.querySelectorAll('.notif-badge, .notif-count');
        notifBadges.forEach(badge => {
            const currentCount = parseInt(badge.textContent) || 0;
            badge.textContent = currentCount + 1;
            badge.style.display = 'inline';
        });
        
        showNotification('Nova mensagem recebida!', 'info');
    }
}

// Adicionar estilos CSS para as notificações
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
}

.notification.show {
    transform: translateX(0);
}

.notification-success { border-left: 4px solid #28a745; }
.notification-error { border-left: 4px solid #dc3545; }
.notification-info { border-left: 4px solid #17a2b8; }
.notification-warning { border-left: 4px solid #ffc107; }

.notification-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    margin-left: auto;
}

.notification-panel {
    position: fixed;
    top: 80px;
    right: 20px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    z-index: 1000;
    width: 350px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
}

.notification-panel.show {
    transform: translateX(0);
}

.notification-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
}

.notification-item:last-child {
    border-bottom: none;
}

.notification-float.clicked {
    transform: scale(0.95);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);