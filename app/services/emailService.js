const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
  }

  async enviarEmailBoasVindas(email, nome, tipo) {
    try {
      const assunto = `🐾 Bem-vindo à Pet Mania, ${nome}!`;
      
      const htmlContent = this.gerarTemplateBoasVindas(nome, tipo);
      
      const mailOptions = {
        from: `"Pet Mania" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: assunto,
        html: htmlContent
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de boas-vindas enviado para ${email}:`, info.messageId);
      return { sucesso: true, messageId: info.messageId };
      
    } catch (error) {
      console.error(`❌ Erro ao enviar email para ${email}:`, error.message);
      return { sucesso: false, erro: error.message };
    }
  }

  gerarTemplateBoasVindas(nome, tipo) {
    const isAdestrador = tipo === 'adestrador';
    
    return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo à Pet Mania</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <section style="background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%); padding: 40px 30px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <img src="http://localhost:3000/imagens/petlogo.png" alt="Pet Mania" style="height: 60px; margin-bottom: 15px;">
            <h1 style="color: white; margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Pet Mania</h1>
            <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0 0; font-size: 16px; font-weight: 500;">Conectando pets e adestradores com amor</p>
        </section>
        
        <section style="background: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #FF8C00; margin-top: 0; font-size: 24px;">Olá, ${nome}! 👋</h2>
            
            <p style="font-size: 16px; margin-bottom: 25px; color: #555;">
                Seja muito bem-vindo(a) à <strong style="color: #FFA500;">Pet Mania</strong>! Estamos muito felizes em tê-lo(a) conosco.
            </p>
            
            ${isAdestrador ? `
            <section style="background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #FFA500; box-shadow: 0 2px 4px rgba(255,165,0,0.1);">
                <h3 style="color: #FF8C00; margin-top: 0; font-size: 20px;">🎯 Como Adestrador, você pode:</h3>
                <ul style="color: #666; margin: 15px 0; padding-left: 20px; line-height: 1.8;">
                    <li>Gerenciar seu perfil profissional</li>
                    <li>Receber solicitações de clientes</li>
                    <li>Agendar sessões de adestramento</li>
                    <li>Acompanhar seus ganhos</li>
                    <li>Expandir sua rede de clientes</li>
                </ul>
            </section>
            ` : `
            <section style="background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #FFA500; box-shadow: 0 2px 4px rgba(255,165,0,0.1);">
                <h3 style="color: #FF8C00; margin-top: 0; font-size: 20px;">🐕 Como Cliente, você pode:</h3>
                <ul style="color: #666; margin: 15px 0; padding-left: 20px; line-height: 1.8;">
                    <li>Encontrar adestradores qualificados</li>
                    <li>Agendar sessões para seu pet</li>
                    <li>Acompanhar o progresso do treinamento</li>
                    <li>Avaliar os serviços recebidos</li>
                    <li>Gerenciar informações dos seus pets</li>
                </ul>
            </section>
            `}
            
            <section style="text-align: center; margin: 35px 0;">
                <a href="http://localhost:3000/${isAdestrador ? 'paineladestrador.ejs' : 'painelcliente.ejs'}" 
                   style="background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 8px rgba(255,140,0,0.3);">
                    🚀 Acessar Meu Painel
                </a>
            </section>
            
            <section style="background: linear-gradient(135deg, #fff9e6 0%, #fff3cc 100%); padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #FFB84D;">
                <p style="margin: 0; color: #996600; font-size: 15px;">
                    <strong>💡 Dica:</strong> Complete seu perfil para ter mais visibilidade e melhores resultados na plataforma!
                </p>
            </section>
            
            <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 35px 0;">
            
            <section style="text-align: center; color: #666; font-size: 14px;">
                <p style="font-weight: 600; color: #FF8C00; margin-bottom: 15px;">Precisa de ajuda? Entre em contato conosco:</p>
                <p style="line-height: 1.8;">
                    📧 <a href="mailto:petmania20072008@gmail.com" style="color: #FFA500; text-decoration: none; font-weight: 500;">petmania20072008@gmail.com</a><br>
                    📱 (11) 99999-9999<br>
                    🌐 <a href="http://localhost:3000" style="color: #FFA500; text-decoration: none; font-weight: 500;">www.petmania.com.br</a>
                </p>
                
                <section style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
                    <p style="margin: 0; font-size: 12px; color: #999; line-height: 1.6;">
                        © 2025 Pet Mania. Todos os direitos reservados.<br>
                        Este é um email automático, não responda a esta mensagem.
                    </p>
                </section>
            </section>
        </section>
    </body>
    </html>
    `;
  }
}

module.exports = new EmailService();
