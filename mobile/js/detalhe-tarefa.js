var fotoSelecionada = null;
var tarefaAtual     = null;
var estadoAtual     = 'enviar';

// ─── Lê o ID da URL ──────────────────────────────────────
function getIdDaUrl() {
    return new URLSearchParams(window.location.search).get('id');
}

// ─── Busca a tarefa ───────────────────────────────────────
async function buscarTarefa(id) {

    var token = localStorage.getItem('token') || '';
    var resposta = await fetch('http://localhost:8080/api/tarefa/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    if (!resposta.ok) throw new Error('Tarefa não encontrada (status ' + resposta.status + ')');
    return await resposta.json();
}

// ─── Solicita câmera/galeria do dispositivo ───────────────
function solicitarFoto() {
    if (estadoAtual === 'aguardando' || estadoAtual === 'aprovado') return;

    var input     = document.createElement('input');
    input.type    = 'file';
    input.accept  = 'image/*';
    input.capture = 'environment'; // abre câmera traseira no mobile

    input.onchange = function(e) {
        var arquivo = e.target.files[0];
        if (!arquivo) return;
        fotoSelecionada = arquivo;

        var reader = new FileReader();
        reader.onload = function(ev) {
            atualizarPreviewFoto(ev.target.result);
            if (estadoAtual === 'reprovado') mudarEstado('enviar');
        };
        reader.readAsDataURL(arquivo);
    };

    input.click();
}

// ─── Atualiza o preview da foto na área de upload ─────────
function atualizarPreviewFoto(src) {
    var preview = document.getElementById('uploadPreview');
    var icone   = document.getElementById('uploadIcone');
    var texto   = document.getElementById('uploadTexto');
    var overlay = document.getElementById('reprovadoOverlay');
    var area    = document.getElementById('uploadArea');

    if (preview) { preview.src = src; preview.style.display = 'block'; }
    if (icone)   icone.style.display = 'none';
    if (texto)   texto.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    if (area)    area.classList.remove('reprovado');
}

// ─── Muda o estado visual da tela ────────────────────────
function mudarEstado(novoEstado) {
    estadoAtual = novoEstado;

    var btnAcao    = document.getElementById('btnAcao');
    var uploadArea = document.getElementById('uploadArea');
    var overlay    = document.getElementById('reprovadoOverlay');

    if (novoEstado === 'enviar') {
        btnAcao.textContent = 'Enviar Evidência';
        btnAcao.className   = 'btn-acao enviar';
        btnAcao.disabled    = false;
        if (uploadArea) uploadArea.classList.remove('reprovado');
        if (overlay)    overlay.style.display = 'none';
    }

    if (novoEstado === 'aguardando') {
        btnAcao.textContent = 'Aguardando...';
        btnAcao.className   = 'btn-acao aguardando';
        btnAcao.disabled    = true;
    }

    if (novoEstado === 'aprovado') {
        btnAcao.textContent = 'Aprovado';
        btnAcao.className   = 'btn-acao aprovado';
        btnAcao.disabled    = true;
    }

    if (novoEstado === 'reprovado') {
        btnAcao.textContent = 'Reprovado';
        btnAcao.className   = 'btn-acao reprovado';
        btnAcao.disabled    = true;
        if (uploadArea) uploadArea.classList.add('reprovado');
        if (overlay)    overlay.style.display = 'flex';
        // No estado reprovado, clicar na área permite tirar nova foto
        if (uploadArea) uploadArea.onclick = function() { solicitarFoto(); };
    }
}

// ─── Envio da evidência ───────────────────────────────────
async function enviarEvidencia() {
    if (!fotoSelecionada) {
        alert('Por favor, adicione uma foto antes de enviar.');
        return;
    }

    mudarEstado('aguardando');

    try {

        // TODO: troque pelo bloco comentado abaixo quando a API estiver pronta
        await new Promise(function(r) { setTimeout(r, 2000); }); // simula aprovação
        var aprovado = Math.random() > 0.5;                       // alterna para testar os dois estados
        mudarEstado(aprovado ? 'aprovado' : 'reprovado');

        /*
        var token = localStorage.getItem('token') || '';
        var formData = new FormData();
        formData.append('foto', fotoSelecionada);
        formData.append('tarefaId', tarefaAtual.id);

        var resposta = await fetch('http://localhost:8080/api/evidencias', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData
        });

        if (!resposta.ok) throw new Error('Erro ' + resposta.status);

        var resultado = await resposta.json();
        // A API deve retornar { aprovado: true } ou { aprovado: false }
        mudarEstado(resultado.aprovado ? 'aprovado' : 'reprovado');
        */

    } catch (erro) {
        alert(erro.message || 'Erro ao enviar. Tente novamente.');
        mudarEstado('enviar');
    }
}

// ─── Volta para a lista de tarefas ───────────────────────
function voltarParaLista() {
    window.location.href = 'home-estoquista.html';
}

// ─── Renderiza a tela com os dados da tarefa ──────────────
function renderizarTarefa(tarefa) {
    tarefaAtual = tarefa;

    var html = ''
        + '<div class="detalhe-container">'

        +     '<h1 class="detalhe-titulo">Tarefa: ' + tarefa.nome + '</h1>'

        +     '<div class="detalhe-card">'
        +         '<div class="detalhe-card-label">Descrição:</div>'
        +         '<div class="detalhe-card-texto">' + (tarefa.descricao || 'Sem descrição.') + '</div>'
        +     '</div>'

        +     '<p class="upload-label">Adicionar foto</p>'

        +     '<div class="upload-area" id="uploadArea" onclick="solicitarFoto()">'
        +         '<img id="uploadPreview" class="upload-preview" alt="Preview">'
        +         '<span class="upload-icone" id="uploadIcone">&#128444;</span>'
        +         '<span class="upload-texto" id="uploadTexto">Toque para adicionar</span>'
        +         '<div class="upload-reprovado-overlay" id="reprovadoOverlay" style="display:none">'
        +             '<div class="alerta-icone">!</div>'
        +         '</div>'
        +     '</div>'

        +     '<button class="btn-acao enviar" id="btnAcao" onclick="enviarEvidencia()">Enviar Evidência</button>'
        +     '<button class="btn-voltar" onclick="voltarParaLista()">Voltar</button>'

        + '</div>';

    document.getElementById('page-content').innerHTML = html;
}

// ─── Renderiza tela de erro ───────────────────────────────
function renderizarErro(mensagem) {
    document.getElementById('page-content').innerHTML = ''
        + '<div class="erro-state">'
        +     '<p>Não foi possível carregar a tarefa.</p>'
        +     '<small>' + mensagem + '</small>'
        +     '<button class="btn-voltar" style="margin-top:20px" onclick="voltarParaLista()">Voltar</button>'
        + '</div>';
}

// ─── Inicialização ────────────────────────────────────────
window.onload = async function() {
    var userData = JSON.parse(localStorage.getItem('user') || '{}');

    initSidebar({
        nome: userData.nome || 'Usuário',
        cargo: userData.role || 'Colaborador',
        paginaAtiva: 'tarefas'
    });

    var id = getIdDaUrl();

    if (!id) {
        renderizarErro('Nenhum ID informado na URL.');
        return;
    }

    try {
        var tarefa = await buscarTarefa(id);
        renderizarTarefa(tarefa);
    } catch (erro) {
        renderizarErro(erro.message);
    }
};