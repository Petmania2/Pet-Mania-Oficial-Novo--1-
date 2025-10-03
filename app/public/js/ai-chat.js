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
        chatButton.title = 'Chat com PetBot';
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
                <input type="text" class="ai-chat-input" id="chatInput" placeholder="Digite sua pergunta...">
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
        const welcomeMessage = '🐾 Olá! Sou o PetBot da Pet Mania!\n\nPosso ajudar com:\n• Cadastros\n• Buscar adestradores\n• Planos e pagamentos\n\nComo posso ajudar?';
        this.addMessage(welcomeMessage, 'ai');
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
        messageDiv.innerHTML = text.replace(/\n/g, '<br>');
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        this.chatInput.disabled = true;
        this.sendButton.disabled = true;

        try {
            const response = await fetch('/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();

            if (data.success) {
                this.addMessage(data.reply.message, 'ai');
            } else {
                this.addMessage('Erro ao processar mensagem.', 'ai');
            }
        } catch (error) {
            this.addMessage('Erro de conexão.', 'ai');
        } finally {
            this.chatInput.disabled = false;
            this.sendButton.disabled = false;
            this.chatInput.focus();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIChat();
});