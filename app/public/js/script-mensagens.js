// DOM Elements
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const searchContacts = document.getElementById('searchContacts');
const contactItems = document.querySelectorAll('.contact-item');
const chatMessages = document.getElementById('chatMessages');
const chatContactName = document.getElementById('chatContactName');
const sidebarContactName = document.getElementById('sidebarContactName');
const contactPet = document.getElementById('contactPet');
const nextSession = document.getElementById('nextSession');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const attachBtn = document.getElementById('attachBtn');
const fileUploadDialog = document.getElementById('fileUploadDialog');
const closeFileDialog = document.getElementById('closeFileDialog');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');
const closeEmojiPicker = document.getElementById('closeEmojiPicker');
const emojis = document.querySelectorAll('.emoji');
const contactInfoSidebar = document.getElementById('contactInfoSidebar');
const infoBtn = document.querySelector('.chat-actions .btn-icon:nth-child(3)');
const closeContactInfo = document.getElementById('closeContactInfo');
const fileUploadOptions = document.querySelectorAll('.file-upload-option');

// Contacts and messages data
const contactsData = {
    amanda: {
        name: "Amanda Silva",
        avatar: "https://i.pravatar.cc/150?img=5",
        pet: "Rex - Golden Retriever, 2 anos",
        nextSession: "29/02/2025 - 09:00",
        status: "online",
        messages: [
            { type: "date", content: "Hoje" },
            { type: "received", content: "Olá Carlos! Como vai?", time: "14:20" },
            { type: "sent", content: "Olá Amanda! Tudo bem e contigo?", time: "14:22" },
            { type: "received", content: "Tudo ótimo! Estou ansiosa para nossa sessão amanhã com o Rex.", time: "14:25" },
            { type: "sent", content: "Eu também estou animado! O Rex tem mostrado muito progresso.", time: "14:28" },
            { type: "received", content: "Sim! Ele já está atendendo melhor aos comandos básicos que você ensinou.", time: "14:30" },
            { type: "received", content: "Olá Carlos, estou ansiosa para nossa sessão amanhã! Gostaria de saber se preciso levar algum item especial para o treinamento ou se você irá fornecer tudo?", time: "14:32" }
        ]
    },
    rodrigo: {
        name: "Rodrigo Alves",
        avatar: "https://i.pravatar.cc/150?img=8",
        pet: "Thor - Husky Siberiano, 8 meses",
        nextSession: "02/03/2025 - 15:00",
        status: "online",
        messages: [
            { type: "date", content: "Hoje" },
            { type: "received", content: "Bom dia! Gostaria de agendar uma avaliação para o meu filhote de Husky. Ele tem 8 meses e está com alguns problemas de comportamento.", time: "11:15" },
            { type: "sent", content: "Bom dia, Rodrigo! Claro, podemos marcar uma avaliação. Quais são os comportamentos que te preocupam?", time: "11:20" },
            { type: "received", content: "Ele está mordendo muito os móveis da casa e puxando muito forte na coleira durante os passeios.", time: "11:23" },
            { type: "sent", content: "Entendo. Esses são comportamentos comuns em filhotes de Husky, mas podemos trabalhar para corrigi-los. Tenho disponibilidade na próxima segunda-feira às 15h, seria bom para você?", time: "11:30" },
            { type: "received", content: "Segunda às 15h seria perfeito! Obrigado pela disponibilidade.", time: "11:35" }
        ]
    },
    mariana: {
        name: "Mariana Costa",
        avatar: "https://i.pravatar.cc/150?img=9",
        pet: "Max - Labrador, 3 anos",
        nextSession: "03/03/2025 - 10:00",
        status: "offline",
        messages: [
            { type: "date", content: "Ontem" },
            { type: "received", content: "Boa tarde, Carlos! Como foi seu dia?", time: "16:30" },
            { type: "sent", content: "Boa tarde, Mariana! Meu dia foi produtivo, tive várias sessões. E o seu?", time: "16:45" },
            { type: "received", content: "Foi bom também! O Max está praticando os exercícios que você recomendou.", time: "17:00" },
            { type: "sent", content: "Excelente! É importante manter a consistência nos exercícios.", time: "17:15" },
            { type: "received", content: "Muito obrigada pela última sessão! O comportamento do Max já melhorou bastante. Ele está respondendo bem ao comando de 'ficar' e já não pula mais nas visitas.", time: "18:45" }
        ]
    },
    fernanda: {
        name: "Fernanda Lima",
        avatar: "https://i.pravatar.cc/150?img=26",
        pet: "Nina - Shih Tzu, 1 ano",
        nextSession: "05/03/2025 - 14:00",
        status: "away",
        messages: [
            { type: "date", content: "27/02/2025" },
            { type: "received", content: "Olá Carlos! Espero que esteja bem.", time: "10:15" },
            { type: "sent", content: "Olá Fernanda! Estou bem sim, obrigado. Como posso ajudar?", time: "10:30" },
            { type: "received", content: "A Nina está tendo problemas para se adaptar à caixa de transporte. Tem alguma dica?", time: "10:45" },
            { type: "sent", content: "Sim! É importante associar a caixa a experiências positivas. Deixe a caixa aberta em casa com brinquedos e petiscos dentro. Assim ela vai se acostumar gradualmente.", time: "11:00" },
            { type: "received", content: "Consegui aplicar as técnicas que você ensinou e meu cachorro está cada vez mais obediente. A Nina já está entrando voluntariamente na caixa de transporte após apenas três dias de treinamento com petiscos!", time: "14:20" }
        ]
    },
    carlos: {
        name: "Carlos Eduardo",
        avatar: "https://i.pravatar.cc/150?img=15",
        pet: "Rocky - Boxer, 4 anos",
        nextSession: "06/03/2025 - 16:30",
        status: "online",
        messages: [
            { type: "date", content: "25/02/2025" },
            { type: "received", content: "Olá! Vi que você é especialista em problemas comportamentais.", time: "09:10" },
            { type: "sent", content: "Bom dia! Sim, trabalho principalmente com casos de agressividade, ansiedade e problemas de socialização. Em que posso ajudar?", time: "09:15" },
            { type: "received", content: "Meu cão não está atendendo bem aos comandos básicos como sentar e deitar. Ele tem 4 anos e é um Boxer.", time: "09:20" },
            { type: "sent", content: "Entendo. Boxers são uma raça inteligente mas podem ser teimosos às vezes. Podemos marcar uma avaliação para entender melhor a situação?", time: "09:25" },
            { type: "received", content: "Seria ótimo! Você tem disponibilidade na próxima semana?", time: "09:30" },
            { type: "sent", content: "Sim, tenho horário na quinta-feira às 16:30. Seria bom para você?", time: "09:35" },
            { type: "received", content: "Perfeito! Confirmo para quinta às 16:30 então.", time: "09:40" }
        ]
    },
    patricia: {
        name: "Patrícia Santos",
        avatar: "https://i.pravatar.cc/150?img=20",
        pet: "Belinha - Poodle, 5 anos",
        nextSession: "04/03/2025 - 11:00",
        status: "offline",
        messages: [
            { type: "date", content: "22/02/2025" },
            { type: "received", content: "Boa tarde, Carlos! Como está?", time: "15:20" },
            { type: "sent", content: "Boa tarde, Patrícia! Estou bem, obrigado. E você?", time: "15:25" },
            { type: "received", content: "Estou bem! A Belinha tem melhorado bastante com os exercícios.", time: "15:30" },
            { type: "sent", content: "Fico feliz em ouvir isso! Continuem praticando diariamente.", time: "15:35" },
            { type: "received", content: "Gostaria de marcar uma nova aula para semana que vem. Você tem horário disponível na terça pela manhã?", time: "15:40" },
            { type: "sent", content: "Tenho disponibilidade na terça às 11h. Serve para você?", time: "15:45" },
            { type: "received", content: "Perfeito! Confirmado então.", time: "15:50" }
        ]
    }
};

// Current Selected Contact
let currentContact = 'amanda';

// Load messages for a specific contact
function loadMessages(contactId) {
    // Clear current messages
    chatMessages.innerHTML = '';
    
    // Update current contact
    currentContact = contactId;
    
    // Get contact data
    const contact = contactsData[contactId];
    
    // Update header and sidebar info
    chatContactName.textContent = contact.name;
    sidebarContactName.textContent = contact.name;
    contactPet.textContent = contact.pet;
    nextSession.textContent = contact.nextSession;
    
    // Update profile images
    document.querySelector('.chat-header .contact-avatar').style.backgroundImage = `url('${contact.avatar}')`;
    document.querySelector('.contact-profile .contact-avatar').style.backgroundImage = `url('${contact.avatar}')`;
    
    // Load messages
    contact.messages.forEach(message => {
        if (message.type === 'date') {
            const dateSection = document.createElement('section');
            dateSection.className = 'message-date';
            dateSection.innerHTML = `<span>${message.content}</span>`;
            chatMessages.appendChild(dateSection);
        } else {
            const messageSection = document.createElement('section');
            messageSection.className = `message ${message.type}`;
            
            if (message.type === 'sent' || message.type === 'received') {
                messageSection.innerHTML = `
                    <section class="message-bubble">${message.content}</section>
                    <section class="message-time-sent">${message.time}</section>
                `;
            } else if (message.type === 'file') {
                messageSection.innerHTML = `
                    <section class="message-file">
                        <i class="fas fa-file-pdf"></i>
                        <section class="file-info">
                            <p class="file-name">${message.filename}</p>
                            <p class="file-size">${message.filesize}</p>
                        </section>
                    </section>
                    <section class="message-time-sent">${message.time}</section>
                `;
            } else if (message.type === 'image') {
                messageSection.innerHTML = `
                    <section class="message-image">
                        <img src="${message.url}" alt="Image">
                    </section>
                    <section class="message-time-sent">${message.time}</section>
                `;
            }
            
            chatMessages.appendChild(messageSection);
        }
    });
    
    // Scroll to bottom of messages
    scrollToBottom();
    
    // Remove new badge if present
    const selectedContact = document.querySelector(`.contact-item[data-contact="${contactId}"]`);
    const newBadge = selectedContact.querySelector('.status-badge.new');
    if (newBadge) {
        newBadge.parentElement.removeChild(newBadge);
    }
}

// Scroll messages to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send a new message
function sendMessage() {
    const content = messageInput.value.trim();
    if (content === '') return;
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    // Add message to UI
    const messageSection = document.createElement('section');
    messageSection.className = 'message sent';
    messageSection.innerHTML = `
        <section class="message-bubble">${content}</section>
        <section class="message-time-sent">${timeString}</section>
    `;
    chatMessages.appendChild(messageSection);
    
    // Add to data model
    contactsData[currentContact].messages.push({
        type: 'sent',
        content: content,
        time: timeString
    });
    
    // Clear input
    messageInput.value = '';
    
    // Scroll to bottom
    scrollToBottom();
    
    // Simulate response after a delay (for demo purposes)
    setTimeout(() => {
        simulateResponse();
    }, 1000 + Math.random() * 2000);
}

// Simulate a response from the contact
function simulateResponse() {
    const responses = [
        "Ok, entendi!",
        "Muito obrigado pela informação!",
        "Perfeito, vou aplicar essas técnicas.",
        "Isso foi muito útil, obrigado!",
        "Entendi, vamos fazer como você sugeriu.",
        "Excelente! Vamos seguir esse plano.",
        "Legal! Vou praticar com meu pet.",
        "Entendido, Carlos. Nos vemos na próxima sessão então.",
        "Vou treinar isso diariamente como você recomendou."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    // Add message to UI
    const messageSection = document.createElement('section');
    messageSection.className = 'message received';
    messageSection.innerHTML = `
        <section class="message-bubble">${randomResponse}</section>
        <section class="message-time-sent">${timeString}</section>
    `;
    chatMessages.appendChild(messageSection);
    
    // Add to data model
    contactsData[currentContact].messages.push({
        type: 'received',
        content: randomResponse,
        time: timeString
    });
    
    // Scroll to bottom
    scrollToBottom();
}

// Add a file message
function addFileMessage(fileType) {
    const fileTypes = {
        image: {
            icon: 'fa-file-image',
            name: 'Foto_Pet.jpg',
            size: '2.3 MB'
        },
        document: {
            icon: 'fa-file-pdf',
            name: 'Guia_Treinamento.pdf',
            size: '1.5 MB'
        },
        camera: {
            icon: 'fa-image',
            name: 'Camera_Shot.jpg',
            size: '3.1 MB'
        },
        other: {
            icon: 'fa-file',
            name: 'Arquivo.zip',
            size: '4.7 MB'
        }
    };
    
    const file = fileTypes[fileType] || fileTypes.other;
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    // Add message to UI
    const messageSection = document.createElement('section');
    messageSection.className = 'message sent';
    messageSection.innerHTML = `
        <section class="message-file">
            <i class="fas ${file.icon}"></i>
            <section class="file-info">
                <p class="file-name">${file.name}</p>
                <p class="file-size">${file.size}</p>
            </section>
        </section>
        <section class="message-time-sent">${timeString}</section>
    `;
    chatMessages.appendChild(messageSection);
    
    // Add to data model
    contactsData[currentContact].messages.push({
        type: 'file',
        filename: file.name,
        filesize: file.size,
        time: timeString
    });
    
    // Scroll to bottom
    scrollToBottom();
}

// Add an emoji to message input
function addEmoji(emoji) {
    messageInput.value += emoji;
    messageInput.focus();
}

// Filter contacts by search term
function filterContacts(searchTerm) {
    const term = searchTerm.toLowerCase();
    
    contactItems.forEach(item => {
        const name = item.querySelector('h4').textContent.toLowerCase();
        const lastMessage = item.querySelector('.last-message').textContent.toLowerCase();
        
        if (name.includes(term) || lastMessage.includes(term)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial load of first contact's messages
    loadMessages('amanda');
    
    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Contact selection
    contactItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all contacts
            contactItems.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked contact
            item.classList.add('active');
            
            // Load messages for this contact
            loadMessages(item.dataset.contact);
        });
    });
    
    // Search contacts
    searchContacts.addEventListener('input', (e) => {
        filterContacts(e.target.value);
    });
    
    // Send message
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // File upload dialog
    attachBtn.addEventListener('click', () => {
        fileUploadDialog.classList.toggle('active');
        emojiPicker.classList.remove('active');
    });
    
    closeFileDialog.addEventListener('click', () => {
        fileUploadDialog.classList.remove('active');
    });
    
    // File upload options
    fileUploadOptions.forEach(option => {
        option.addEventListener('click', () => {
            const fileType = option.querySelector('span').textContent.toLowerCase();
            addFileMessage(fileType);
            fileUploadDialog.classList.remove('active');
        });
    });
    
    // Emoji picker
    emojiBtn.addEventListener('click', () => {
        emojiPicker.classList.toggle('active');
        fileUploadDialog.classList.remove('active');
    });
    
    closeEmojiPicker.addEventListener('click', () => {
        emojiPicker.classList.remove('active');
    });
    
    // Emoji selection
    emojis.forEach(emoji => {
        emoji.addEventListener('click', () => {
            addEmoji(emoji.textContent);
            emojiPicker.classList.remove('active');
        });
    });
    
    // Contact info sidebar
    infoBtn.addEventListener('click', () => {
        contactInfoSidebar.classList.toggle('active');
    });
    
    closeContactInfo.addEventListener('click', () => {
        contactInfoSidebar.classList.remove('active');
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        // For file upload dialog
        if (!fileUploadDialog.contains(e.target) && e.target !== attachBtn) {
            fileUploadDialog.classList.remove('active');
        }
        
        // For emoji picker
        if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
            emojiPicker.classList.remove('active');
        }
    });
});

// Notification float click
document.querySelector('.notification-float').addEventListener('click', () => {
    alert('Sistema de notificações em desenvolvimento!');
});