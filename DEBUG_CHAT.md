# 🐛 DEBUG DO CHAT - PASSO A PASSO

## ❌ PROBLEMA IDENTIFICADO E CORRIGIDO

O chat não funcionava porque:
1. ❌ `chatController` usava `req.session.usuario.ID_USUARIO` (errado)
2. ✅ Sessão salva como `req.session.usuario.id` (correto)
3. ❌ Tipo de usuário comparava com 'C' ao invés de 'cliente'

## ✅ CORREÇÕES APLICADAS

1. ✅ Corrigido `chatController.js` para usar `req.session.usuario.id`
2. ✅ Corrigido tipo de usuário para 'cliente' e 'adestrador'
3. ✅ Adicionado logs de debug
4. ✅ Criada página de teste `/teste-chat-simples.ejs`

---

## 🧪 COMO TESTAR AGORA

### PASSO 1: Reiniciar Servidor
```bash
npm start
```

### PASSO 2: Fazer Login como Cliente
1. Acesse `/Login.ejs`
2. Faça login como **cliente**

### PASSO 3: Testar com Página de Debug
1. Acesse: `http://localhost:3000/teste-chat-simples.ejs`
2. Você verá:
   - ✅ Status de autenticação
   - ✅ Socket.io conectado
   - ✅ Logs em tempo real

### PASSO 4: Iniciar Conversa
1. Digite o **ID do adestrador** (exemplo: 1)
2. Clique em **"Iniciar Conversa"**
3. Veja no log:
   - ✅ "Conversa criada! ID: X"

### PASSO 5: Enviar Mensagem
1. Digite uma mensagem
2. Clique em **"Enviar"**
3. Veja no log:
   - ✅ "Enviando: sua mensagem"

### PASSO 6: Verificar no Banco
```sql
-- Ver conversas criadas
SELECT * FROM conversas;

-- Ver mensagens enviadas
SELECT * FROM mensagens;
```

---

## 🔍 VERIFICAR LOGS DO SERVIDOR

Ao enviar mensagem, você deve ver no console do servidor:

```
🔵 Iniciando conversa...
Body: { idAdestrador: 1 }
Sessão: { id: 5, nome: 'João', email: 'joao@email.com', tipo: 'cliente' }
✅ Conversa criada/encontrada: 1
```

---

## 🐛 SE AINDA NÃO FUNCIONAR

### 1. Verificar Sessão
Acesse: `http://localhost:3000/check-auth`

Deve retornar:
```json
{
  "loggedIn": true,
  "user": {
    "id": 5,
    "nome": "João",
    "tipo": "cliente"
  }
}
```

### 2. Verificar Tabelas no Banco
```sql
-- Verificar se tabelas existem
SHOW TABLES LIKE '%conversa%';
SHOW TABLES LIKE '%mensagem%';

-- Ver estrutura
DESCRIBE conversas;
DESCRIBE mensagens;
```

### 3. Verificar Socket.io
Abra o console do navegador (F12) e veja:
```
✅ Socket.io conectado!
✅ Autenticado como: João (ID: 5, Tipo: cliente)
```

---

## 📝 CHECKLIST DE FUNCIONAMENTO

- [ ] Socket.io instalado (`npm install socket.io`)
- [ ] Servidor reiniciado
- [ ] Tabelas `conversas` e `mensagens` criadas no banco
- [ ] Login como cliente funcionando
- [ ] `/check-auth` retorna `loggedIn: true`
- [ ] `/teste-chat-simples.ejs` mostra "Autenticado"
- [ ] Botão "Iniciar Conversa" cria conversa
- [ ] Botão "Enviar" envia mensagem
- [ ] Mensagens aparecem no banco

---

## 🎯 PRÓXIMO PASSO

Depois que funcionar na página de teste, integre nas páginas reais:

1. Adicione botão "Conversar" no perfil do adestrador
2. Use o mesmo código da página de teste
3. Redirecione para `/mensagenscliente.ejs`

---

## 💡 EXEMPLO DE BOTÃO "CONVERSAR"

```html
<!-- Na página de perfil do adestrador -->
<button onclick="iniciarChatComAdestrador(<%= adestrador.id_adestrador %>)">
    💬 Conversar
</button>

<script>
async function iniciarChatComAdestrador(idAdestrador) {
    try {
        const res = await fetch('/chat/iniciar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idAdestrador })
        });
        
        const data = await res.json();
        
        if (data.idConversa) {
            window.location.href = '/mensagenscliente.ejs';
        } else {
            alert('Erro: ' + (data.erro || 'Erro desconhecido'));
        }
    } catch (erro) {
        alert('Erro ao iniciar conversa');
        console.error(erro);
    }
}
</script>
```

---

**TESTE AGORA E ME DIGA O QUE APARECE NO LOG! 🚀**
