function salvarPerfil() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const empresa = document.getElementById("empresa").value;

  if (!nome || !email || !senha || !empresa) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  const perfil = { nome, email, senha, empresa };
  localStorage.setItem("perfilUsuario", JSON.stringify(perfil));

  alert("Perfil salvo com sucesso!");
}

document.getElementById("upload").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const avatar = document.getElementById("avatar");
      avatar.style.backgroundImage = `url(${e.target.result})`;
      avatar.style.backgroundSize = "cover";
      avatar.style.backgroundPosition = "center";
      avatar.innerHTML = "";
    };
    reader.readAsDataURL(file);
  }
});

window.onload = function() {
  const perfilSalvo = localStorage.getItem("perfilUsuario");
  if (perfilSalvo) {
    const perfil = JSON.parse(perfilSalvo);
    document.getElementById("nome").value = perfil.nome;
    document.getElementById("email").value = perfil.email;
    document.getElementById("senha").value = perfil.senha;
    document.getElementById("empresa").value = perfil.empresa;
  }
};

