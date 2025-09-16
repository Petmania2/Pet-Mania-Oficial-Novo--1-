const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
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
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🐾 Pet Mania</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Conectando pets e adestradores</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
            <h2 style="color: #333; margin-top: 0;">Olá, ${nome}! 👋</h2>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
                Seja muito bem-vindo(a) à <strong>Pet Mania</strong>! Estamos muito felizes em tê-lo(a) conosco.
            </p>
            
            ${isAdestrador ? `
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                <h3 style="color: #2e7d32; margin-top: 0;">🎯 Como Adestrador, você pode:</h3>
                <ul style="color: #2e7d32; margin: 10px 0;">
                    <li>Gerenciar seu perfil profissional</li>
                    <li>Receber solicitações de clientes</li>
                    <li>Agendar sessões de adestramento</li>
                    <li>Acompanhar seus ganhos</li>
                    <li>Expandir sua rede de clientes</li>
                </ul>
            </div>
            ` : `
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3;">
                <h3 style="color: #1565c0; margin-top: 0;">🐕 Como Cliente, você pode:</h3>
                <ul style="color: #1565c0; margin: 10px 0;">
                    <li>Encontrar adestradores qualificados</li>
                    <li>Agendar sessões para seu pet</li>
                    <li>Acompanhar o progresso do treinamento</li>
                    <li>Avaliar os serviços recebidos</li>
                    <li>Gerenciar informações dos seus pets</li>
                </ul>
            </div>
            `}
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/${isAdestrador ? 'paineladestrador.ejs' : 'painelcliente.ejs'}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
                    🚀 Acessar Meu Painel
                </a>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404;">
                    <strong>💡 Dica:</strong> Complete seu perfil para ter mais visibilidade e melhores resultados na plataforma!
                </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
                <p>Precisa de ajuda? Entre em contato conosco:</p>
                <p>
                    📧 <a href="mailto:contato@petmania.com.br" style="color: #667eea;">contato@petmania.com.br</a><br>
                    📱 (11) 99999-9999<br>
                    🌐 <a href="http://localhost:3000" style="color: #667eea;">www.petmania.com.br</a>
                </p>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <p style="margin: 0; font-size: 12px; color: #999;">
                        © 2025 Pet Mania. Todos os direitos reservados.<br>
                        Este é um email automático, não responda a esta mensagem.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

module.exports = new EmailService();