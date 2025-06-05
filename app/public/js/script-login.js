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
        
        loginForm.addEventListener('submit', function(e) {
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
                // Normally you would submit the form to the server here
                // For now, we'll just redirect to a hypothetical dashboard
                alert('Login realizado com sucesso!');
                window.location.href = 'index.html';
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