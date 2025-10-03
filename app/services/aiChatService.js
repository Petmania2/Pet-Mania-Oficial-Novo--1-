// Chat com respostas programadas
const respostasProgramadas = {
  saudacao: [
    "🐾 Olá! Sou o PetBot da Pet Mania. Como posso ajudar você hoje?",
    "🐕 Oi! Bem-vindo à Pet Mania! Em que posso te auxiliar?",
    "🎾 Olá! Estou aqui para ajudar com suas dúvidas sobre adestramento de pets!"
  ],
  
  adestramento: [
    "🎯 O adestramento é fundamental para o bem-estar do seu pet! Nossos adestradores são certificados e usam métodos positivos de reforço.",
    "🏆 Temos adestradores especializados em diferentes comportamentos. Que tipo de treinamento você procura? Obediência básica, socialização ou correção comportamental?",
    "💪 O adestramento melhora a relação entre você e seu pet. Posso te conectar com um adestrador próximo!"
  ],
  
  comportamento: [
    "🔧 Problemas de comportamento têm solução! Nossos especialistas criam planos personalizados para cada caso.",
    "📋 Cada pet é único. Nossos adestradores fazem avaliação comportamental completa antes de iniciar o treinamento.",
    "⚡ Latidos excessivos, ansiedade, agressividade ou destruição? Temos profissionais especializados para resolver!"
  ],
  
  filhote: [
    "🐶 Filhotes aprendem mais rápido! Entre 8 semanas e 6 meses é a fase ideal para socialização.",
    "📚 Para filhotes focamos em: comandos básicos (senta, fica, vem), educação sanitária e socialização.",
    "💝 Que fofo! Filhotes precisam de paciência, consistência e muito amor. Nossos adestradores são especialistas!"
  ],
  
  preco: [
    "💰 Os preços variam de R$ 80 a R$ 300 por sessão, dependendo da especialidade e região. Consulte nossos adestradores!",
    "💎 Investir em adestramento é investir na qualidade de vida do seu pet e da sua família!",
    "📊 Cada adestrador define seus valores. Você pode comparar perfis, preços e avaliações na nossa plataforma!"
  ],
  
  plataforma: [
    "🌟 Nossa plataforma conecta você aos melhores adestradores verificados da sua região!",
    "✅ Aqui você encontra: adestradores certificados, avaliações reais, agendamento online e pagamento seguro!",
    "🏅 Somos a maior plataforma de adestramento do Brasil! Mais de 1000 adestradores em todo o país!"
  ],
  
  cadastro: [
    "📝 Para se cadastrar, clique em 'Cadastrar' no menu superior e escolha se é cliente ou adestrador!",
    "🔐 O cadastro é gratuito e rápido! Você terá acesso a todos os recursos da plataforma.",
    "👤 Após o cadastro, você pode buscar adestradores, ver perfis completos e agendar sessões!"
  ],
  
  pagamento: [
    "💳 Aceitamos cartão de crédito, débito e PIX através do Mercado Pago - totalmente seguro!",
    "🔒 Todos os pagamentos são processados com segurança. Você só paga após confirmar o agendamento.",
    "💸 O pagamento é feito diretamente na plataforma. Sem complicações ou taxas extras!"
  ],
  
  contato: [
    "📞 Entre em contato conosco pelo email: petmania20072008@gmail.com",
    "💬 Você pode usar este chat para tirar dúvidas ou navegar pela plataforma para mais informações!",
    "🕐 Estamos disponíveis 24/7 através deste chat inteligente para ajudar você!"
  ],
  
  agendamento: [
    "📅 Para agendar: escolha um adestrador, veja a disponibilidade e confirme o horário que funciona para você!",
    "⏰ Você pode agendar sessões com antecedência e receberá lembretes por email.",
    "📲 O agendamento é simples: selecione data, horário e confirme. O adestrador entrará em contato!"
  ],
  
  emergencia: [
    "🚨 Para emergências comportamentais graves (agressividade extrema), procure um veterinário comportamentalista imediatamente!",
    "⚠️ Se seu pet está apresentando comportamento perigoso, entre em contato com um profissional urgentemente.",
    "🏥 Em casos de emergência, ligue para o veterinário mais próximo. Nossos adestradores podem ajudar após a avaliação médica."
  ],
  
  dicas: [
    "💡 Dica: Seja consistente com os comandos. Use sempre as mesmas palavras e gestos.",
    "🎯 Lembre-se: recompense imediatamente o comportamento correto para melhor aprendizado.",
    "⭐ Dica importante: Nunca use punição física. O reforço positivo é mais eficaz e saudável."
  ],
  
  horarios: [
    "🕐 A maioria dos nossos adestradores atende de segunda a sábado, das 8h às 18h.",
    "📞 Alguns profissionais oferecem atendimento em horários alternativos. Consulte o perfil do adestrador.",
    "🌅 Sessões matinais (7h-9h) são ideais para cães mais agitados - eles têm mais energia para aprender!"
  ],
  
  default: [
    "🤔 Interessante! Posso ajudar com: adestramento, comportamento, preços, cadastro, pagamentos ou agendamentos.",
    "❓ Não entendi bem. Você quer saber sobre nossos adestradores, como funciona a plataforma ou tem alguma dúvida específica?",
    "💡 Posso te ajudar com informações sobre adestramento canino, nossa plataforma ou como encontrar o adestrador ideal!"
  ]
};

function detectarCategoria(mensagem) {
  const msg = mensagem.toLowerCase();
  
  // Saudações
  if (msg.includes('oi') || msg.includes('olá') || msg.includes('ola') || msg.includes('bom dia') || msg.includes('boa tarde') || msg.includes('boa noite') || msg.includes('alo')) {
    return 'saudacao';
  }
  
  // Adestramento
  if (msg.includes('adestramento') || msg.includes('treinar') || msg.includes('treinamento') || msg.includes('ensinar') || msg.includes('educar') || msg.includes('obediência')) {
    return 'adestramento';
  }
  
  // Comportamento
  if (msg.includes('comportamento') || msg.includes('late') || msg.includes('morde') || msg.includes('agressivo') || msg.includes('destrói') || msg.includes('xixi') || msg.includes('cocô') || msg.includes('ansiedade') || msg.includes('estresse') || msg.includes('problema')) {
    return 'comportamento';
  }
  
  // Filhotes
  if (msg.includes('filhote') || msg.includes('cachorrinho') || msg.includes('puppy') || msg.includes('bebê') || msg.includes('pequeno') || msg.includes('jovem')) {
    return 'filhote';
  }
  
  // Preços
  if (msg.includes('preço') || msg.includes('valor') || msg.includes('custa') || msg.includes('quanto') || msg.includes('barato') || msg.includes('caro') || msg.includes('orçamento') || msg.includes('pagar')) {
    return 'preco';
  }
  
  // Plataforma
  if (msg.includes('plataforma') || msg.includes('app') || msg.includes('site') || msg.includes('como funciona') || msg.includes('pet mania') || msg.includes('petmania')) {
    return 'plataforma';
  }
  
  // Cadastro
  if (msg.includes('cadastro') || msg.includes('cadastrar') || msg.includes('registrar') || msg.includes('criar conta') || msg.includes('conta')) {
    return 'cadastro';
  }
  
  // Pagamento
  if (msg.includes('pagamento') || msg.includes('pagar') || msg.includes('cartão') || msg.includes('pix') || msg.includes('mercado pago') || msg.includes('segurança')) {
    return 'pagamento';
  }
  
  // Contato
  if (msg.includes('contato') || msg.includes('telefone') || msg.includes('email') || msg.includes('falar') || msg.includes('suporte')) {
    return 'contato';
  }
  
  // Agendamento
  if (msg.includes('agendar') || msg.includes('marcar') || msg.includes('horário') || msg.includes('data') || msg.includes('sessão') || msg.includes('consulta')) {
    return 'agendamento';
  }
  
  // Emergência
  if (msg.includes('emergência') || msg.includes('urgente') || msg.includes('socorro') || msg.includes('perigoso') || msg.includes('atacou') || msg.includes('mordeu')) {
    return 'emergencia';
  }
  
  // Dicas
  if (msg.includes('dica') || msg.includes('conselho') || msg.includes('como fazer') || msg.includes('ajuda') || msg.includes('não sei')) {
    return 'dicas';
  }
  
  // Horários
  if (msg.includes('horário') || msg.includes('quando') || msg.includes('que horas') || msg.includes('disponível') || msg.includes('funciona')) {
    return 'horarios';
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
      message: resposta
    };
  } catch (error) {
    return {
      success: false,
      message: 'Desculpe, ocorreu um erro. Tente novamente.'
    };
  }
}

module.exports = {
  sendMessage
};