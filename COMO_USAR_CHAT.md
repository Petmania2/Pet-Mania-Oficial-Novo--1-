# 💬 Como Usar o Chat ao Vivo

## ✅ Integração Completa

O chat agora está **100% integrado** nas páginas:
- ✅ `/mensagenscliente.ejs` - Cliente
- ✅ `/mensagensadestrador.ejs` - Adestrador

## 🚀 Como Funciona

### 1. **Cliente Inicia Conversa**

Adicione um botão "Conversar" no perfil do adestrador:

```html
<!-- Exemplo: na página de perfil do adestrador -->
<button onclick="iniciarChatComAdestrador(<%= adestrador.id_adestrador %>)">
    <i class="fas fa-comment"></i> Conversar
</button>

<script>
async function iniciarChatComAdestrador(idAdestrador) {
    try {
        const response = await fetch('/chat/iniciar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idAdestrador })
        });
        
        const data = await response.json();
        
        if (data.idConversa) {
            // Redirecionar para mensagens
            window.location.href = '/mensagenscliente.ejs';
        }
    } catch (erro) {
        alert('Erro ao iniciar conversa');
    }
}
</script>
```

### 2. **Sistema Automático**

✅ **Primeira mensagem**: Cria conversa automaticamente  
✅ **Mensagens seguintes**: Usa a conversa existente  
✅ **Persistência**: Tudo salvo no banco de dados  
✅ **Histórico**: Cliente sai e volta, mensagens continuam lá  

### 3. **Fluxo Completo**

```
Cliente → Clica "Conversar" → Cria conversa no banco
       ↓
Cliente → Envia mensagem → Salva no banco
       ↓
Adestrador → Recebe em tempo real via Socket.io
       ↓
Adestrador → Responde → Cliente recebe instantaneamente
       ↓
Ambos → Saem e voltam → Histórico completo disponível
```

## 📱 Exemplo de Uso Real

### Na página de busca de adestradores:

```html
<div class="adestrador-card">
    <h3><%= adestrador.nome %></h3>
    <p><%= adestrador.especialidade %></p>
    
    <!-- Botão de chat -->
    <button class="btn-chat" onclick="iniciarChat(<%= adestrador.id_adestrador %>)">
        💬 Enviar Mensagem
    </button>
</div>

<script>
async function iniciarChat(idAdestrador) {
    const response = await fetch('/chat/iniciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idAdestrador })
    });
    
    if (response.ok) {
        window.location.href = '/mensagenscliente.ejs';
    }
}
</script>
```

## 🔄 Persistência Automática

### O que é salvo automaticamente:

1. **Conversa criada** → Tabela `conversas`
2. **Cada mensagem** → Tabela `mensagens`
3. **Última mensagem** → Atualiza timestamp
4. **Status de leitura** → Marca como lida/não lida

### Cliente pode:
- ✅ Sair do sistema
- ✅ Fazer logout
- ✅ Fechar navegador
- ✅ Voltar depois

**Resultado**: Todas as mensagens estarão lá!

## 🎯 Testando

### 1. Instalar Socket.io
```bash
npm install socket.io
```

### 2. Executar SQL
Execute as tabelas `conversas` e `mensagens` no banco.

### 3. Reiniciar servidor
```bash
npm start
```

### 4. Testar fluxo:
1. Login como **Cliente**
2. Acesse `/mensagenscliente.ejs`
3. Se não tiver conversas, inicie uma (veja exemplo acima)
4. Envie mensagem
5. Faça logout
6. Login novamente
7. ✅ Mensagens continuam lá!

## 🔧 Troubleshooting

### "Nenhuma conversa ainda"
- Normal se o cliente nunca conversou
- Adicione botão "Conversar" no perfil dos adestradores

### Mensagens não aparecem
- Verifique console do navegador (F12)
- Confirme que Socket.io está conectado
- Veja logs do servidor

### Erro ao enviar
- Confirme que usuário está autenticado
- Verifique se conversa existe no banco

## 📊 Estrutura no Banco

```sql
-- Conversa criada automaticamente
INSERT INTO conversas (id_cliente, id_adestrador)
VALUES (5, 3);

-- Mensagem salva automaticamente
INSERT INTO mensagens (id_conversa, id_remetente, mensagem)
VALUES (1, 5, 'Olá, gostaria de agendar uma sessão');
```

## 🎨 Personalização

### Mudar cor das mensagens:
Edite `chat-mensagens.css`:
```css
.message.sent .message-content {
    background: #sua-cor;
}
```

### Adicionar notificação sonora:
Em `chat.js`:
```javascript
socket.on('nova_mensagem', (msg) => {
    adicionarMensagemNaTela(msg);
    new Audio('/sons/notificacao.mp3').play();
});
```

---

**Pronto! O chat está 100% funcional e persistente! 🎉**
