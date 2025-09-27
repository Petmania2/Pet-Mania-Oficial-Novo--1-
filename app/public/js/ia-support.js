document.addEventListener('DOMContentLoaded', function() {
    const iaBtn = document.getElementById('iaSupportBtn');
    const iaPopup = document.getElementById('iaChatPopup');
    const closeBtn = document.getElementById('closeIaChat');
    const sendBtn = document.getElementById('iaChatSend');
    const input = document.getElementById('iaChatInput');
    const chatBody = document.getElementById('iaChatBody');

    iaBtn.onclick = () => iaPopup.style.display = 'flex';
    closeBtn.onclick = () => iaPopup.style.display = 'none';

    function appendMsg(msg, type) {
        const div = document.createElement('div');
        div.className = 'ia-chat-msg ' + type;
        div.textContent = msg;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function iaReply(userMsg) {
        appendMsg('...', 'ia-chat-msg-ia');
        try {
            const res = await fetch('/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();
            // Remove o placeholder
            const lastIaMsg = chatBody.querySelector('.ia-chat-msg-ia:last-child');
            if (lastIaMsg) lastIaMsg.remove();
            appendMsg(data.message || data.error || 'Erro ao obter resposta da IA.', 'ia-chat-msg-ia');
        } catch (err) {
            const lastIaMsg = chatBody.querySelector('.ia-chat-msg-ia:last-child');
            if (lastIaMsg) lastIaMsg.remove();
            appendMsg('Erro ao conectar com IA.', 'ia-chat-msg-ia');
        }
    }

    sendBtn.onclick = () => {
        const msg = input.value.trim();
        if (!msg) return;
        appendMsg(msg, 'ia-chat-msg-user');
        input.value = '';
        iaReply(msg);
    };

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') sendBtn.click();
    });
});