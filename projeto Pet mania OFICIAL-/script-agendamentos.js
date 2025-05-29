document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    const novoAgendamentoBtn = document.getElementById('novoAgendamento');
    const novoAgendamentoModal = document.getElementById('novoAgendamentoModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const novoAgendamentoForm = document.getElementById('novoAgendamentoForm');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const aplicarFiltrosBtn = document.getElementById('aplicarFiltros');

    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // Open new scheduling modal
    novoAgendamentoBtn.addEventListener('click', () => {
        novoAgendamentoModal.style.display = 'block';
    });

    // Close modal when clicking 'x'
    closeModalBtn.addEventListener('click', () => {
        novoAgendamentoModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === novoAgendamentoModal) {
            novoAgendamentoModal.style.display = 'none';
        }
    });

    // Handle new scheduling form submission
    novoAgendamentoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const cliente = document.getElementById('cliente').value;
        const data = document.getElementById('data').value;
        const horario = document.getElementById('horario').value;
        const tipoSessao = document.getElementById('tipoSessao').value;
        const local = document.getElementById('local').value;

        if (cliente && data && horario && tipoSessao && local) {
            // Here you would typically send this data to a backend
            alert('Agendamento criado com sucesso!');
            novoAgendamentoModal.style.display = 'none';
            novoAgendamentoForm.reset();
        }
    });

    // Filtering functionality
    aplicarFiltrosBtn.addEventListener('click', () => {
        const selectedStatus = statusFilter.value;
        const selectedDate = dateFilter.value;
        const schedulingItems = document.querySelectorAll('.scheduling-item');

        schedulingItems.forEach(item => {
            const statusElement = item.querySelector('.scheduling-status');
            const dateElement = item.querySelector('.scheduling-date');

            const statusMatch = selectedStatus === 'todos' || 
                statusElement.classList.contains(selectedStatus);
            
            const dateMatch = !selectedDate || 
                dateElement.textContent.includes(new Date(selectedDate).toLocaleDateString('pt-BR', { month: 'short' }));

            item.style.display = (statusMatch && dateMatch) ? 'flex' : 'none';
        });
    });
});