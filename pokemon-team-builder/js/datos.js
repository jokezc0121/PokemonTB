// =====================================================
// BASE DE DATOS SIMULADA
// En el Avance 2 estos datos vendrán del backend (API REST).
// =====================================================

// Imagen temporal para todos los Pokémon (sprite de Unown, #201 en PokéAPI).
// Cuando tengan las imágenes reales, cada Pokémon puede tener su propio campo "imagen".
const IMAGEN_POR_DEFECTO = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201.png";

// Catálogo de Pokémon con estadísticas base, habilidades y movimientos
// habilidades = normales, oculta = habilidad oculta
const POKEMONES = [
  {
    nombre: "Pikachu", tipos: ["Eléctrico"],
    base: { ps: 35, atq: 55, def: 40, ate: 50, dfe: 50, vel: 90 },
    habilidades: ["Elec. Estática"],
    oculta: "Pararrayos",
    movimientos: ["Rayo", "Placaje Eléctrico", "Cola Férrea", "Ataque Rápido", "Sorpresa", "Protección", "Hierba Lazo", "Onda Trueno"]
  },
  {
    nombre: "Charizard", tipos: ["Fuego", "Volador"],
    base: { ps: 78, atq: 84, def: 78, ate: 109, dfe: 85, vel: 100 },
    habilidades: ["Mar Llamas"],
    oculta: "Poder Solar",
    movimientos: ["Lanzallamas", "Llamarada", "Tajo Aéreo", "Onda Ígnea", "Rayo Solar", "Pulso Dragón", "Protección", "Respiro"]
  },
  {
    nombre: "Garchomp", tipos: ["Dragón", "Tierra"],
    base: { ps: 108, atq: 130, def: 95, ate: 80, dfe: 85, vel: 102 },
    habilidades: ["Velo Arena"],
    oculta: "Piel Tosca",
    movimientos: ["Terremoto", "Garra Dragón", "Enfado", "Roca Afilada", "Colmillo Ígneo", "Danza Espada", "Protección", "Bucle Arena"]
  },
  {
    nombre: "Incineroar", tipos: ["Fuego", "Siniestro"],
    base: { ps: 95, atq: 115, def: 90, ate: 80, dfe: 90, vel: 60 },
    habilidades: ["Mar Llamas"],
    oculta: "Intimidación",
    movimientos: ["Sorpresa", "Envite Ígneo", "Golpe Bajo", "Desarme", "Ida y Vuelta", "Lanzallamas", "Mofa", "Protección"]
  },
  {
    nombre: "Gengar", tipos: ["Fantasma", "Veneno"],
    base: { ps: 60, atq: 65, def: 60, ate: 130, dfe: 75, vel: 110 },
    habilidades: ["Cuerpo Maldito"],
    oculta: "",
    movimientos: ["Bola Sombra", "Bomba Lodo", "Rayo", "Hipnosis", "Infortunio", "Mismo Destino", "Psíquico", "Protección"]
  },
  {
    nombre: "Gyarados", tipos: ["Agua", "Volador"],
    base: { ps: 95, atq: 125, def: 79, ate: 60, dfe: 100, vel: 81 },
    habilidades: ["Intimidación"],
    oculta: "Autoestima",
    movimientos: ["Cascada", "Acua Cola", "Danza Dragón", "Terremoto", "Colmillo Hielo", "Enfado", "Mofa", "Protección"]
  },
  {
    nombre: "Lucario", tipos: ["Lucha", "Acero"],
    base: { ps: 70, atq: 110, def: 70, ate: 115, dfe: 70, vel: 90 },
    habilidades: ["Impasible", "Foco Interno"],
    oculta: "Justiciero",
    movimientos: ["Esfera Aural", "A Bocajarro", "Velocidad Extrema", "Puño Bala", "Pulso Dragón", "Pulso Umbrío", "Maquinación", "Protección"]
  },
  {
    nombre: "Dragonite", tipos: ["Dragón", "Volador"],
    base: { ps: 91, atq: 134, def: 95, ate: 100, dfe: 100, vel: 80 },
    habilidades: ["Foco Interno"],
    oculta: "Compensación",
    movimientos: ["Velocidad Extrema", "Enfado", "Terremoto", "Puño Fuego", "Danza Dragón", "Viento Afín", "Respiro", "Protección"]
  },
  {
    nombre: "Sylveon", tipos: ["Hada"],
    base: { ps: 95, atq: 65, def: 65, ate: 110, dfe: 130, vel: 60 },
    habilidades: ["Gran Encanto"],
    oculta: "Piel Feérica",
    movimientos: ["Voz Cautivadora", "Fuerza Lunar", "Hiperrayo", "Bola Sombra", "Paz Mental", "Deseo", "Protección", "Ataque Rápido"]
  },
  {
    nombre: "Tyranitar", tipos: ["Roca", "Siniestro"],
    base: { ps: 100, atq: 134, def: 110, ate: 95, dfe: 100, vel: 61 },
    habilidades: ["Chorro Arena"],
    oculta: "Nerviosismo",
    movimientos: ["Avalancha", "Triturar", "Terremoto", "Roca Afilada", "Puño Hielo", "Golpe Bajo", "Danza Dragón", "Protección"]
  },
  {
    nombre: "Snorlax", tipos: ["Normal"],
    base: { ps: 160, atq: 110, def: 65, ate: 65, dfe: 110, vel: 30 },
    habilidades: ["Inmunidad", "Sebo"],
    oculta: "Glotonería",
    movimientos: ["Golpe Cuerpo", "Descanso", "Sonámbulo", "Maldición", "Terremoto", "Puño Hielo", "Bostezo", "Protección"]
  },
  {
    nombre: "Metagross", tipos: ["Acero", "Psíquico"],
    base: { ps: 80, atq: 135, def: 130, ate: 95, dfe: 90, vel: 70 },
    habilidades: ["Cuerpo Puro"],
    oculta: "Metal Liviano",
    movimientos: ["Puño Meteoro", "Cabezazo Zen", "Terremoto", "Puño Bala", "Puño Hielo", "Agilidad", "Ida y Vuelta", "Protección"]
  }
];

// Objetos que se pueden equipar
const OBJETOS = [
  "Ninguno", "Restos", "Vidasfera", "Cinta Elegida", "Gafas Elegidas",
  "Pañuelo Elegido", "Banda Focus", "Baya Zidra", "Chaleco Asalto",
  "Gafas Protectoras", "Hierba Blanca", "Casco Dentado"
];

// Naturalezas: qué estadística sube (+10%) y cuál baja (-10%)
const NATURALEZAS = [
  { nombre: "Fuerte",   sube: null,  baja: null },
  { nombre: "Huraña",   sube: "atq", baja: "def" },
  { nombre: "Firme",    sube: "atq", baja: "ate" },
  { nombre: "Pícara",   sube: "atq", baja: "dfe" },
  { nombre: "Audaz",    sube: "atq", baja: "vel" },
  { nombre: "Osada",    sube: "def", baja: "atq" },
  { nombre: "Dócil",    sube: null,  baja: null },
  { nombre: "Agitada",  sube: "def", baja: "ate" },
  { nombre: "Floja",    sube: "def", baja: "dfe" },
  { nombre: "Plácida",  sube: "def", baja: "vel" },
  { nombre: "Modesta",  sube: "ate", baja: "atq" },
  { nombre: "Afable",   sube: "ate", baja: "def" },
  { nombre: "Tímida",   sube: null,  baja: null },
  { nombre: "Alocada",  sube: "ate", baja: "dfe" },
  { nombre: "Mansa",    sube: "ate", baja: "vel" },
  { nombre: "Serena",   sube: "dfe", baja: "atq" },
  { nombre: "Amable",   sube: "dfe", baja: "def" },
  { nombre: "Cauta",    sube: "dfe", baja: "ate" },
  { nombre: "Rara",     sube: null,  baja: null },
  { nombre: "Grosera",  sube: "dfe", baja: "vel" },
  { nombre: "Miedosa",  sube: "vel", baja: "atq" },
  { nombre: "Activa",   sube: "vel", baja: "def" },
  { nombre: "Alegre",   sube: "vel", baja: "ate" },
  { nombre: "Ingenua",  sube: "vel", baja: "dfe" },
  { nombre: "Seria",    sube: null,  baja: null }
];

// Nombres para mostrar de cada estadística
const NOMBRES_STATS = {
  ps: "PS", atq: "Ataque", def: "Defensa",
  ate: "At. Esp.", dfe: "Def. Esp.", vel: "Velocidad"
};

// Reglas de los puntos de esfuerzo (EV)
const EV_MAX_STAT = 252;
const EV_MAX_TOTAL = 510;
const NIVEL = 50;

// ---------- Funciones de ayuda compartidas ----------

// Devuelve la imagen del Pokémon (o la de Unown si no tiene)
function imagenPokemon(pokemon) {
  return pokemon.imagen || IMAGEN_POR_DEFECTO;
}

// Etiqueta <img> lista para usar en el HTML
function htmlImagen(pokemon) {
  return '<img class="sprite" src="' + imagenPokemon(pokemon) + '" alt="' + pokemon.nombre + '" loading="lazy">';
}

// Todas las habilidades que puede elegir (normales + oculta)
function todasLasHabilidades(pokemon) {
  if (pokemon.oculta) return pokemon.habilidades.concat(pokemon.oculta);
  return pokemon.habilidades;
}

// Suma de las 6 estadísticas base (Total)
function totalBase(pokemon) {
  const b = pokemon.base;
  return b.ps + b.atq + b.def + b.ate + b.dfe + b.vel;
}

// Etiquetas de tipo con su color oficial.
// "Eléctrico" -> clase "tipo-electrico" (sin tildes y en minúsculas)
function claseTipo(tipo) {
  return "tipo-" + tipo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function htmlTipos(tipos) {
  return tipos.map(function (t) {
    return '<span class="tipo ' + claseTipo(t) + '">' + t + "</span>";
  }).join("");
}

// ---------- Arquetipos de equipo ----------
// "claves" son movimientos, habilidades u objetos típicos del arquetipo.
// El Team Builder revisa cuáles ya tiene el equipo.
const ARQUETIPOS = {
  "Combate Individual": [
    {
      nombre: "Ofensiva total",
      descripcion: "Pokémon rápidos y fuertes que se potencian y buscan barrer al rival antes de que reaccione.",
      claves: ["Danza Dragón", "Danza Espada", "Maquinación", "Banda Focus"]
    },
    {
      nombre: "Equilibrado",
      descripcion: "Mezcla de atacantes y defensores con buena cobertura de tipos. Se adapta a casi cualquier rival.",
      claves: ["Restos", "Ida y Vuelta", "Respiro", "Intimidación"]
    },
    {
      nombre: "Stall (defensivo)",
      descripcion: "Defensas muy altas, recuperación de PS y daño residual para desgastar al rival poco a poco.",
      claves: ["Restos", "Descanso", "Deseo", "Protección"]
    },
    {
      nombre: "Pivotes (Volt-Turn)",
      descripcion: "Ataca y cambia de Pokémon en el mismo turno para mantener la ventaja de tipos.",
      claves: ["Ida y Vuelta", "Voltiocambio", "Casco Dentado"]
    },
    {
      nombre: "Tormenta de arena",
      descripcion: "Un Pokémon invoca arena al entrar y otros aprovechan el clima para defenderse o atacar.",
      claves: ["Chorro Arena", "Velo Arena", "Terremoto"]
    }
  ],
  "Combate Doble": [
    {
      nombre: "Viento Afín",
      descripcion: "Duplica la velocidad del equipo por 4 turnos para que tus atacantes golpeen primero.",
      claves: ["Viento Afín", "Sorpresa", "Protección"]
    },
    {
      nombre: "Espacio Raro",
      descripcion: "Invierte el orden de velocidad: los Pokémon lentos y fuertes atacan antes.",
      claves: ["Espacio Raro", "Protección", "Hierba Blanca"]
    },
    {
      nombre: "Lluvia",
      descripcion: "Un Pokémon invoca lluvia y los de tipo Agua ganan velocidad y potencia.",
      claves: ["Llovizna", "Danza Lluvia", "Nado Rápido"]
    },
    {
      nombre: "Sol",
      descripcion: "El sol potencia los ataques de Fuego y activa habilidades como Poder Solar.",
      claves: ["Sequía", "Poder Solar", "Onda Ígnea"]
    },
    {
      nombre: "Intimidación y apoyo (Goodstuffs)",
      descripcion: "Pokémon fuertes por sí solos con mucho apoyo: bajar el ataque rival, hacer retroceder y protegerse.",
      claves: ["Intimidación", "Sorpresa", "Desarme", "Protección"]
    },
    {
      nombre: "Ofensiva total",
      descripcion: "Ataques que golpean a los dos rivales a la vez para presionar desde el primer turno.",
      claves: ["Voz Cautivadora", "Onda Ígnea", "Terremoto", "Gafas Elegidas"]
    }
  ]
};
