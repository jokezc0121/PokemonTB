// =====================================================
// Editor de equipos
// Usa los datos de js/datos.js (base de datos simulada)
// =====================================================

let equipo = [];        // integrantes del equipo
let seleccionado = -1;  // posición del integrante que se está editando

const listaCatalogo = document.getElementById("catalogo");
const listaRanuras = document.getElementById("ranuras");
const buscador = document.getElementById("buscar");
const editor = document.getElementById("editor-integrante");
const selectFormato = document.getElementById("formato");
const selectArquetipo = document.getElementById("arquetipo");

// ---------- Utilidades ----------

// Crea las <option> de un <select>
function opciones(lista, valorActual) {
  return lista.map(function (valor) {
    const marcado = valor === valorActual ? " selected" : "";
    return '<option value="' + valor + '"' + marcado + ">" + valor + "</option>";
  }).join("");
}

function buscarNaturaleza(nombre) {
  return NATURALEZAS.find(function (n) { return n.nombre === nombre; });
}

// Texto de la naturaleza, ej: "Firme (+Ataque -At. Esp.)"
function textoNaturaleza(n) {
  if (!n.sube) return n.nombre + " (neutra)";
  return n.nombre + " (+" + NOMBRES_STATS[n.sube] + " -" + NOMBRES_STATS[n.baja] + ")";
}

// Fórmula de estadística real a nivel 50 con IV 31
function calcularStat(clave, base, ev, naturaleza) {
  const parte = Math.floor((2 * base + 31 + Math.floor(ev / 4)) * NIVEL / 100);

  if (clave === "ps") {
    return parte + NIVEL + 10;
  }

  let multiplicador = 1;
  if (naturaleza.sube === clave) multiplicador = 1.1;
  if (naturaleza.baja === clave) multiplicador = 0.9;
  return Math.floor((parte + 5) * multiplicador);
}

function totalEvs(integrante) {
  let suma = 0;
  Object.keys(integrante.evs).forEach(function (clave) {
    suma += integrante.evs[clave];
  });
  return suma;
}

// Nuevo integrante con valores por defecto
function crearIntegrante(pokemon) {
  return {
    pokemon: pokemon,
    apodo: "",
    habilidad: pokemon.habilidades[0],
    objeto: "Ninguno",
    naturaleza: "Fuerte",
    movimientos: ["", "", "", ""],
    evs: { ps: 0, atq: 0, def: 0, ate: 0, dfe: 0, vel: 0 }
  };
}

// ---------- Catálogo ----------

function estaEnEquipo(pokemon) {
  return equipo.some(function (i) { return i.pokemon === pokemon; });
}

function mostrarCatalogo() {
  const filtro = buscador.value.toLowerCase();
  listaCatalogo.innerHTML = "";

  POKEMONES.forEach(function (p) {
    const coincide =
      p.nombre.toLowerCase().includes(filtro) ||
      p.tipos.join(" ").toLowerCase().includes(filtro);
    if (!coincide) return;

    const yaEsta = estaEnEquipo(p);
    const li = document.createElement("li");
    li.innerHTML =
      htmlImagen(p) +
      "<div><strong>" + p.nombre + "</strong>" + htmlTipos(p.tipos) + "</div>" +
      '<button class="boton-mini"' + (yaEsta ? " disabled" : "") + ">" +
      (yaEsta ? "En equipo" : "+ Agregar") + "</button>";

    li.querySelector("button").addEventListener("click", function () {
      agregar(p);
    });
    listaCatalogo.appendChild(li);
  });

  if (listaCatalogo.innerHTML === "") {
    listaCatalogo.innerHTML = '<li class="vacio">No se encontraron Pokémon</li>';
  }
}

// ---------- Equipo ----------

function agregar(pokemon) {
  if (equipo.length >= 6) {
    alert("El equipo ya tiene 6 Pokémon");
    return;
  }
  equipo.push(crearIntegrante(pokemon));
  seleccionado = equipo.length - 1;
  actualizarTodo();
}

function quitar(indice) {
  equipo.splice(indice, 1);
  if (seleccionado >= equipo.length) seleccionado = equipo.length - 1;
  actualizarTodo();
}

function mostrarEquipo() {
  listaRanuras.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    const li = document.createElement("li");
    const integrante = equipo[i];

    if (!integrante) {
      li.className = "ranura";
      li.innerHTML = '<span class="numero">' + (i + 1) + "</span><span>Vacío</span>";
      listaRanuras.appendChild(li);
      continue;
    }

    const p = integrante.pokemon;
    const nombre = integrante.apodo || p.nombre;
    li.className = "ranura llena" + (i === seleccionado ? " activa" : "");
    li.innerHTML =
      '<span class="numero">' + (i + 1) + "</span>" +
      htmlImagen(p) +
      "<div><strong>" + nombre + "</strong>" + htmlTipos(p.tipos) +
      '<small class="objeto">' + integrante.objeto + "</small></div>" +
      '<button class="quitar" aria-label="Quitar ' + p.nombre + '">X</button>';

    // Clic en la ranura = seleccionar para editar
    li.addEventListener("click", function () {
      seleccionado = i;
      mostrarEquipo();
      mostrarEditor();
    });

    // Clic en la X = quitar (sin seleccionar)
    li.querySelector(".quitar").addEventListener("click", function (evento) {
      evento.stopPropagation();
      quitar(i);
    });

    listaRanuras.appendChild(li);
  }

  document.getElementById("contador").textContent = equipo.length + "/6";
}

// ---------- Editor del integrante ----------

function mostrarEditor() {
  const integrante = equipo[seleccionado];

  if (!integrante) {
    editor.innerHTML = '<p class="ayuda">Agrega un Pokémon desde el catálogo para empezar.</p>';
    return;
  }

  const p = integrante.pokemon;

  // Lista de naturalezas como texto con sus efectos
  const opcionesNaturaleza = NATURALEZAS.map(function (n) {
    const marcado = n.nombre === integrante.naturaleza ? " selected" : "";
    return '<option value="' + n.nombre + '"' + marcado + ">" + textoNaturaleza(n) + "</option>";
  }).join("");

  // 4 selectores de movimientos
  let htmlMovimientos = "";
  for (let m = 0; m < 4; m++) {
    htmlMovimientos +=
      '<select class="movimiento" data-pos="' + m + '" aria-label="Movimiento ' + (m + 1) + '">' +
      '<option value="">— Movimiento ' + (m + 1) + " —</option>" +
      opciones(p.movimientos, integrante.movimientos[m]) +
      "</select>";
  }

  // Filas de estadísticas
  let filasStats = "";
  Object.keys(NOMBRES_STATS).forEach(function (clave) {
    filasStats +=
      "<tr>" +
      '<td id="nombre-' + clave + '">' + NOMBRES_STATS[clave] + "</td>" +
      "<td>" + p.base[clave] + "</td>" +
      '<td><input type="number" class="ev" data-stat="' + clave + '" min="0" max="' + EV_MAX_STAT +
      '" step="4" value="' + integrante.evs[clave] + '" aria-label="EV de ' + NOMBRES_STATS[clave] + '"></td>' +
      '<td class="total" id="total-' + clave + '"></td>' +
      "</tr>";
  });

  editor.innerHTML =
    '<div class="editor-titulo">' + htmlImagen(p) +
    "<h2>Editando: <span>" + p.nombre + "</span></h2></div>" +

    '<div class="fila-datos">' +
      '<div class="campo"><label for="apodo">Apodo</label>' +
        '<input type="text" id="apodo" maxlength="12" placeholder="Opcional" value="' + integrante.apodo + '"></div>' +
      '<div class="campo"><label for="habilidad">Habilidad</label>' +
        '<select id="habilidad">' + opciones(todasLasHabilidades(p), integrante.habilidad) + "</select></div>" +
      '<div class="campo"><label for="objeto">Objeto</label>' +
        '<select id="objeto">' + opciones(OBJETOS, integrante.objeto) + "</select></div>" +
      '<div class="campo"><label for="naturaleza">Naturaleza</label>' +
        '<select id="naturaleza">' + opcionesNaturaleza + "</select></div>" +
    "</div>" +

    "<h2>Movimientos</h2>" +
    '<div class="movimientos">' + htmlMovimientos + "</div>" +
    '<p class="error" id="error-movimientos"></p>' +

    "<h2>Estadísticas (nivel " + NIVEL + ")</h2>" +
    '<div class="tabla-scroll"><table class="tabla-stats">' +
      "<thead><tr><th>Stat</th><th>Base</th><th>EV</th><th>Total</th></tr></thead>" +
      "<tbody>" + filasStats + "</tbody>" +
    "</table></div>" +
    '<p class="ev-restantes" id="ev-restantes"></p>';

  conectarEventosEditor(integrante);
  actualizarStatsEditor(integrante);
}

function conectarEventosEditor(integrante) {
  document.getElementById("apodo").addEventListener("input", function (e) {
    integrante.apodo = e.target.value.trim();
    mostrarEquipo();
  });

  document.getElementById("habilidad").addEventListener("change", function (e) {
    integrante.habilidad = e.target.value;
    mostrarArquetipo();
  });

  document.getElementById("objeto").addEventListener("change", function (e) {
    integrante.objeto = e.target.value;
    mostrarEquipo();
    mostrarArquetipo();
  });

  document.getElementById("naturaleza").addEventListener("change", function (e) {
    integrante.naturaleza = e.target.value;
    actualizarStatsEditor(integrante);
  });

  // Movimientos: no se pueden repetir
  editor.querySelectorAll(".movimiento").forEach(function (select) {
    select.addEventListener("change", function () {
      const pos = Number(select.dataset.pos);
      const valor = select.value;
      const error = document.getElementById("error-movimientos");

      if (valor !== "" && integrante.movimientos.includes(valor)) {
        error.textContent = "Ese movimiento ya está elegido";
        select.value = integrante.movimientos[pos];
        return;
      }
      error.textContent = "";
      integrante.movimientos[pos] = valor;
      mostrarArquetipo();
    });
  });

  // EVs: máximo 252 por stat y 510 en total
  editor.querySelectorAll(".ev").forEach(function (input) {
    input.addEventListener("change", function () {
      const clave = input.dataset.stat;
      let valor = parseInt(input.value, 10) || 0;
      valor = Math.max(0, Math.min(valor, EV_MAX_STAT));

      // Lo que queda disponible sin contar esta stat
      const disponible = EV_MAX_TOTAL - (totalEvs(integrante) - integrante.evs[clave]);
      valor = Math.min(valor, disponible);

      integrante.evs[clave] = valor;
      input.value = valor;
      actualizarStatsEditor(integrante);
    });
  });
}

// Recalcula los totales sin redibujar todo el editor
function actualizarStatsEditor(integrante) {
  const naturaleza = buscarNaturaleza(integrante.naturaleza);

  Object.keys(NOMBRES_STATS).forEach(function (clave) {
    const total = calcularStat(clave, integrante.pokemon.base[clave], integrante.evs[clave], naturaleza);
    const celda = document.getElementById("total-" + clave);
    const nombre = document.getElementById("nombre-" + clave);

    celda.textContent = total;
    nombre.className = "";
    if (naturaleza.sube === clave) nombre.className = "sube";
    if (naturaleza.baja === clave) nombre.className = "baja";
  });

  document.getElementById("ev-restantes").textContent =
    "EV usados: " + totalEvs(integrante) + " / " + EV_MAX_TOTAL;
}

// ---------- Arquetipo del equipo ----------

// Llena el selector con los arquetipos del formato elegido
function cargarArquetipos() {
  const lista = ARQUETIPOS[selectFormato.value];
  selectArquetipo.innerHTML = '<option value="">Sin arquetipo (libre)</option>';

  lista.forEach(function (a) {
    selectArquetipo.innerHTML += '<option value="' + a.nombre + '">' + a.nombre + "</option>";
  });

  mostrarArquetipo();
}

function buscarArquetipo() {
  return ARQUETIPOS[selectFormato.value].find(function (a) {
    return a.nombre === selectArquetipo.value;
  });
}

// ¿Algún integrante tiene este movimiento, habilidad u objeto?
function equipoTiene(clave) {
  return equipo.some(function (i) {
    return i.movimientos.includes(clave) || i.habilidad === clave || i.objeto === clave;
  });
}

function mostrarArquetipo() {
  const caja = document.getElementById("arquetipo-info");
  const arquetipo = buscarArquetipo();

  if (!arquetipo) {
    caja.hidden = true;
    return;
  }

  let claves = "";
  arquetipo.claves.forEach(function (c) {
    claves += '<li class="' + (equipoTiene(c) ? "tiene" : "") + '">' + c + "</li>";
  });

  caja.hidden = false;
  caja.innerHTML =
    "<p>" + arquetipo.descripcion + "</p>" +
    "<h3>Elementos clave del arquetipo</h3>" +
    '<ul class="claves">' + claves + "</ul>";
}

selectFormato.addEventListener("change", cargarArquetipos);
selectArquetipo.addEventListener("change", mostrarArquetipo);

// ---------- Análisis: estadísticas base promedio ----------

function mostrarEstadisticas() {
  const caja = document.getElementById("estadisticas");
  const aviso = document.getElementById("aviso");
  caja.innerHTML = "";

  if (equipo.length === 0) {
    aviso.textContent = "Agrega Pokémon para ver el análisis.";
    return;
  }

  let masBaja = null;
  let valorMasBajo = Infinity;

  Object.keys(NOMBRES_STATS).forEach(function (clave) {
    let suma = 0;
    equipo.forEach(function (i) { suma += i.pokemon.base[clave]; });
    const promedio = Math.round(suma / equipo.length);

    if (promedio < valorMasBajo) {
      valorMasBajo = promedio;
      masBaja = clave;
    }

    const ancho = Math.min(promedio / 160 * 100, 100);
    caja.innerHTML +=
      '<div class="stat" data-clave="' + clave + '">' +
      "<span>" + NOMBRES_STATS[clave] + "</span>" +
      '<div class="barra"><i style="width:' + ancho + '%"></i></div>' +
      "<b>" + promedio + "</b></div>";
  });

  caja.querySelector('[data-clave="' + masBaja + '"]').classList.add("baja");
  aviso.textContent =
    "Tu estadística más baja es " + NOMBRES_STATS[masBaja] +
    " (" + valorMasBajo + "). Busca un Pokémon que la tenga alta.";
}

// ---------- Guardar (simulado) ----------

function validarEquipo() {
  const errores = [];
  const nombre = document.getElementById("nombre-equipo").value.trim();

  if (nombre === "") errores.push("Ponle un nombre al equipo.");
  if (equipo.length === 0) errores.push("Agrega al menos un Pokémon.");

  const objetosUsados = [];
  equipo.forEach(function (i) {
    const quien = i.apodo || i.pokemon.nombre;

    const tieneMovimiento = i.movimientos.some(function (m) { return m !== ""; });
    if (!tieneMovimiento) errores.push(quien + " necesita al menos un movimiento.");

    if (i.objeto !== "Ninguno") {
      if (objetosUsados.includes(i.objeto)) {
        errores.push("El objeto " + i.objeto + " está repetido.");
      }
      objetosUsados.push(i.objeto);
    }
  });

  return errores;
}

document.getElementById("guardar").addEventListener("click", function () {
  const lista = document.getElementById("mensaje");
  const errores = validarEquipo();
  lista.innerHTML = "";

  if (errores.length > 0) {
    errores.forEach(function (texto) {
      lista.innerHTML += '<li class="mal">' + texto + "</li>";
    });
    return;
  }

  // Objeto que en el Avance 2 se enviará al backend con POST /api/teams
  const datosEquipo = {
    nombre: document.getElementById("nombre-equipo").value.trim(),
    formato: selectFormato.value,
    arquetipo: selectArquetipo.value || "Libre",
    integrantes: equipo.map(function (i) {
      return {
        pokemon: i.pokemon.nombre,
        apodo: i.apodo,
        habilidad: i.habilidad,
        objeto: i.objeto,
        naturaleza: i.naturaleza,
        movimientos: i.movimientos.filter(function (m) { return m !== ""; }),
        evs: i.evs
      };
    })
  };

  console.log("Equipo a guardar (simulado):", datosEquipo);
  lista.innerHTML = '<li class="bien">¡Equipo guardado! (simulado, mira la consola)</li>';
});

// ---------- Inicio ----------

function actualizarTodo() {
  mostrarEquipo();
  mostrarEditor();
  mostrarEstadisticas();
  mostrarArquetipo();
  mostrarCatalogo();
}

buscador.addEventListener("input", mostrarCatalogo);

cargarArquetipos();
actualizarTodo();
