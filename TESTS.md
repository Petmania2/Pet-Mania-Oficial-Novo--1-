# TESTS.md - Plano de Testes

## Instruções de Execução Local

### 1. Iniciar Servidor Local
```bash
cd Pet-Mania-Oficial-Novo--1-
python -m http.server 8000
# ou
npx http-server -p 8000
```

### 2. Acessar no Navegador
```
http://localhost:8000/app/views/pages/index.ejs
http://localhost:8000/app/views/pages/painelcliente.ejs
```

## Cenários de Teste

### Teste 1: Mapa na Página Principal (index.ejs)
1. Abrir http://localhost:8000/app/views/pages/index.ejs
2. Rolar até a seção "Encontre um Adestrador"
3. Verificar se o mapa carrega centrado em Barueri
4. Verificar se aparecem 10 marcadores de adestradores
5. Clicar em um marcador e verificar popup com informações

### Teste 2: Geolocalização
1. Clicar no botão "Minha Localização"
2. Permitir acesso à localização quando solicitado
3. Verificar se aparece marcador vermelho na sua posição
4. Verificar se o mapa centraliza na sua localização

### Teste 3: Busca por Endereço
1. Digitar "Barueri Centro" no campo de busca
2. Clicar em "Buscar" ou pressionar Enter
3. Verificar se o mapa move para o endereço
4. Verificar se aparece marcador vermelho no local

### Teste 4: Painel do Cliente (painelcliente.ejs)
1. Abrir http://localhost:8000/app/views/pages/painelcliente.ejs
2. Verificar se o mapa carrega na seção "Encontrar Adestradores"
3. Testar todos os controles do mapa
4. Verificar se as ações rápidas funcionam

### Teste 5: Chat Widget
1. Verificar se o botão de chat aparece no canto inferior direito
2. Clicar no botão e verificar se o chat abre
3. Digitar uma mensagem e verificar resposta automática

### Teste 6: Responsividade
1. Redimensionar a janela do navegador
2. Verificar se o mapa se adapta ao tamanho
3. Testar em dispositivos móveis (F12 > modo responsivo)

### Teste 7: Tratamento de Erros
1. Negar permissão de geolocalização
2. Verificar se aparece mensagem de erro apropriada
3. Buscar por endereço inexistente
4. Verificar mensagem "Endereço não encontrado"

### Teste 8: Logout (painelcliente.ejs)
1. Clicar no botão "Sair" no canto superior direito
2. Verificar se aparece confirmação
3. Confirmar e verificar redirecionamento

## Validações Esperadas

### Mapa
- ✅ Carrega centrado em Barueri (-23.5105, -46.8761)
- ✅ Mostra 10 adestradores com marcadores azuis
- ✅ Popups contêm: nome, especialidade, preço, telefone, botão agendar
- ✅ Controles de zoom funcionam
- ✅ Mapa é responsivo

### Geolocalização
- ✅ Solicita permissão corretamente
- ✅ Adiciona marcador vermelho na posição do usuário
- ✅ Centraliza mapa na localização
- ✅ Trata erro de permissão negada

### Busca de Endereço
- ✅ Aceita entrada via campo de texto
- ✅ Funciona com Enter ou botão
- ✅ Usa API Photon para geocoding
- ✅ Adiciona marcador no endereço encontrado
- ✅ Trata endereços não encontrados

### Interface
- ✅ Botões têm hover effects
- ✅ Campos de input são acessíveis
- ✅ Mensagens de erro são claras
- ✅ Layout é responsivo

## Debugging

### Console Logs Úteis
```javascript
// Habilitar logs de debug (adicionar no console)
console.log('Adestradores carregados:', adestradores.length);
console.log('Mapa inicializado:', map ? 'Sim' : 'Não');
console.log('Posição do usuário:', userMarker ? userMarker.getLatLng() : 'Não definida');
```

### Problemas Comuns
1. **Mapa não carrega**: Verificar conexão com internet (CDN Leaflet)
2. **Geolocalização falha**: Testar em HTTPS ou localhost
3. **Busca não funciona**: Verificar API Photon (pode ter rate limit)
4. **Marcadores não aparecem**: Verificar array de adestradores no console