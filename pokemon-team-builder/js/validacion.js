// Validación sencilla de los formularios de Login y Registro

// Muestra u oculta el error de un campo
function mostrarError(idCampo, texto) {
  const input = document.getElementById(idCampo);
  const error = document.getElementById("error-" + idCampo);
  error.textContent = texto;

  if (texto) {
    input.classList.add("invalido");
  } else {
    input.classList.remove("invalido");
  }
}

// Revisa que el correo tenga formato válido
function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

// ---------- LOGIN ----------
const formLogin = document.getElementById("form-login");

if (formLogin) {
  formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const clave = document.getElementById("clave").value;
    let todoBien = true;

    if (correo === "") {
      mostrarError("correo", "Escribe tu correo");
      todoBien = false;
    } else if (!correoValido(correo)) {
      mostrarError("correo", "Correo no válido");
      todoBien = false;
    } else {
      mostrarError("correo", "");
    }

    if (clave === "") {
      mostrarError("clave", "Escribe tu contraseña");
      todoBien = false;
    } else {
      mostrarError("clave", "");
    }

    if (todoBien) {
      document.getElementById("mensaje").textContent = "¡Bienvenido! Entrando...";
      // En el Avance 2 aquí se hará la petición al backend
      setTimeout(function () {
        window.location.href = "index.html#menu";
      }, 1000);
    }
  });
}

// ---------- REGISTRO ----------
const formRegistro = document.getElementById("form-registro");

if (formRegistro) {
  formRegistro.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const clave = document.getElementById("clave").value;
    const confirmar = document.getElementById("confirmar").value;
    let todoBien = true;

    if (nombre.length < 3) {
      mostrarError("nombre", "Mínimo 3 caracteres");
      todoBien = false;
    } else {
      mostrarError("nombre", "");
    }

    if (!correoValido(correo)) {
      mostrarError("correo", "Correo no válido");
      todoBien = false;
    } else {
      mostrarError("correo", "");
    }

    if (clave.length < 8) {
      mostrarError("clave", "Mínimo 8 caracteres");
      todoBien = false;
    } else {
      mostrarError("clave", "");
    }

    if (confirmar === "" || confirmar !== clave) {
      mostrarError("confirmar", "Las contraseñas no coinciden");
      todoBien = false;
    } else {
      mostrarError("confirmar", "");
    }

    if (todoBien) {
      document.getElementById("mensaje").textContent = "¡Cuenta creada! Ahora inicia sesión.";
      // En el Avance 2 aquí se enviarán los datos al backend
      setTimeout(function () {
        window.location.href = "login.html";
      }, 1200);
    }
  });
}
