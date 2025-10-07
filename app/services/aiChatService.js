// Sistema de chat expandido - Pet Mania
const respostas = {
  // Saudações
  'oi': 'Olá! Sou o assistente da Pet Mania 🐶 Como posso ajudar?',
  'ola': 'Oi! Bem-vindo à Pet Mania! Em que posso auxiliar?',
  'bom dia': 'Bom dia! Como posso te ajudar hoje?',
  'boa tarde': 'Boa tarde! Em que posso ser útil?',
  'boa noite': 'Boa noite! Como posso ajudar?',
  'tchau': 'Tchau! Volte sempre que precisar! 🐾',
  'obrigado': 'De nada! Fico feliz em ajudar! 😊',
  
  // Cadastros
  'cadastrar adestrador': '🎓 **Como se cadastrar como adestrador:**\n\n1. Acesse: /Cadastroadestrador.ejs\n2. Preencha seus dados pessoais\n3. Informe experiência e especialidades\n4. Defina seu preço por sessão\n5. Aguarde aprovação\n\n✨ Após aprovado, você aparecerá nas buscas!',
  'ser adestrador': '🎓 **Como se cadastrar como adestrador:**\n\n1. Acesse: /Cadastroadestrador.ejs\n2. Preencha seus dados pessoais\n3. Informe experiência e especialidades\n4. Defina seu preço por sessão\n5. Aguarde aprovação\n\n✨ Após aprovado, você aparecerá nas buscas!',
  'cadastrar cliente': '🐶 **Como se cadastrar como cliente:**\n\n1. Acesse: /cliente.ejs\n2. Preencha seus dados\n3. Faça login em: /Login.ejs\n4. Acesse seu painel: /painelcliente.ejs\n\n🎆 Pronto para buscar adestradores!',
  'criar conta': '🐶 **Como se cadastrar como cliente:**\n\n1. Acesse: /cliente.ejs\n2. Preencha seus dados\n3. Faça login em: /Login.ejs\n4. Acesse seu painel: /painelcliente.ejs\n\n🎆 Pronto para buscar adestradores!',
  'cadastrar pet': '🐕 **Como cadastrar seu pet:**\n\n1. Faça login como cliente\n2. Acesse: http://localhost:3000/meuspets.ejs\n3. Clique em "Adicionar Pet"\n4. Preencha informações do seu amiguinho\n\n🏆 Assim os adestradores conhecerão melhor seu pet!',
  'adicionar pet': '🐕 **Como cadastrar seu pet:**\n\n1. Faça login como cliente\n2. Acesse: http://localhost:3000/meuspets.ejs\n3. Clique em "Adicionar Pet"\n4. Preencha informações do seu amiguinho\n\n🏆 Assim os adestradores conhecerão melhor seu pet!',
  
  // Login e acesso
  'login': '🔐 **Como fazer login:**\n\n1. Acesse: /Login.ejs\n2. Digite seu email e senha\n3. Escolha o tipo (Cliente ou Adestrador)\n\n❓ Esqueceu a senha? Entre em contato: (11) 9999-8888',
  'entrar': '🔐 **Como fazer login:**\n\n1. Acesse: /Login.ejs\n2. Digite seu email e senha\n3. Escolha o tipo (Cliente ou Adestrador)\n\n❓ Esqueceu a senha? Entre em contato: (11) 9999-8888',
  'esqueci senha': '🔑 **Esqueceu a senha?**\n\nEntre em contato conosco:\n📞 **Telefone:** (11) 9999-8888\n📱 **WhatsApp:** (11) 9999-8888\n\n🕰️ **Horário:** Segunda a Sexta, 8h às 18h',
  
  // Buscar e encontrar
  'buscar adestrador': '🔍 **Como encontrar adestradores:**\n\n1. Acesse: /adestradores.ejs\n2. Use os filtros de localização\n3. Veja perfis e avaliações\n4. Entre em contato direto\n\n⭐ Todos são profissionais verificados!',
  'encontrar adestrador': '🔍 **Como encontrar adestradores:**\n\n1. Acesse: /adestradores.ejs\n2. Use os filtros de localização\n3. Veja perfis e avaliações\n4. Entre em contato direto\n\n⭐ Todos são profissionais verificados!',
  'adestradores': '🔍 **Como encontrar adestradores:**\n\n1. Acesse: /adestradores.ejs\n2. Use os filtros de localização\n3. Veja perfis e avaliações\n4. Entre em contato direto\n\n⭐ Todos são profissionais verificados!',
  
  // Adestramento e comportamento
  'adestramento': '🎯 **Sobre adestramento:**\n\nNossos adestradores são especializados em:\n• Obediência básica\n• Correção de comportamento\n• Socialização\n• Truques e comandos\n\n🔍 Encontre um adestrador: http://localhost:3000/buscaradestrador.ejs',
  'treinar cachorro': '🎯 **Sobre adestramento:**\n\nNossos adestradores são especializados em:\n• Obediência básica\n• Correção de comportamento\n• Socialização\n• Truques e comandos\n\n🔍 Encontre um adestrador: http://localhost:3000/buscaradestrador.ejs',
  'comportamento': '🐕 **Problemas de comportamento:**\n\nNossos especialistas ajudam com:\n• Latidos excessivos\n• Destruição de objetos\n• Agressividade\n• Ansiedade de separação\n• Puxar na coleira\n\n🔍 Encontre ajuda: http://localhost:3000/buscaradestrador.ejs',
  'late muito': '🔊 **Latidos excessivos:**\n\nNossos adestradores podem ajudar a controlar latidos através de técnicas positivas de treinamento.\n\n🔍 Encontre um especialista: http://localhost:3000/buscaradestrador.ejs',
  'agressivo': '⚠️ **Comportamento agressivo:**\n\nTemos especialistas em correção de agressividade que usam métodos seguros e eficazes.\n\n🔍 Encontre ajuda: http://localhost:3000/buscaradestrador.ejs',
  
  // Planos e preços
  'planos': '💳 **Planos para adestradores:**\n\n🥉 **Bronze:** R$ 49/mês\n• Perfil básico\n• Até 30 clientes\n\n🥈 **Prata:** R$ 89/mês (Recomendado)\n• Destaque nas buscas\n• Até 100 clientes\n\n🥇 **Ouro:** R$ 149/mês\n• Primeiro nas buscas\n• Clientes ilimitados\n\nAcesse: http://localhost:3000/planosadestrador.ejs',
  'precos': '💰 **Preços dos serviços:**\n\nOs preços variam por adestrador e região:\n• Sessão básica: R$ 80 - R$ 200\n• Pacote mensal: R$ 300 - R$ 800\n• Adestramento intensivo: R$ 500 - R$ 1500\n\n🔍 Compare preços: http://localhost:3000/buscaradestrador.ejs',
  'quanto custa': '💰 **Preços dos serviços:**\n\nOs preços variam por adestrador e região:\n• Sessão básica: R$ 80 - R$ 200\n• Pacote mensal: R$ 300 - R$ 800\n• Adestramento intensivo: R$ 500 - R$ 1500\n\n🔍 Compare preços: http://localhost:3000/buscaradestrador.ejs',
  
  // Pagamentos
  'pagamento': '💳 **Formas de pagamento:**\n\n• Cartão de crédito (até 12x)\n• PIX (desconto de 5%)\n• Boleto bancário\n• Transferência bancária\n\n🔒 Pagamentos seguros via Mercado Pago\n\n📞 Dúvidas: (11) 9999-8888',
  'pix': '💳 **Pagamento via PIX:**\n\n• Desconto de 5%\n• Aprovação instantânea\n• Disponível 24h\n\n🔒 Seguro via Mercado Pago',
  'cartao': '💳 **Pagamento no cartão:**\n\n• Até 12x sem juros\n• Todas as bandeiras\n• Aprovação rápida\n\n🔒 Seguro via Mercado Pago',
  
  // Sobre a plataforma
  'como funciona': '🏠 **Como funciona a Pet Mania:**\n\n👤 **Para clientes:**\n1. Cadastre-se gratuitamente\n2. Busque adestradores na sua região\n3. Compare perfis e preços\n4. Contrate o serviço\n\n👨‍🏫 **Para adestradores:**\n1. Cadastre-se e aguarde aprovação\n2. Crie seu perfil profissional\n3. Receba contatos de clientes\n4. Gerencie seus agendamentos',
  'pet mania': '🏠 **Sobre a Pet Mania:**\n\nSomos a maior plataforma de adestramento do Brasil!\n\n📊 **Números:**\n• +1000 adestradores cadastrados\n• +50.000 pets atendidos\n• Presente em todo o Brasil\n\n🏆 **Missão:** Conectar pets e famílias aos melhores profissionais de adestramento.',
  
  // Suporte e contato
  'suporte': '📞 **Suporte Pet Mania:**\n\n**Telefone:** (11) 9999-8888\n**WhatsApp:** (11) 9999-8888\n**Email:** suporte@petmania.com.br\n\n🕰️ **Horário:** Segunda a Sexta, 8h às 18h\n\n💬 **Chat:** Disponível 24h aqui no site!',
  'contato': '📞 **Suporte Pet Mania:**\n\n**Telefone:** (11) 9999-8888\n**WhatsApp:** (11) 9999-8888\n**Email:** suporte@petmania.com.br\n\n🕰️ **Horário:** Segunda a Sexta, 8h às 18h\n\n💬 **Chat:** Disponível 24h aqui no site!',
  'telefone': '📞 **Nosso telefone:** (11) 9999-8888\n\n🕰️ **Horário:** Segunda a Sexta, 8h às 18h',
  'whatsapp': '📱 **Nosso WhatsApp:** (11) 9999-8888\n\n💬 Resposta rápida no horário comercial!',
  
  // Dúvidas frequentes
  'seguro': '🔒 **Segurança na Pet Mania:**\n\n• Todos os adestradores são verificados\n• Avaliações reais de clientes\n• Pagamentos seguros via Mercado Pago\n• Suporte 24h disponível\n\n✅ Sua segurança é nossa prioridade!',
  'confiavel': '🔒 **Segurança na Pet Mania:**\n\n• Todos os adestradores são verificados\n• Avaliações reais de clientes\n• Pagamentos seguros via Mercado Pago\n• Suporte 24h disponível\n\n✅ Sua segurança é nossa prioridade!',
  'avaliacoes': '⭐ **Sistema de avaliações:**\n\n• Clientes avaliam os adestradores\n• Notas de 1 a 5 estrelas\n• Comentários detalhados\n• Histórico transparente\n\n🔍 Veja as avaliações antes de contratar!',
  
  // Problemas específicos
  'meu cachorro não obedece': '🎯 **Problemas de obediência:**\n\nNossos adestradores especialistas podem ajudar com:\n• Comandos básicos (senta, fica, vem)\n• Correção de comportamento\n• Técnicas de reforço positivo\n\n🔍 Encontre um especialista: http://localhost:3000/adestradores.ejs',
  'cachorro destrói casa': '🏠 **Comportamento destrutivo:**\n\nEsse é um problema comum! Nossos adestradores ajudam com:\n• Ansiedade de separação\n• Redirecionamento de energia\n• Enriquecimento ambiental\n\n🔍 Encontre ajuda: http://localhost:3000/adestradores.ejs',
  'filhote': '🐕 **Adestramento de filhotes:**\n\nÉ a melhor idade para começar! Nossos especialistas trabalham com:\n• Socialização\n• Comandos básicos\n• Controle de necessidades\n• Mordidas de brincadeira\n\n🔍 Encontre um especialista: http://localhost:3000/adestradores.ejs',
  'cão idoso': '👴 **Adestramento para cães idosos:**\n\nNunca é tarde para aprender! Oferecemos:\n• Técnicas adaptadas à idade\n• Exercícios mentais\n• Correção suave de comportamentos\n\n🔍 Encontre um adestrador: http://localhost:3000/adestradores.ejs',
  
  // Localização
  'são paulo': '📍 **Adestradores em São Paulo:**\n\nTemos muitos profissionais na região! Use nosso sistema de busca por localização para encontrar os mais próximos.\n\n🔍 Buscar: http://localhost:3000/adestradores.ejs',
  'rio de janeiro': '📍 **Adestradores no Rio de Janeiro:**\n\nTemos ótimos profissionais no RJ! Use nosso mapa interativo para encontrar os mais próximos.\n\n🔍 Buscar: http://localhost:3000/adestradores.ejs',
  'belo horizonte': '📍 **Adestradores em Belo Horizonte:**\n\nTemos profissionais qualificados em BH! Veja os disponíveis na sua região.\n\n🔍 Buscar: http://localhost:3000/adestradores.ejs',
  
  // Emergência
  'urgente': '🚨 **Situação urgente?**\n\nPara emergências comportamentais graves:\n📞 **Telefone:** (11) 9999-8888\n📱 **WhatsApp:** (11) 9999-8888\n\n⚠️ Para emergências veterinárias, procure um veterinário imediatamente!',
  'emergencia': '🚨 **Situação urgente?**\n\nPara emergências comportamentais graves:\n📞 **Telefone:** (11) 9999-8888\n📱 **WhatsApp:** (11) 9999-8888\n\n⚠️ Para emergências veterinárias, procure um veterinário imediatamente!',
  
  // Padrão
  'default': '🤔 Não entendi sua pergunta, mas posso ajudar com:\n\n🐶 **Cadastros** - Como se registrar\n🔍 **Buscar adestradores** - Encontrar profissionais\n💳 **Planos e preços** - Valores e formas de pagamento\n🎯 **Problemas comportamentais** - Soluções para seu pet\n\n📞 **Suporte direto:** (11) 9999-8888\n\n💡 **Dica:** Seja mais específico, como "meu cachorro não obedece" ou "quero cadastrar"'
};

function buscarResposta(mensagem) {
  const msg = mensagem.toLowerCase().trim();
  console.log('Buscando resposta para:', msg);
  
  // Buscar resposta exata primeiro
  if (respostas[msg]) {
    console.log('Resposta exata encontrada');
    return respostas[msg];
  }
  
  // Buscar por palavras-chave simples
  for (const [chave, resposta] of Object.entries(respostas)) {
    if (chave !== 'default' && msg.includes(chave)) {
      console.log('Palavra-chave encontrada:', chave);
      return resposta;
    }
  }
  
  console.log('Nenhuma resposta encontrada, usando default');
  return respostas.default;
}

async function sendMessage(message) {
  try {
    // Simular delay para parecer mais natural
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const resposta = buscarResposta(message);
    
    return {
      success: true,
      reply: {
        message: resposta
      }
    };
  } catch (error) {
    console.error('Erro no aiChatService:', error);
    return {
      success: false,
      error: 'Erro no processamento da mensagem'
    };
  }
}

module.exports = {
  sendMessage
};