// =====================================================
// Catálogo de Pokémon
// Usa los datos de js/datos.js (base de datos simulada)
// =====================================================

const tabla = document.getElementById("tabla-pokemon");
const buscador = document.getElementById("buscar");
const filtroTipo = document.getElementById("filtro-tipo");
const ordenar = document.getElementById("ordenar");

// ---------- Catálogo ----------

// Llena el filtro de tipos con los tipos que existen en el catálogo
function cargarTipos() {
  const tipos = [];
  POKEMONES.forEach(function (p) {
    p.tipos.forEach(function (t) {
      if (!tipos.includes(t)) tipos.push(t);
    });
  });
  tipos.sort();

  tipos.forEach(function (t) {
    filtroTipo.innerHTML += '<option value="' + t + '">' + t + "</option>";
  });
}

function mostrarCatalogo() {
  const texto = buscador.value.toLowerCase();
  const tipo = filtroTipo.value;
  const orden = ordenar.value;

  // 1. Filtrar
  let lista = POKEMONES.filter(function (p) {
    const habilidades = todasLasHabilidades(p).join(" ").toLowerCase();
    const coincideTexto = p.nombre.toLowerCase().includes(texto) || habilidades.includes(texto);
    const coincideTipo = tipo === "" || p.tipos.includes(tipo);
    return coincideTexto && coincideTipo;
  });

  // 2. Ordenar (stats de mayor a menor, nombre de A a Z)
  lista.sort(function (a, b) {
    if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
    if (orden === "total") return totalBase(b) - totalBase(a);
    return b.base[orden] - a.base[orden];
  });

  // 3. Dibujar la tabla
  tabla.innerHTML = "";

  lista.forEach(function (p) {
    const b = p.base;
    const tipos = htmlTipos(p.tipos);

    tabla.innerHTML +=
      "<tr>" +
      "<td>" + htmlImagen(p) + "</td>" +
      '<td class="nombre">' + p.nombre + "</td>" +
      "<td>" + tipos + "</td>" +
      '<td class="habilidad">' + p.habilidades.join("<br>") + "</td>" +
      '<td class="habilidad">' + (p.oculta || "—") + "</td>" +
      "<td>" + b.ps + "</td>" +
      "<td>" + b.atq + "</td>" +
      "<td>" + b.def + "</td>" +
      "<td>" + b.ate + "</td>" +
      "<td>" + b.dfe + "</td>" +
      "<td>" + b.vel + "</td>" +
      '<td class="total">' + totalBase(p) + "</td>" +
      "</tr>";
  });

  if (lista.length === 0) {
    tabla.innerHTML = '<tr><td colspan="12" class="vacio">No se encontraron Pokémon</td></tr>';
  }

  document.getElementById("resultados").textContent = lista.length + " Pokémon encontrados";
}

buscador.addEventListener("input", mostrarCatalogo);
filtroTipo.addEventListener("change", mostrarCatalogo);
ordenar.addEventListener("change", mostrarCatalogo);

cargarTipos();
mostrarCatalogo();
