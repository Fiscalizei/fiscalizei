// tarefa-cadastro.js

Sidebar.init('criar');

const API_URL = 'http://localhost:8080/api/tarefa';
const COLABORADORES_URL = 'http://localhost:8080/api/usuario/colaboradores';

const taskForm = document.getElementById('taskForm');
const btn      = document.getElementById('btn-criar');
const feedback = document.getElementById('feedback');
const selectUsuario = document.getElementById('usuarioAtribuidoId');

function getAdminCriadorId() {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  return userData.id || null;
}

function getFormData() {
  return {
    nome: document.getElementById('nome').value.trim(),
    descricao: document.getElementById('descricao').value.trim(),
    recorrencia: document.getElementById('recorrencia').value,
    usuarioAtribuidoId: Number(selectUsuario.value),
    adminCriadorId: getAdminCriadorId(),
  };
}

function validate(data) {
  if (!data.nome) return 'Informe o nome da tarefa.';
  if (!data.descricao) return 'Informe a descrição.';
  if (!data.recorrencia) return 'Selecione a recorrência.';
  if (!data.usuarioAtribuidoId) return 'Selecione o usuário atribuído.';
  if (!data.adminCriadorId) return 'Não foi possível identificar o administrador logado.';
  return null;
}

function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className = `feedback ${type}`;
}

function resetForm() {
  document.getElementById('nome').value = '';
  document.getElementById('descricao').value = '';
  document.getElementById('recorrencia').selectedIndex = 0;
  selectUsuario.selectedIndex = 0;
}

async function carregarColaboradores() {
  if (!selectUsuario) return;

  selectUsuario.innerHTML = '<option value="" disabled selected>Carregando colaboradores...</option>';

  try {
    const resposta = await fetch(COLABORADORES_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}`);
    }

    const colaboradores = await resposta.json();
    selectUsuario.innerHTML = '<option value="" disabled selected>Selecione</option>';

    colaboradores.forEach((colaborador) => {
      const option = document.createElement('option');
      option.value = colaborador.id;
      option.textContent = colaborador.nome;
      selectUsuario.appendChild(option);
    });
  } catch (erro) {
    selectUsuario.innerHTML = '<option value="" disabled selected>Não foi possível carregar</option>';
    showFeedback(`Falha ao carregar colaboradores: ${erro.message}`, 'error');
  }
}

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showFeedback('', '');

  const data = getFormData();
  const error = validate(data);

  if (error) {
    showFeedback(error, 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Criando...';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Erro ${response.status}`);
    }

    showFeedback('Tarefa criada com sucesso!', 'success');
    resetForm();
  } catch (err) {
    showFeedback(`Falha ao criar tarefa: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Criar tarefa';
  }
});

carregarColaboradores();
