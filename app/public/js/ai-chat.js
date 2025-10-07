class AIChat {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createChatElements();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatElements() {
        // Botão do chat
        const chatButton = document.createElement('button');
        chatButton.className = 'ai-chat-button';
        chatButton.innerHTML = '<i class="fas fa-robot"></i>';
        chatButton.title = 'Chat com PetBot - Clique para conversar!';
        document.body.appendChild(chatButton);

        // Container do chat
        const chatContainer = document.createElement('div');
        chatContainer.className = 'ai-chat-container';
        chatContainer.innerHTML = `
            <div class="ai-chat-header">
                <h3><i class="fas fa-robot"></i> PetBot</h3>
                <div class="chat-status" id="chatStatus" title="Online"></div>
                <button class="ai-chat-close" title="Fechar chat"><i class="fas fa-times"></i></button>
            </div>
            <div class="ai-chat-messages" id="chatMessages"></div>
            <div class="ai-chat-input-container">
                <input type="text" class="ai-chat-input" id="chatInput" placeholder="Digite sua pergunta..." maxlength="500">
                <button class="ai-chat-send" id="chatSend" title="Enviar mensagem"><i class="fas fa-paper-plane"></i></button>
            </div>
        `;
        document.body.appendChild(chatContainer);

        this.chatButton = chatButton;
        this.chatContainer = chatContainer;
        this.messagesContainer = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('chatSend');
        this.statusIndicator = document.getElementById('chatStatus');
        
        // Verificar status da conexão
        this.checkConnectionStatus();
    }

    bindEvents() {
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.chatContainer.querySelector('.ai-chat-close').addEventListener('click', () => this.closeChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Detectar quando o usuário está digitando
        this.chatInput.addEventListener('input', () => {
            this.updateSendButtonState();
        });
        
        // Fechar chat ao clicar fora
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatContainer.contains(e.target) && !this.chatButton.contains(e.target)) {
                this.closeChat();
            }
        });
        
        // Verificar conexão periodicamente
        setInterval(() => this.checkConnectionStatus(), 30000);
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.chatContainer.classList.add('open');
        this.isOpen = true;
        
        setTimeout(() => {
            this.chatInput.focus();
            this.updateSendButtonState();
        }, 300);
    }

    closeChat() {
        this.chatContainer.classList.remove('open');
        this.isOpen = false;
    }

    addWelcomeMessage() {
        const welcomeMessage = '🐾 Olá! Sou o PetBot da Pet Mania!\n\nPosso ajudar com:\n• Cadastros\n• Buscar adestradores\n• Planos e pagamentos\n\nComo posso ajudar?';
        this.addMessage(welcomeMessage, 'ai');
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
        
        // Processar texto com emojis e quebras de linha
        let processedText = text.replace(/\n/g, '<br>');
        
        // Adicionar timestamp
        const timestamp = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">${processedText}</div>
            <div class="message-time" style="font-size: 10px; opacity: 0.7; margin-top: 4px;">${timestamp}</div>
        `;
        
        // Adicionar animação de nova mensagem
        messageDiv.classList.add('new-message');
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Remover classe de animação após a animação
        setTimeout(() => {
            messageDiv.classList.remove('new-message');
        }, 500);
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    updateSendButtonState() {
        const hasText = this.chatInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText;
        this.sendButton.style.opacity = hasText ? '1' : '0.5';
    }
    
    async checkConnectionStatus() {
        try {
            const response = await fetch('/chat/test', { method: 'GET' });
            if (response.ok) {
                this.statusIndicator.className = 'chat-status';
                this.statusIndicator.title = 'Online - Chat funcionando';
            } else {
                throw new Error('Servidor indisponível');
            }
        } catch (error) {
            this.statusIndicator.className = 'chat-status offline';
            this.statusIndicator.title = 'Offline - Problemas de conexão';
        }
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        console.log('Enviando mensagem:', message);
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        this.addTypingIndicator();
        this.chatInput.disabled = true;
        this.sendButton.disabled = true;

        try {
            console.log('Fazendo request para /chat/send');
            const response = await fetch('/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            this.removeTypingIndicator();

            if (data.success && data.reply && data.reply.message) {
                this.addMessage(data.reply.message, 'ai');
                
                if (this.messagesContainer.children.length === 4) {
                    setTimeout(() => this.showQuickReplies(), 1000);
                }
            } else {
                console.error('Resposta inválida:', data);
                this.addMessage('❌ Desculpe, não consegui processar sua mensagem. Tente novamente!', 'ai');
            }
        } catch (error) {
            console.error('Erro no chat:', error);
            this.removeTypingIndicator();
            this.addMessage('🔌 Erro de conexão. Verifique sua internet e tente novamente.\n\n📞 Para suporte: (11) 9999-8888', 'ai');
        } finally {
            this.chatInput.disabled = false;
            this.sendButton.disabled = false;
            this.chatInput.focus();
        }
    }
    
    addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '🤖 PetBot está digitando...';
        
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    showQuickReplies() {
        const quickReplies = [
            { text: '🐶 Cadastrar como cliente', action: 'cadastrar cliente' },
            { text: '🎓 Ser adestrador', action: 'cadastrar adestrador' },
            { text: '🔍 Buscar adestradores', action: 'buscar adestrador' },
            { text: '💳 Ver planos', action: 'planos' }
        ];
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'chat-buttons';
        
        quickReplies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'chat-option-button';
            button.textContent = reply.text;
            button.onclick = () => {
                this.chatInput.value = reply.action;
                this.sendMessage();
                buttonsContainer.remove();
            };
            buttonsContainer.appendChild(button);
        });
        
        this.messagesContainer.appendChild(buttonsContainer);
        this.scrollToBottom();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIChat();
});