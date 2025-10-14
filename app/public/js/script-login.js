// Validação de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Mostrar/esconder mensagens de erro
function mostrarErro(campo, mensagem = null, mostrar = true) {
    const formGroup = campo.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (mostrar) {
        campo.classList.add('error');
        if (mensagem) {
            errorMessage.textContent = mensagem;
        }
        errorMessage.style.display = 'block';
    } else {
        campo.classList.remove('error');
        errorMessage.style.display = 'none';
    }
}

// Validar campo individual
function validarCampo(campo) {
    const valor = campo.value.trim();
    const tipo = campo.type;
    let valido = true;
    let mensagem = '';

    if (tipo === 'email') {
        if (!valor) {
            valido = false;
            mensagem = 'Email é obrigatório';
        } else if (!validarEmail(valor)) {
            valido = false;
            mensagem = 'Por favor, insira um email válido';
        }
    } else if (tipo === 'password') {
        if (!valor) {
            valido = false;
            mensagem = 'Senha é obrigatória';
        } else if (valor.length < 6) {
            valido = false;
            mensagem = 'Senha deve ter pelo menos 6 caracteres';
        }
    }

    mostrarErro(campo, mensagem, !valido);
    return valido;
}

// Mostrar mensagem de erro geral
function mostrarErroGeral(mensagem) {
    // Remover mensagem anterior se existir
    const erroAnterior = document.querySelector('.error-general');
    if (erroAnterior) {
        erroAnterior.remove();
    }

    // Criar nova mensagem de erro
    const errorSection = document.createElement('section');
    errorSection.className = 'error-general';
    errorSection.style.cssText = `
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
        animation: slideDown 0.3s ease-out;
    `;
    errorSection.textContent = mensagem;

    // Inserir antes do formulário - com verificação de segurança
    const form = document.getElementById('loginForm');
    const loginContainer = form.parentElement;
    loginContainer.insertBefore(errorSection, form);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (errorSection.parentNode) {
            errorSection.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => errorSection.remove(), 300);
        }
    }, 5000);
}

// Mostrar mensagem de sucesso
function mostrarSucesso(mensagem) {
    // Remover mensagem anterior se existir
    const sucessoAnterior = document.querySelector('.success-general');
    if (sucessoAnterior) {
        sucessoAnterior.remove();
    }

    // Criar nova mensagem de sucesso
    const successSection = document.createElement('section');
    successSection.className = 'success-general';
    successSection.style.cssText = `
        background: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
        animation: slideDown 0.3s ease-out;
    `;
    successSection.textContent = mensagem;

    // Inserir antes do formulário - com verificação de segurança
    const form = document.getElementById('loginForm');
    const loginContainer = form.parentElement;
    loginContainer.insertBefore(successSection, form);
}

// Desabilitar/habilitar botão de submit
function toggleSubmitButton(desabilitar = false) {
    const submitBtn = document.querySelector('button[type="submit"]');
    const textoOriginal = 'Entrar';
    const textoCarregando = 'Entrando...';
    
    if (desabilitar) {
        submitBtn.disabled = true;
        submitBtn.textContent = textoCarregando;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = textoOriginal;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
    }
}

// Event listeners para validação em tempo real
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Validação em tempo real
    emailInput.addEventListener('blur', function() {
        validarCampo(this);
    });
    
    emailInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            validarCampo(this);
        }
    });
    
    passwordInput.addEventListener('blur', function() {
        validarCampo(this);
    });
    
    passwordInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            validarCampo(this);
        }
    });

    // Permitir enter para submeter o formulário
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });
    
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }
    });
});

// Submissão do formulário
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Validar campos
    const emailValido = validarCampo(emailInput);
    const senhaValida = validarCampo(passwordInput);
    
    if (!emailValido || !senhaValida) {
        mostrarErroGeral('Por favor, corrija os erros no formulário.');
        return;
    }
    
    // Desabilitar botão e mostrar loading
    toggleSubmitButton(true);
    
    try {
        // Verificar se o tipo foi selecionado
        const tipoSelecionado = document.querySelector('input[name="tipo"]:checked');
        if (!tipoSelecionado) {
            mostrarErroGeral('Selecione o tipo de usuário (Cliente ou Adestrador)');
            return;
        }
        
        // Preparar dados para envio
        const dadosLogin = {
            email: emailInput.value.trim(),
            password: passwordInput.value,
            tipo: tipoSelecionado.value
        };
        
        console.log('Dados do login:', dadosLogin);
        
        // Enviar dados para o servidor
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosLogin)
        });
        
        const resultado = await response.json();
        
        if (resultado.sucesso) {
            mostrarSucesso(resultado.mensagem);
            
            // Redirecionar após breve delay
            setTimeout(() => {
                window.location.href = resultado.redirecionarPara;
            }, 1000);
            
        } else {
            mostrarErroGeral(resultado.erro || 'Email ou senha incorretos.');
        }
        
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        mostrarErroGeral('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
        // Reabilitar botão
        toggleSubmitButton(false);
    }
});

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ff4444 !important;
        box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2) !important;
    }
    
    .error-message {
        color: #ff4444;
        font-size: 14px;
        margin-top: 5px;
        display: none;
    }
    
    button[type="submit"]:disabled {
        background-color: #ccc !important;
        cursor: not-allowed !important;
    }
`;
document.head.appendChild(style);