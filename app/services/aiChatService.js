class AIChatService {
  constructor() {
    this.respostas = {
      saudacao: [
        '🤖 Olá! Sou o PetBot, seu assistente virtual da Pet Mania! Estou aqui para ajudar com qualquer dúvida sobre pets, adestramento, comportamento animal ou nossa plataforma. O que você gostaria de saber?',
        '🐾 Oi! Bem-vindo à Pet Mania! Sou especializado em ajudar com questões sobre cães, adestramento, cuidados com pets e como usar nossa plataforma. Como posso te auxiliar hoje?',
        '🎆 Olá! Que ótimo ter você aqui! Posso ajudar com informações sobre adestramento, comportamento canino, cuidados com pets, dicas de saúde animal e muito mais. Qual sua dúvida?'
      ],
      adestramento: [
        '🎯 O adestramento é essencial para o bem-estar do seu pet! Envolve comandos básicos (sentar, ficar, vir), socialização, correção de comportamentos e desenvolvimento de habilidades. Na Pet Mania, nossos adestradores profissionais criam planos personalizados usando técnicas de reforço positivo. Cada cão é único e merece uma abordagem específica!',
        '📚 O adestramento vai muito além de ensinar truques! É sobre comunicação, confiança e estabelecer limites saudáveis. Inclui treinamento de obediência, socialização com outros animais e pessoas, controle de impulsos e resolução de problemas comportamentais. Nossos profissionais avaliam o temperamento, histórico e necessidades específicas do seu pet.',
        '🌟 O adestramento transforma a relação entre você e seu pet! Trabalha aspectos como ansiedade, agressividade, hiperatividade, destrutividade e medos. Utilizamos métodos científicos baseados em reforço positivo, respeitando o bem-estar animal. Quer conhecer nossos adestradores especializados?'
      ],
      comportamento: [
        '🧠 Comportamentos problemáticos como latidos excessivos, agressividade, ansiedade de separação, destrutividade, puxar a coleira, fazer necessidades em local inadequado, medo de ruídos ou pessoas têm causas específicas. Podem ser genéticas, ambientais, por falta de socialização ou traumas. Nossos especialistas identificam a origem e desenvolvem estratégias eficazes de modificação comportamental.',
        '⚡ Cada comportamento indesejado tem uma função para o animal - pode ser busca por atenção, medo, tédio, dor ou instinto natural mal direcionado. O trabalho comportamental envolve enriquecimento ambiental, exercícios mentais, estabelecimento de rotinas, dessensibilização gradual e contracondicionamento. É um processo que requer paciência e consistência.',
        '🎭 Problemas comportamentais afetam a qualidade de vida do pet e da família. Incluem fobias, compulsões, agressividade territorial, ciúmeira, hiperatividade e dificuldades de adaptação. Nossos profissionais usam técnicas como terapia comportamental, treinamento cognitivo e, quando necessário, trabalham junto com veterinários para abordagem multidisciplinar.'
      ],
      filhote: [
        '🐶 Filhotes de 8 semanas a 6 meses estão no período crítico de socialização! É quando desenvolvem personalidade, aprendem limites sociais e formam memórias que influenciarão toda a vida. O treinamento precoce inclui apresentação a diferentes pessoas, animais, sons, texturas e ambientes. Também ensinamos comandos básicos, controle de mordidas, onde fazer necessidades e como brincar adequadamente.',
        '🌱 A educação de filhotes é investimento no futuro! Trabalhamos prevenção de problemas comportamentais, estabelecimento de rotinas, adaptação à coleira e guia, socialização controlada e desenvolvimento de confiança. Filhotes aprendem rápido mas precisam de sessões curtas, lúdicas e positivas. Nossos adestradores especializam-se em métodos gentis e eficazes.',
        '🎆 Filhotes têm necessidades únicas! Além do adestramento, orientamos sobre nutrição adequada, cronograma de vacinação, brinquedos seguros, exercícios apropriados para a idade, cuidados com dentição e como criar um ambiente estimulante. O objetivo é formar um cão equilibrado, confiante e bem-socializado.'
      ],
      plataforma: [
        '💻 A Pet Mania é uma plataforma completa que conecta donos de pets a adestradores profissionais qualificados! Você pode navegar por perfis detalhados, ver especialidades, experiência, avaliações de clientes, preços e disponibilidade. Oferecemos sistema de agendamento online, chat direto com profissionais, acompanhamento de progresso e suporte contínuo.',
        '🔍 Nossa plataforma facilita encontrar o adestrador ideal! Filtre por localização, especialidade (obediência, comportamento, filhotes, etc.), faixa de preço e avaliações. Cada profissional tem perfil verificado com formação, certificados, métodos utilizados e depoimentos reais. Também oferecemos recursos educativos, dicas e artigos sobre cuidados com pets.',
        '📱 Além de conectar com adestradores, a Pet Mania oferece comunidade de donos de pets, fórum de dúvidas, calendário de vacinas, lembretes de cuidados, biblioteca de conteúdo educativo e suporte técnico. Tudo pensado para facilitar a vida de quem ama seus pets e busca o melhor cuidado profissional.'
      ],
      preco: [
        '💰 Os preços variam conforme experiência do profissional, tipo de treinamento, duração das sessões, localização e necessidades específicas do pet. Sessões individuais custam entre R$ 80-300. Pacotes mensais oferecem melhor custo-benefício. Alguns adestradores oferecem avaliação gratuita, desconto para múltiplos pets ou planos personalizados.',
        '💳 Investir em adestramento é economia a longo prazo! Previne destruição de objetos, problemas de saúde relacionados ao estresse, multas por perturbação e possíveis acidentes. Na plataforma você encontra opções para todos os orçamentos: desde adestradores iniciantes com preços acessíveis até especialistas renomados.',
        '🏷️ Compare serviços, metodologias e preços facilmente! Muitos profissionais oferecem consulta inicial para avaliar necessidades e orçar o trabalho. Alguns trabalham com sessões avulsas, outros preferem pacotes. Há opções de atendimento domiciliar, em parques ou no espaço do adestrador. Escolha o que melhor se adapta ao seu orçamento e necessidades.'
      ],
      geral: [
        '🤖 Posso ajudar com diversas questões sobre pets! Desde cuidados básicos, nutrição, saúde, comportamento, adestramento, socialização, escolha de raças, adaptação de novos pets, viagens com animais, legislação pet-friendly, produtos recomendados e muito mais. Qual assunto te interessa?',
        '🐾 Sou especialista em questões caninas mas também posso orientar sobre bem-estar animal em geral, relacionamento humano-animal, psicologia canina, etologia, cuidados preventivos, primeiros socorros básicos, enriquecimento ambiental e como criar um lar pet-friendly. O que você gostaria de saber?',
        '🌟 Além de conectar com adestradores, posso esclarecer dúvidas sobre desenvolvimento canino, fases da vida do cão, necessidades por idade, sinais de estresse ou doença, importância do exercício físico e mental, brinquedos educativos e como fortalecer o vínculo com seu pet. Estou aqui para ajudar!'
      ]
    };
  }

  async processMessage(userMessage) {
    const message = userMessage.toLowerCase();
    let categoria = 'geral';
    
    if (message.includes('oi') || message.includes('olá') || message.includes('bom dia') || message.includes('boa tarde') || message.includes('boa noite') || message.includes('hey') || message.includes('e ai')) {
      categoria = 'saudacao';
    } else if (message.includes('adestramento') || message.includes('treinar') || message.includes('ensinar') || message.includes('comando') || message.includes('obediência')) {
      categoria = 'adestramento';
    } else if (message.includes('comportamento') || message.includes('agressivo') || message.includes('late') || message.includes('morde') || message.includes('ansiedade') || message.includes('medo') || message.includes('estresse') || message.includes('destrutivo')) {
      categoria = 'comportamento';
    } else if (message.includes('filhote') || message.includes('puppy') || message.includes('bebê') || message.includes('cachorrinho') || message.includes('socializa')) {
      categoria = 'filhote';
    } else if (message.includes('plataforma') || message.includes('como funciona') || message.includes('usar') || message.includes('site') || message.includes('app') || message.includes('cadastro')) {
      categoria = 'plataforma';
    } else if (message.includes('preço') || message.includes('valor') || message.includes('custa') || message.includes('pagar') || message.includes('orçamento') || message.includes('barato') || message.includes('caro')) {
      categoria = 'preco';
    }
    
    const respostas = this.respostas[categoria];
    const resposta = respostas[Math.floor(Math.random() * respostas.length)];
    
    return { success: true, message: resposta };
  }
}

const aiChatService = new AIChatService();
aiChatService.sendMessage = aiChatService.processMessage;
module.exports = aiChatService;