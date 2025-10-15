# 🚀 Guia de Implementação - Chat ao Vivo com Socket.io

## ✅ O que foi criado

### 1. **Banco de Dados** (script_bd.sql)
- Tabela `conversas`: Armazena conversas entre cliente e adestrador
- Tabela `mensagens`: Armazena todas as mensagens trocadas

### 2. **Backend**
- `chatModel.js`: Gerencia dados de conversas e mensagens
- `chatController.js`: Controla rotas HTTP do chat
- `socketService.js`: Gerencia conexões WebSocket em tempo real
- `app.js`: Integrado com Socket.io

### 3. **Frontend**
- `chat.js`: Lógica JavaScript do chat
- `chat.css`: Estilos da interface
- `chat-exemplo.ejs`: Página HTML de exemplo

### 4. **Rotas Adicionadas**
- `POST /chat/iniciar` - Iniciar conversa
- `GET /chat/conversas` - Listar conversas
- `GET /chat/historico/:id` - Buscar mensagens
- `POST /chat/marcar-lida/:id` - Marcar como lida

---

## 📦 Instalação

### 1. Instalar Socket.io
```bash
npm install socket.io
```

### 2. Executar Script do Banco
Execute o arquivo `config/script_bd.sql` no seu banco MySQL Railway.

### 3. Reiniciar Servidor
```bash
npm start
```

---

## 🎯 Como Usar

### Para Cliente Iniciar Conversa com Adestrador

```javascript
// No frontend (ex: página do adestrador)
async function iniciarChat(idAdestrador) {
    const response = await fetch('/chat/iniciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idAdestrador })
    });
    
    const data = await response.json();
    window.location.href = '/mensagenscliente.ejs';
}
```

### Integrar nas Páginas Existentes

**mensagenscliente.ejs:**
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/css/chat.css">
</head>
<body>
    <div class="container-chat">
        <div class="lista-conversas">
            <div id="lista-conversas"></div>
        </div>
        <div class="area-chat" id="area-chat">
            <div class="chat-header">
                <h3 id="nome-contato"></h3>
            </div>
            <div id="mensagens"></div>
            <div id="indicador-digitando"></div>
            <div class="chat-input">
                <input type="text" id="input-mensagem" placeholder="Digite...">
                <button onclick="enviarMensagem()">Enviar</button>
            </div>
        </div>
    </div>
    
    <script src="/socket.io/socket.io.js"></script>
    <script src="/js/chat.js"></script>
</body>
</html>
```

**mensagensadestrador.ejs:** (mesma estrutura)

---

## 🔧 Funcionalidades Implementadas

✅ Mensagens em tempo real  
✅ Histórico de conversas  
✅ Indicador "está digitando..."  
✅ Contador de mensagens não lidas  
✅ Status online/offline  
✅ Múltiplas conversas simultâneas  
✅ Persistência no banco de dados  

---

## 🎨 Personalização

### Mudar Cores
Edite `chat.css`:
```css
.mensagem.minha .mensagem-conteudo {
    background: #sua-cor; /* Cor das suas mensagens */
}
```

### Adicionar Notificações
Em `chat.js`, adicione:
```javascript
socket.on('nova_mensagem', (msg) => {
    if (msg.id_conversa !== idConversaAtual) {
        new Notification('Nova mensagem!', {
            body: msg.mensagem
        });
    }
});
```

---

## 🐛 Troubleshooting

### Socket.io não conecta
- Verifique se `npm install socket.io` foi executado
- Confirme que o servidor foi reiniciado
- Verifique console do navegador (F12)

### Mensagens não aparecem
- Verifique se as tabelas foram criadas no banco
- Confirme autenticação do usuário
- Veja logs do servidor

### Erro "Cannot find module socket.io"
```bash
npm install socket.io --save
```

---

## 📊 Estrutura de Dados

### Conversa
```javascript
{
    id_conversa: 1,
    id_cliente: 5,
    id_adestrador: 3,
    ultima_mensagem: "2024-01-15 10:30:00",
    status: "ativa"
}
```

### Mensagem
```javascript
{
    id_mensagem: 10,
    id_conversa: 1,
    id_remetente: 5,
    mensagem: "Olá!",
    data_envio: "2024-01-15 10:30:00",
    lida: false
}
```

---

## 🚀 Próximos Passos (Opcional)

1. **Envio de Imagens**: Adicionar upload de fotos no chat
2. **Áudio**: Permitir mensagens de voz
3. **Notificações Push**: Avisar quando offline
4. **Emojis**: Adicionar seletor de emojis
5. **Busca**: Pesquisar mensagens antigas

---

## 📞 Suporte

Se tiver dúvidas:
1. Verifique os logs do servidor
2. Teste a rota `/chat/test` para ver se está funcionando
3. Verifique se o usuário está autenticado

---

**Implementado com ❤️ para Pet Mania**
