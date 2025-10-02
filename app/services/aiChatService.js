// Chat com respostas programadas
const respostasProgramadas = {
  saudacao: [
    "Olá! Sou o assistente virtual da Pet Mania. Como posso ajudar você hoje?",
    "Oi! Bem-vindo à Pet Mania! Em que posso te auxiliar?",
    "Olá! Estou aqui para ajudar com suas dúvidas sobre adestramento de pets!"
  ],
  
  adestramento: [
    "O adestramento é fundamental para o bem-estar do seu pet! Nossos adestradores são certificados e usam métodos positivos.",
    "Temos adestradores especializados em diferentes comportamentos. Que tipo de treinamento você procura?",
    "O adestramento ajuda na socialização e obediência do seu pet. Posso te conectar com um adestrador próximo!"
  ],
  
  comportamento: [
    "Problemas de comportamento são comuns e têm solução! Nossos especialistas podem ajudar.",
    "Cada pet é único. Nossos adestradores avaliam individualmente e criam um plano personalizado.",
    "Latidos excessivos, destruição ou agressividade? Temos profissionais especializados para cada caso!"
  ],
  
  filhote: [
    "Filhotes aprendem mais rápido! É a melhor fase para começar o adestramento básico.",
    "Para filhotes, focamos em socialização, comandos básicos e educação sanitária.",
    "Que fofo! Filhotes precisam de paciência e consistência. Nossos adestradores são especialistas nisso!"
  ],
  
  preco: [
    "Os preços variam conforme o tipo de treinamento e região. Consulte nossos adestradores para orçamentos personalizados!",
    "Investir em adestramento é investir na qualidade de vida do seu pet. Temos opções para todos os orçamentos!",
    "Cada adestrador define seus preços. Você pode comparar e escolher o que melhor se adequa ao seu orçamento!"
  ],
  
  plataforma: [
    "Nossa plataforma conecta você aos melhores adestradores da sua região!",
    "Aqui você encontra adestradores verificados, avaliações reais e pode agendar facilmente!",
    "Somos a maior plataforma de adestramento do Brasil! Mais de 1000 adestradores cadastrados!"
  ],
  
  default: [
    "Interessante! Posso te ajudar com informações sobre adestramento, comportamento animal ou nossa plataforma.",
    "Não entendi bem sua pergunta. Você gostaria de saber sobre nossos adestradores ou serviços?",
    "Desculpe, não compreendi. Pode reformular sua pergunta? Estou aqui para ajudar com adestramento!"
  ]
};

function detectarCategoria(mensagem) {
  const msg = mensagem.toLowerCase();
  
  if (msg.includes('oi') || msg.includes('olá') || msg.includes('ola') || msg.includes('bom dia') || msg.includes('boa tarde') || msg.includes('boa noite')) {
    return 'saudacao';
  }
  
  if (msg.includes('adestramento') || msg.includes('treinar') || msg.includes('treinamento') || msg.includes('ensinar')) {
    return 'adestramento';
  }
  
  if (msg.includes('comportamento') || msg.includes('late') || msg.includes('morde') || msg.includes('agressivo') || msg.includes('destrói') || msg.includes('xixi') || msg.includes('cocô')) {
    return 'comportamento';
  }
  
  if (msg.includes('filhote') || msg.includes('cachorrinho') || msg.includes('puppy') || msg.includes('bebê') || msg.includes('pequeno')) {
    return 'filhote';
  }
  
  if (msg.includes('preço') || msg.includes('valor') || msg.includes('custa') || msg.includes('quanto') || msg.includes('barato') || msg.includes('caro')) {
    return 'preco';
  }
  
  if (msg.includes('plataforma') || msg.includes('app') || msg.includes('site') || msg.includes('como funciona') || msg.includes('pet mania')) {
    return 'plataforma';
  }
  
  return 'default';
}

function obterResposta(categoria) {
  const respostas = respostasProgramadas[categoria];
  return respostas[Math.floor(Math.random() * respostas.length)];
}

async function sendMessage(message, history = []) {
  try {
    const categoria = detectarCategoria(message);
    const resposta = obterResposta(categoria);
    
    return {
      success: true,
      reply: {
        message: resposta
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erro interno do chat'
    };
  }
}

module.exports = {
  sendMessage
};