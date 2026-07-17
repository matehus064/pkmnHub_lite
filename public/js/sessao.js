// sessão
function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;
    var fotoPerfil = sessionStorage.FOTO_PERFIL;

    var b_usuario = document.getElementById("b_usuario");
    var b_fotoPerfil = document.getElementById("b_fotoPerfil");

    if (email != null && nome != null) {
        b_usuario.innerHTML = nome;
        b_fotoPerfil.src = `../assets/imgs/profilePics/${fotoPerfil}.webp`;
        
    } else {
        window.location = "../login.html";
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../login.html";
}
