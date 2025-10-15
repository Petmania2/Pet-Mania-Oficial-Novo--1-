// Gerenciamento de autenticação no header
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/check-auth');
        const data = await response.json();
        
        const contaLink = document.getElementById('contaLink');
        const navLinks = document.querySelector('.nav-links');
        
        if (data.loggedIn && data.user) {
            // Usuário está logado
            const tipo = data.user.tipo;
            
            // Atualizar link "Conta" para redirecionar ao painel correto
            if (contaLink) {
                contaLink.href = tipo === 'cliente' ? '/painelcliente' : '/paineladestrador';
            }
            
            // Trocar botão "Entrar" por "Sair"
            const entrarBtn = navLinks.querySelector('a[href="Login.ejs"]');
            if (entrarBtn) {
                entrarBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
                entrarBtn.href = '#';
                entrarBtn.addEventListener('click', async function(e) {
                    e.preventDefault();
                    await logout();
                });
            }
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
    }
});

async function logout() {
    try {
        const response = await fetch('/logout', { method: 'POST' });
        const data = await response.json();
        
        if (data.sucesso) {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        window.location.href = '/';
    }
}
