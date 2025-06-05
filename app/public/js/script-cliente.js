   // Menu Mobile Toggle
        document.addEventListener('DOMContentLoaded', function() {
            const menuBtn = document.getElementById('menuBtn');
            const navLinks = document.getElementById('navLinks');
            
            if (menuBtn) {
                menuBtn.addEventListener('click', function() {
                    navLinks.classList.toggle('active');
                });
            }
            
            // Form Validation
            const cadastroForm = document.getElementById('cadastroForm');
            
            if (cadastroForm) {
                cadastroForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    if (validateForm()) {
                        // Simulação de envio bem-sucedido
                        document.getElementById('successMessage').style.display = 'block';
                        
                        // Resetar o formulário
                        cadastroForm.reset();
                        
                        // Redirecionar após 3 segundos (simulação)
                        setTimeout(function() {
                            window.location.href = 'login.html';
                        }, 3000);
                    }
                });
            }
            
            // Formatação de telefone
            const telefoneInput = document.getElementById('telefone');
            if (telefoneInput) {
                telefoneInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 11) {
                        if (value.length > 2) {
                            value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
                        }
                        if (value.length > 9) {
                            value = value.substring(0, 10) + '-' + value.substring(10);
                        }
                        e.target.value = value;
                    }
                });
            }
        });
        
        function validateForm() {
            let isValid = true;
            
            // Nome validação
            const nome = document.getElementById('nome');
            const nomeError = document.getElementById('nomeError');
            if (!nome.value.trim() || nome.value.trim().split(' ').length < 2) {
                nome.classList.add('error');
                nomeError.style.display = 'block';
                isValid = false;
            } else {
                nome.classList.remove('error');
                nomeError.style.display = 'none';
            }
            
            // Email validação
            const email = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.classList.add('error');
                emailError.style.display = 'block';
                isValid = false;
            } else {
                email.classList.remove('error');
                emailError.style.display = 'none';
            }
            
            // Telefone validação
            const telefone = document.getElementById('telefone');
            const telefoneError = document.getElementById('telefoneError');
            const telefoneClean = telefone.value.replace(/\D/g, '');
            if (telefoneClean.length < 10) {
                telefone.classList.add('error');
                telefoneError.style.display = 'block';
                isValid = false;
            } else {
                telefone.classList.remove('error');
                telefoneError.style.display = 'none';
            }
            
            // Cidade validação
            const cidade = document.getElementById('cidade');
            const cidadeError = document.getElementById('cidadeError');
            if (!cidade.value) {
                cidade.classList.add('error');
                cidadeError.style.display = 'block';
                isValid = false;
            } else {
                cidade.classList.remove('error');
                cidadeError.style.display = 'none';
            }
            
            // Endereço validação
            const endereco = document.getElementById('endereco');
            const enderecoError = document.getElementById('enderecoError');
            if (!endereco.value.trim()) {
                endereco.classList.add('error');
                enderecoError.style.display = 'block';
                isValid = false;
            } else {
                endereco.classList.remove('error');
                enderecoError.style.display = 'none';
            }
            
            // Nome do Pet validação
            const nomePet = document.getElementById('nomePet');
            const nomePetError = document.getElementById('nomePetError');
            if (!nomePet.value.trim()) {
                nomePet.classList.add('error');
                nomePetError.style.display = 'block';
                isValid = false;
            } else {
                nomePet.classList.remove('error');
                nomePetError.style.display = 'none';
            }
            
            // Raça do Pet validação
            const racaPet = document.getElementById('racaPet');
            const racaPetError = document.getElementById('racaPetError');
            if (!racaPet.value.trim()) {
                racaPet.classList.add('error');
                racaPetError.style.display = 'block';
                isValid = false;
            } else {
                racaPet.classList.remove('error');
                racaPetError.style.display = 'none';
            }
            
            // Idade do Pet validação
            const idadePet = document.getElementById('idadePet');
            const idadePetError = document.getElementById('idadePetError');
            if (!idadePet.value || idadePet.value < 0 || idadePet.value > 30) {
                idadePet.classList.add('error');
                idadePetError.style.display = 'block';
                isValid = false;
            } else {
                idadePet.classList.remove('error');
                idadePetError.style.display = 'none';
            }
            
            // Tipo de Adestramento validação
            const tipoCadastro = document.getElementById('tipoCadastro');
            const tipoCadastroError = document.getElementById('tipoCadastroError');
            if (!tipoCadastro.value) {
                tipoCadastro.classList.add('error');
                tipoCadastroError.style.display = 'block';
                isValid = false;
            } else {
                tipoCadastro.classList.remove('error');
                tipoCadastroError.style.display = 'none';
            }
            
            // Senha validação
            const senha = document.getElementById('senha');
            const senhaError = document.getElementById('senhaError');
            if (senha.value.length < 6) {
                senha.classList.add('error');
                senhaError.style.display = 'block';
                isValid = false;
            } else {
                senha.classList.remove('error');
                senhaError.style.display = 'none';
            }
            
            // Confirmar Senha validação
            const confirmarSenha = document.getElementById('confirmarSenha');
            const confirmarSenhaError = document.getElementById('confirmarSenhaError');
            if (confirmarSenha.value !== senha.value) {
                confirmarSenha.classList.add('error');
                confirmarSenhaError.style.display = 'block';
                isValid = false;
            } else {
                confirmarSenha.classList.remove('error');
                confirmarSenhaError.style.display = 'none';
            }
            
            // Termos validação
            const termos = document.getElementById('termos');
            if (!termos.checked) {
                isValid = false;
                // Destacar a seção de termos de alguma forma
            }
            
            return isValid;
        }