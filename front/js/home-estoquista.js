const tasks = [
    { title: "Conferir recebimento da carga", subtitle: "Corredor A", id: "#TH123" },
    { title: "Conferir recebimento da carga", subtitle: "Corredor B", id: "#TH124" },
    { title: "Verificar qualidade do produto", subtitle: "Armazém 1", id: "#TH125" },
    { title: "Organizar estoque", subtitle: "Seção C", id: "#TH126" },
    { title: "Reabastecer prateleiras", subtitle: "Corredor D", id: "#TH127" }
];

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
        <div class="task-icon">
            <img src="recursos/imagens/icon-task.svg" alt="">
        </div>
        <div class="task-content">
          <div class="task-title">${task.title}</div>
          <div class="task-subtitle">- ${task.subtitle}</div>
          <div class="task-id">ID: ${task.id}</div>
        </div>
        <button class="pending-btn">Pendente</button>
      `;
    return card;
}

function loadTasks() {
    const container = document.getElementById('tasks-list');
    container.innerHTML = '';
    tasks.forEach(task => {
        container.appendChild(createTaskCard(task));
    });
}

function changeTab(tabElement) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    tabElement.classList.add('active');
    // Aqui você pode filtrar as tarefas no futuro
}

// Carregar tarefas ao iniciar
window.onload = loadTasks;
