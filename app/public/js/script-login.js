document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Form validation
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    // Função para mostrar/ocultar erro
    function showError(input, errorElement, show, message = '') {
        if (errorElement) {
            errorElement.style.display = show ? 'block' : 'none';
            if (message) errorElement.textContent = message;
        }
        if (input) {
            input.style.borderColor = show ? '#e74c3c' : '#ddd';
        }
    }
    
    // Validação de email em tempo real
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            showError(emailInput, emailError, true, 'Por favor, insira um email válido');
        } else {
            showError(emailInput, emailError, false);
        }
    });
    
    // Validação de senha em tempo real
    passwordInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            showError(passwordInput, passwordError, false);
        }
    });
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate email
        const email = emailInput.value.trim();
        if (!email) {
            showError(emailInput, emailError, true, 'O email é obrigatório');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(emailInput, emailError, true, 'Por favor, insira um email válido');
            isValid = false;
        } else {
            showError(emailInput, emailError, false);
        }
        
        // Validate password
        const password = passwordInput.value;
        if (!password) {
            showError(passwordInput, passwordError, true, 'A senha é obrigatória');
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordInput, passwordError, true, 'A senha deve ter pelo menos 6 caracteres');
            isValid = false;
        } else {
            showError(passwordInput, passwordError, false);
        }
        
        if (isValid) {
            try {
                // Mostrar loading no botão
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Entrando...';
                submitBtn.disabled = true;
                
                // Enviar dados para o servidor
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                const resultado = await response.json();

                if (resultado.sucesso) {
                    // Mostrar mensagem de sucesso
                    showSuccessMessage(resultado.mensagem);
                    
                    // Limpar form
                    loginForm.reset();
                    
                    // Redirecionar após 1 segundo
                    setTimeout(() => {
                        window.location.href = resultado.redirecionarPara;
                    }, 1000);
                } else {
                    // Mostrar erro específico
                    showErrorMessage(resultado.erro);
                    
                    // Se o erro for de credenciais, focar no campo email
                    if (resultado.erro.includes('Email') || resultado.erro.includes('senha')) {
                        emailInput.focus();
                    }
                }

            } catch (error) {
                console.error('Erro ao fazer login:', error);
                showErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
            } finally {
                // Restaurar botão
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } else {
            // Focar no primeiro campo com erro
            if (emailError.style.display === 'block') {
                emailInput.focus();
            } else if (passwordError.style.display === 'block') {
                passwordInput.focus();
            }
        }
    });
    
    // Email validation helper function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Função para mostrar mensagem de sucesso
    function showSuccessMessage(message) {
        // Remover mensagens anteriores
        removeMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background-color: #d4edda;
            color: #155724;
            padding: 12px;
            border: 1px solid #c3e6cb;
            border-radius: 4px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
        `;
        successDiv.textContent = message;
        
        loginForm.insertBefore(successDiv, loginForm.firstChild);
    }
    
    // Função para mostrar mensagem de erro
    function showErrorMessage(message) {
        // Remover mensagens anteriores
        removeMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-general';
        errorDiv.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            padding: 12px;
            border: 1px solid #f5c6cb;
            border-radius: 4px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
        `;
        errorDiv.textContent = message;
        
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        
        // Remover mensagem após 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    // Função para remover mensagens anteriores
    function removeMessages() {
        const successMsg = loginForm.querySelector('.success-message');
        const errorMsg = loginForm.querySelector('.error-message-general');
        
        if (successMsg) successMsg.remove();
        if (errorMsg) errorMsg.remove();
    }
    
    // Permitir login com Enter
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });
    
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Focar no campo email ao carregar a página
    emailInput.focus();
});