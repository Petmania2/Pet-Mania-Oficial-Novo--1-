class AIChat {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
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
        chatButton.title = 'Chat com PetBot - Assistente Virtual';
        document.body.appendChild(chatButton);

        // Container do chat
        const chatContainer = document.createElement('div');
        chatContainer.className = 'ai-chat-container';
        chatContainer.innerHTML = `
            <div class="ai-chat-header">
                <h3><i class="fas fa-robot"></i> PetBot</h3>
                <button class="ai-chat-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="ai-chat-messages" id="chatMessages"></div>
            <div class="ai-chat-input-container">
                <input type="text" class="ai-chat-input" id="chatInput" placeholder="Digite sua pergunta sobre pets...">
                <button class="ai-chat-send" id="chatSend"><i class="fas fa-paper-plane"></i></button>
            </div>
        `;
        document.body.appendChild(chatContainer);

        this.chatButton = chatButton;
        this.chatContainer = chatContainer;
        this.messagesContainer = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('chatSend');
    }

    bindEvents() {
        this.chatButton.addEventListener('click', () => this.toggleChat());
        
        this.chatContainer.querySelector('.ai-chat-close').addEventListener('click', () => this.closeChat());
        
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
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
        this.chatInput.focus();
    }

    closeChat() {
        this.chatContainer.classList.remove('open');
        this.isOpen = false;
    }

    addWelcomeMessage() {
        const welcomeMessage = '🐾 Olá! Sou o PetBot da Pet Mania! Posso ajudar com dúvidas sobre adestramento, comportamento canino e como usar nossa plataforma. Como posso ajudar você hoje?';
        this.addMessage(welcomeMessage, 'ai');
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
        messageDiv.textContent = text;
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Adicionar mensagem do usuário
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        // Desabilitar input
        this.chatInput.disabled = true;
        this.sendButton.disabled = true;
        
        // Mostrar indicador de digitação
        this.showTypingIndicator();

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    history: this.conversationHistory
                })
            });

            const data = await response.json();
            
            this.hideTypingIndicator();

            if (data.success) {
                this.addMessage(data.message, 'ai');
                
                // Atualizar histórico
                this.conversationHistory.push(
                    { role: 'user', content: message },
                    { role: 'assistant', content: data.message }
                );
                
                // Manter apenas últimas 10 mensagens
                if (this.conversationHistory.length > 20) {
                    this.conversationHistory = this.conversationHistory.slice(-20);
                }
            } else {
                this.addMessage(data.message || 'Desculpe, ocorreu um erro. Tente novamente.', 'ai');
            }
        } catch (error) {
            console.error('Erro no chat:', error);
            this.hideTypingIndicator();
            this.addMessage('Desculpe, não consegui processar sua mensagem. Tente novamente.', 'ai');
        } finally {
            // Reabilitar input
            this.chatInput.disabled = false;
            this.sendButton.disabled = false;
            this.chatInput.focus();
        }
    }
}

// Inicializar chat quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new AIChat();
});