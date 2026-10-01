// =====================================================
// Perfil del entrenador
// Usa los datos de js/datos.js (base de datos simulada)
// =====================================================

// Usuario simulado (en el Avance 2 vendrá del backend)
const usuario = {
  nombre: "AshCali",
  correo: "ash@correo.com",
  favorito: "Garchomp"
};

// ---------- Foto de perfil ----------

const foto = document.getElementById("foto");
foto.src = IMAGEN_POR_DEFECTO; // por ahora Unown

// Vista previa de la foto (en el Avance 2 se subirá al servidor)
document.getElementById("subir-foto").addEventListener("change", function (e) {
  const archivo = e.target.files[0];
  const error = document.getElementById("error-foto");
  if (!archivo) return;

  const tiposPermitidos = ["image/png", "image/jpeg", "image/webp"];
  const pesoMaximo = 2 * 1024 * 1024; // 2 MB

  if (!tiposPermitidos.includes(archivo.type)) {
    error.textContent = "Solo JPG, PNG o WEBP";
    return;
  }
  if (archivo.size > pesoMaximo) {
    error.textContent = "Máximo 2 MB";
    return;
  }

  error.textContent = "";
  foto.src = URL.createObjectURL(archivo);
});

// ---------- Pokémon favorito ----------

const selectFavorito = document.getElementById("elegir-favorito");

function buscarPokemon(nombre) {
  return POKEMONES.find(function (p) { return p.nombre === nombre; });
}

function mostrarFavorito() {
  const p = buscarPokemon(usuario.favorito);

  const img = document.getElementById("favorito-img");
  img.src = imagenPokemon(p);
  img.alt = p.nombre;

  document.getElementById("favorito-nombre").textContent = p.nombre;

  document.getElementById("favorito-tipos").innerHTML = htmlTipos(p.tipos);

  let habilidades = "Habilidades: " + p.habilidades.join(", ");
  if (p.oculta) habilidades += " · Oculta: " + p.oculta;
  document.getElementById("favorito-habilidades").textContent = habilidades;

  // Barras de estadísticas base
  let html = "";
  Object.keys(NOMBRES_STATS).forEach(function (clave) {
    const valor = p.base[clave];
    const ancho = Math.min(valor / 160 * 100, 100);
    html +=
      '<div class="stat">' +
      "<span>" + NOMBRES_STATS[clave] + "</span>" +
      '<div class="barra"><i style="width:' + ancho + '%"></i></div>' +
      "<b>" + valor + "</b></div>";
  });
  html +=
    '<div class="stat stat-total"><span>Total</span><div></div><b>' + totalBase(p) + "</b></div>";
  document.getElementById("favorito-stats").innerHTML = html;
}

// Llenar el selector con todos los Pokémon del catálogo
POKEMONES.forEach(function (p) {
  const marcado = p.nombre === usuario.favorito ? " selected" : "";
  selectFavorito.innerHTML += '<option value="' + p.nombre + '"' + marcado + ">" + p.nombre + "</option>";
});

selectFavorito.addEventListener("change", function () {
  usuario.favorito = selectFavorito.value;
  // En el Avance 2 aquí se guardará con PUT /api/users/me
  mostrarFavorito();
});

// ---------- Inicio ----------

document.getElementById("nombre-entrenador").textContent = usuario.nombre;
document.getElementById("correo-entrenador").textContent = usuario.correo;
mostrarFavorito();
