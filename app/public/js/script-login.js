document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    document.getElementById('menuBtn').addEventListener('click', function() {
        document.getElementById('navLinks').classList.toggle('active');
    });
    
    // Form validation
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate email
        if (!emailInput.value || !isValidEmail(emailInput.value)) {
            emailError.style.display = 'block';
            emailInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            emailError.style.display = 'none';
            emailInput.style.borderColor = '#ddd';
        }
        
        // Validate password
        if (!passwordInput.value) {
            passwordError.style.display = 'block';
            passwordInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            passwordError.style.display = 'none';
            passwordInput.style.borderColor = '#ddd';
        }
        
        if (isValid) {
            try {
                // Enviar dados para o servidor
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: emailInput.value,
                        password: passwordInput.value
                    })
                });

                const resultado = await response.json();

                if (resultado.sucesso) {
                    alert(resultado.mensagem);
                    // Redirecionar para o painel
                    window.location.href = resultado.redirecionarPara;
                } else {
                    alert('Erro: ' + resultado.erro);
                }

            } catch (error) {
                console.error('Erro ao fazer login:', error);
                alert('Erro ao processar login. Tente novamente.');
            }
        }
    });
    
    // Email validation helper function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Clear error messages on input
    emailInput.addEventListener('input', function() {
        emailError.style.display = 'none';
        emailInput.style.borderColor = '#ddd';
    });
    
    passwordInput.addEventListener('input', function() {
        passwordError.style.display = 'none';
        passwordInput.style.borderColor = '#ddd';
    });
});