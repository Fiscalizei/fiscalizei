// tarefa-cadastro.js

Sidebar.init('criar');

const API_URL = 'http://localhost/api/tarefa';

const btn      = document.getElementById('btn-criar');
const feedback = document.getElementById('feedback');

function getFormData() {
  return {
    nome:       document.getElementById('nome').value.trim(),
    descricao:  document.getElementById('descricao').value.trim(),
    recorrencia: document.getElementById('recorrencia').value,
    atribuicao: document.getElementById('atribuicao').value,
  };
}

function validate(data) {
  if (!data.nome)        return 'Informe o nome da tarefa.';
  if (!data.descricao)   return 'Informe a descrição.';
  if (!data.recorrencia) return 'Selecione a recorrência.';
  if (!data.atribuicao)  return 'Selecione a atribuição.';
  return null;
}

function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className = `feedback ${type}`;
}

btn.addEventListener('click', async () => {
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

    // Limpa o formulário
    document.getElementById('nome').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('recorrencia').selectedIndex = 0;
    document.getElementById('atribuicao').selectedIndex = 0;

  } catch (err) {
    showFeedback(`Falha ao criar tarefa: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Criar tarefa';
  }
});
