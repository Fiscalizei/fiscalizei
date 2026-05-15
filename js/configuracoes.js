// ============================================================
//  FISCALIZEI — configuracoes.js
// ============================================================

var fotoPerfil = null;

// ─── Solicita foto da câmera/galeria ─────────────────────
function solicitarFotoPerfil() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    input.onchange = function (e) {
        var arquivo = e.target.files[0];
        if (!arquivo) return;
        fotoPerfil = arquivo;

        // Exibe o preview dentro da caixa fixa
        var reader = new FileReader();
        reader.onload = function (ev) {
            exibirPreview(ev.target.result);
        };
        reader.readAsDataURL(arquivo);
    };

    input.click();
}

// ─── Exibe a imagem na caixa de preview ──────────────────
function exibirPreview(src) {
    var preview = document.getElementById('uploadPreview');
    var icone = document.getElementById('uploadIcone');

    preview.src = src;
    preview.style.display = 'block';
    icone.style.display = 'none';
}

// ─── Volta a caixa para o estado padrão (sem foto) ───────
function resetarPreview() {
    var preview = document.getElementById('uploadPreview');
    var icone = document.getElementById('uploadIcone');

    preview.src = '';
    preview.style.display = 'none';
    icone.style.display = 'block';
    fotoPerfil = null;
}

// ─── Exibe mensagem de foto enviada com sucesso ───────────
function mostrarSucessoFoto() {
    var msg = document.getElementById('fotoSucesso');
    if (!msg) return;

    msg.classList.add('visivel');

    // Some após 3 segundos
    setTimeout(function () {
        msg.classList.remove('visivel');
    }, 3000);
}

// ─── Carrega dados e foto atual do usuário ────────────────
function carregarDadosUsuario() {
    var userData = JSON.parse(localStorage.getItem('user') || '{}');
    document.getElementById('inputNome').value = userData.nome || '';
    document.getElementById('inputCargo').value = userData.role || '';

    // Tenta exibir foto já cadastrada no servidor
    if (userData.id) {
        var token = localStorage.getItem('token') || '';
        fetch('http://localhost:8080/api/usuario/' + userData.id + '/foto', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(function (res) {
                if (!res.ok) return null;
                return res.blob();
            })
            .catch(function () { });
    }
}

// ─── Atualiza apenas a foto — PATCH /api/usuario/{id}/foto
async function atualizarFoto(id, token) {
    if (!fotoPerfil) {
        console.log("Nenhuma foto nova selecionada, pulando upload");
        return; // não envia requisição desnecessária
    }

    console.log("Enviando foto:", fotoPerfil.name, fotoPerfil.size, "bytes");

    var formData = new FormData();
    formData.append('foto', fotoPerfil);

    var resposta = await fetch('http://localhost:8080/api/usuario/' + id + '/foto', {
        method: 'PATCH',
        headers: { 'Authorization': 'Bearer ' + token },
        body: formData
    });

    if (!resposta.ok) {
        throw new Error('Erro ao atualizar foto (status ' + resposta.status + ')');
    }
    return true; 
}

// ─── Salva tudo ───────────────────────────────────────────
async function salvarConfiguracoes() {
    var nome = document.getElementById('inputNome').value.trim();
    var userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (!nome) {
        alert('Por favor, preencha o nome.');
        return;
    }

    var btn = document.getElementById('btnSalvar');
    btn.disabled = true;
    btn.textContent = 'Salvando...';

    try {
        var token = localStorage.getItem('token') || '';
        var id = userData.id;

        // Atualiza foto (só se selecionou uma nova)
        var fotoEnviada = await atualizarFoto(id, token);

        if (fotoEnviada) {
            // Mostra mensagem de sucesso e reseta a caixa para o estado padrão
            mostrarSucessoFoto();
            resetarPreview();
        } else {
            alert('Configurações salvas com sucesso!');
        }

    } catch (erro) {
        console.log(erro)
    } finally {
        btn.disabled = false;
        btn.textContent = 'Salvar';
    }
}

// ─── Volta para lista de tarefas ──────────────────────────
function voltarParaLista() {
    window.location.href = 'home-estoquista.html';
}

// ─── Inicialização ────────────────────────────────────────
window.onload = function () {
    var userData = JSON.parse(localStorage.getItem('user') || '{}');

    initSidebar({
        nome: userData.nome || 'Usuário',
        cargo: userData.role || 'Colaborador',
        paginaAtiva: 'configuracoes'
    });

    // Injeta a mensagem de sucesso no DOM (logo após a área de upload)
    var uploadArea = document.getElementById('uploadArea');
    var msgSucesso = document.createElement('div');
    msgSucesso.id = 'fotoSucesso';
    msgSucesso.className = 'foto-sucesso';
    msgSucesso.innerHTML = '✅ Foto enviada com sucesso!';
    uploadArea.parentNode.insertBefore(msgSucesso, uploadArea.nextSibling);

    carregarDadosUsuario();
};