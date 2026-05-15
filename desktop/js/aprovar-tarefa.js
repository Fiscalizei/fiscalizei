// aprovar-tarefa.js

Sidebar.init('aprovacao');

// ─── Configuração ────────────────────────────────────────────────────────────
// ID da tarefa pode vir da query string: ?tarefaId=123
const params   = new URLSearchParams(window.location.search);
const TAREFA_ID = params.get('tarefaId') || 'demo';
const API_BASE  = 'http://localhost/api/tarefa';

// ─── Elementos ────────────────────────────────────────────────────────────────
const btnAprovar  = document.getElementById('btn-aprovar');
const btnReprovar = document.getElementById('btn-reprovar');
const toast       = document.getElementById('toast');
const timestamp   = document.getElementById('timestamp');

// ─── Formata timestamp ao carregar ───────────────────────────────────────────
(function setTimestamp() {
  const now = new Date();
  const hora = now.toLocaleTimeString('pt-BR');
  const data = now.toLocaleDateString('pt-BR');
  timestamp.textContent = `Horário do envio: ${hora} — ${data}`;
})();

// ─── Toast helper ─────────────────────────────────────────────────────────────
function showToast(msg, type /* 'aprovado' | 'reprovado' */, duration = 4000) {
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = 'toast';
  }, duration);
}

// ─── Ação genérica ────────────────────────────────────────────────────────────
async function executarAcao(acao /* 'aprovar' | 'reprovar' */) {
  btnAprovar.disabled  = true;
  btnReprovar.disabled = true;

  try {
    const response = await fetch(`${API_BASE}/${TAREFA_ID}/${acao}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tarefaId: TAREFA_ID, acao }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Erro ${response.status}`);
    }

    if (acao === 'aprovar') {
      showToast('✅ Tarefa aprovada com sucesso!', 'aprovado');
    } else {
      showToast('❌ Tarefa reprovada.', 'reprovado');
    }

  } catch (err) {
    showToast(`⚠️ Falha: ${err.message}`, 'reprovado', 6000);
  } finally {
    // Re-habilita após 3 s para permitir nova ação se necessário
    setTimeout(() => {
      btnAprovar.disabled  = false;
      btnReprovar.disabled = false;
    }, 3000);
  }
}

// ─── Listeners ────────────────────────────────────────────────────────────────
btnAprovar.addEventListener('click',  () => executarAcao('aprovar'));
btnReprovar.addEventListener('click', () => executarAcao('reprovar'));
