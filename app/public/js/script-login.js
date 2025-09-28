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
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-general';
    errorDiv.style.cssText = `
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
        animation: slideDown 0.3s ease-out;
    `;
    errorDiv.textContent = mensagem;

    // Inserir antes do formulário
    const loginContainer = document.querySelector('.login-container');
    const form = document.getElementById('loginForm');
    loginContainer.insertBefore(errorDiv, form);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => errorDiv.remove(), 300);
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
    const successDiv = document.createElement('div');
    successDiv.className = 'success-general';
    successDiv.style.cssText = `
        background: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
        animation: slideDown 0.3s ease-out;
    `;
    successDiv.textContent = mensagem;

    // Inserir antes do formulário
    const loginContainer = document.querySelector('.login-container');
    const form = document.getElementById('loginForm');
    loginContainer.insertBefore(successDiv, form);
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
        // Preparar dados para envio
        const dadosLogin = {
            email: emailInput.value.trim(),
            password: passwordInput.value,
            tipo: document.querySelector('input[name="tipo"]:checked')?.value || 'cliente'
        };
        
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
                window.location.href = resultado.redirecionarPara || '/paineladestrador.ejs';
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

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Limpar mensagens de erro
      clearErrors();

      // Coletar dados do formulário
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const tipo = document.querySelector('input[name="tipo"]:checked').value;

      // Validações básicas
      if (!email || !password) {
        showGenericError('Preencha todos os campos!');
        return;
      }

      try {
        // Desabilitar botão
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Entrando...';
        submitBtn.disabled = true;

        // Enviar requisição
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, tipo })
        });

        const result = await response.json();

        if (result.sucesso) {
          // Sucesso - redirecionar
          window.location.href = result.redirect;
        } else {
          // Erro - mostrar mensagem
          showGenericError(result.mensagem);
          
          // Reabilitar botão
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }

      } catch (error) {
        console.error('Erro no login:', error);
        showGenericError('Erro de conexão. Tente novamente.');
        
        // Reabilitar botão
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Entrar';
        submitBtn.disabled = false;
      }
    });
  }

  // Função para mostrar erro genérico
  function showGenericError(message) {
    // Remove erro anterior se existir
    const existingError = document.querySelector('.login-error');
    if (existingError) {
      existingError.remove();
    }

    // Cria novo elemento de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.style.cssText = `
      background-color: #fee;
      border: 1px solid #fcc;
      color: #c33;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 15px;
      text-align: center;
    `;
    errorDiv.textContent = message;

    // Inserir antes do formulário
    const loginContainer = document.querySelector('.login-container form');
    loginContainer.insertBefore(errorDiv, loginContainer.firstChild);

    // Remover após 5 segundos
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  // Função para limpar erros individuais
  function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
      error.style.display = 'none';
    });
    
    const loginError = document.querySelector('.login-error');
    if (loginError) {
      loginError.remove();
    }
  }

  // Menu mobile (se existir)
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
});