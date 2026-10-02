# Pokémon Team Builder — API (backend)

API REST del Pokémon Team Builder. **Node.js + Express 5**, con **Supabase** como base de datos (PostgreSQL) y como almacenamiento de archivos (Storage).

```
Cliente web (HTML/CSS/JS)  ──HTTP/JSON──▶  API Express  ──▶  Supabase PostgreSQL  (usuarios, equipos, versiones, metadatos de archivos, catálogo)
        js/api.js                          src/          └─▶  Supabase Storage     (avatares, TXT, PNG, capturas, PDF)
```

El navegador **nunca** habla directo con Supabase: solo el backend tiene la *secret key*.

## 1. Puesta en marcha

Requisitos: Node.js 20 o superior.

```bash
cd backend
npm install
cp .env.example .env          # completar SUPABASE_URL, SUPABASE_SECRET_KEY y JWT_SECRET
```

### Base de datos (una sola vez)

Las tablas de catálogo (`pokemon`, `tipos`, `movimiento`, `habilidad`, `item`, `naturaleza` y sus tablas puente) ya existen en Supabase. La migración **agrega** lo que necesita la aplicación; no borra ni renombra nada:

- Opción A: abrir **Supabase → SQL Editor**, pegar `db/migrations/001_esquema_aplicacion.sql` y ejecutar.
- Opción B: poner `DATABASE_URL` en `.env` (Project Settings → Database → Connection string → URI) y correr `npm run db:migrate`.

Después:

```bash
npm run setup:storage   # crea el bucket privado "archivos" (ya está creado en el proyecto)
npm run seed            # opcional: usuario demo@pokemontb.com / Demo12345 con 2 equipos
npm run dev             # http://localhost:3000/api  (se reinicia al guardar cambios)
```

Comprobar: `GET http://localhost:3000/api/health` debe responder `"estado": "ok"` con la base de datos y Storage conectados.

| Script | Qué hace |
|---|---|
| `npm start` / `npm run dev` | Inicia la API (dev = con recarga automática) |
| `npm test` | Pruebas de la lógica de negocio (no necesitan base de datos) |
| `npm run db:migrate` | Aplica `db/migrations/*.sql` en orden (requiere `DATABASE_URL`) |
| `npm run setup:storage` | Crea o actualiza el bucket de Storage |
| `npm run seed` | Crea el usuario demo y equipos de ejemplo |

### Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto (por defecto 3000) |
| `SUPABASE_URL` | `https://<ref>.supabase.co` |
| `SUPABASE_SECRET_KEY` | Secret key (`sb_secret_...`). Solo backend |
| `SUPABASE_BUCKET` | Bucket de archivos (por defecto `archivos`) |
| `JWT_SECRET` | Firma de los tokens de sesión |
| `JWT_EXPIRES_HOURS` | Duración de la sesión (por defecto 12) |
| `CORS_ORIGINS` | Orígenes del frontend permitidos, separados por coma |
| `DATABASE_URL` | Solo para `npm run db:migrate` |

## 2. Arquitectura

```
src/
  server.js            arranque (y precarga del catálogo)
  app.js               Express: helmet, CORS, JSON, rutas, manejo de errores
  config/              variables de entorno y cliente de Supabase
  routes/index.js      todas las rutas; separa públicas y privadas
  middlewares/         autenticación (JWT + sesión en BD), validación Zod, subida multipart, errores
  controllers/         traducen HTTP <-> servicios (códigos de estado, forma de respuesta)
  services/            lógica de negocio (equipos, reglas, análisis, recomendaciones, archivos...)
  domain/              reglas puras: tabla de tipos, estadísticas, reglas de archivos
  schemas/             esquemas Zod de cada petición
db/migrations/         SQL versionado
scripts/               migración, bucket y datos de demostración
test/                  pruebas con node:test
```

Decisiones principales:

- **Autenticación propia contra la BD**: contraseña con bcrypt en `usuario."contraseña"`, token JWT que referencia una fila de `sesion`. El logout marca la sesión como revocada, así que el token deja de servir aunque no haya expirado.
- **Catálogo en memoria**: Pokémon, movimientos, habilidades, etc. se cargan una vez y se refrescan cada 10 minutos. La validación, el análisis y las recomendaciones no consultan la BD en cada petición.
- **Guardado atómico**: la función SQL `guardar_equipo` escribe equipo, integrantes, movimientos y versión en una sola transacción.
- **Persistencia dual**: cada fichero va a Storage con nombre `UUID.ext` y su metadato a la tabla `archivo` (nombre original, MIME, peso, ruta, fecha, autor, equipo/versión). Se valida extensión, tipo MIME, firma binaria y peso. Los archivos se sirven con URLs firmadas temporales (1 h).
- **RLS activo** en las tablas de usuarios y equipos: con la llave publicable no se pueden leer ni escribir.

### Modelo de datos (tablas nuevas o ampliadas por la migración)

| Tabla | Para qué |
|---|---|
| `usuario` (+ `correo`, `biografia`, `formato_preferido`, `avatar_archivo_id`) | Cuentas |
| `sesion` | Sesiones activas / revocadas |
| `regulacion`, `regulacion_pokemon` | Qué Pokémon permite cada regulación |
| `equipo` (+ `formato`, `regulacion_id`, `descripcion`, `es_publico`, `enlace_publico`, `version_actual`) | Equipos |
| `pokemon_equipo` (+ `posicion`, `apodo`, `es_mega`) | Integrantes |
| `equipo_version` | Historial (copia JSON de cada guardado) |
| `archivo` | Metadatos de todos los ficheros |

## 3. Referencia de la API

Base: `http://localhost:3000/api`. Las rutas privadas requieren `Authorization: Bearer <token>`.

**Formato de respuesta**: éxito → `{ "data": ... }` (a veces con `meta`). Error → `{ "error": { "codigo", "mensaje", "detalles?" } }`, donde `detalles` es `[{ "campo": "integrantes[2].objeto", "mensaje": "..." }]` para mostrar cada error junto a su campo.

**Códigos**: 200 OK · 201 creado · 204 sin contenido · 400 validación · 401 sin sesión · 404 no existe · 409 correo repetido · 413 archivo muy grande · 415 tipo de archivo no permitido · 429 demasiados intentos · 500 error interno · 503 BD o Storage caídos.

### Públicas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado de la BD y Storage |
| POST | `/auth/register` | `{ nombreEntrenador, correo, contrasena }` → 201 `{ usuario, token, expiraEn }` |
| POST | `/auth/login` | `{ correo, contrasena }` → `{ usuario, token, expiraEn }` |
| GET | `/public/teams/:enlace` | Equipo compartido (solo lectura) |

### Sesión y perfil

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/logout` | Revoca la sesión → 204 |
| GET | `/auth/me` | Usuario de la sesión |
| GET | `/dashboard` | Resumen: nº de equipos, recientes, formato más usado, stat más baja del equipo reciente, últimos archivos |
| GET / PUT | `/users/me` | Perfil. PUT: `{ nombreEntrenador?, biografia?, formatoPreferido? }` |
| PUT | `/users/me/avatar` | multipart, campo `avatar` (JPG/PNG/WEBP, 2 MB) |
| DELETE | `/users/me/avatar` | Quita la foto |

### Catálogo

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/pokemon` | Filtros: `nombre`, `tipo`, `rol` (`atacante-fisico`, `atacante-especial`, `defensivo`, `rapido`, `equilibrado`), `regulacion`, `incluirMegas`, `orden` (`pokedex`, `nombre`, `total`, `ps`, `atq`, `def`, `ate`, `dfe`, `vel`), `dir`, `pagina`, `limite` |
| GET | `/pokemon/:id` | Ficha: tipos, estadísticas base, habilidades, movimientos aprendibles, Megaevoluciones y su Megapiedra. Acepta ID o nombre |
| GET | `/catalog/types` · `/catalog/natures` · `/catalog/items` · `/catalog/regulations` | Listas para los `<select>` |

### Equipos

Cuerpo de un equipo (POST/PUT). Pokémon, habilidad, objeto, naturaleza y movimientos aceptan **ID o nombre**; las estadísticas usan las mismas claves que `js/datos.js`:

```json
{
  "nombre": "Sol con Mega Charizard Y",
  "formato": "doble",
  "regulacion": "M-A",
  "descripcion": "Texto libre",
  "integrantes": [
    {
      "pokemon": "charizard",
      "apodo": "Fueguito",
      "habilidad": "Mar Llamas",
      "objeto": "Charizardita Y",
      "naturaleza": "Modesta",
      "movimientos": ["Lanzallamas", "Onda Ígnea", "Protección"],
      "evs": { "ps": 4, "atq": 0, "def": 0, "ate": 252, "dfe": 0, "vel": 252 },
      "esMega": true
    }
  ]
}
```

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/teams` | Mis equipos (filtros `nombre`, `formato`) |
| POST | `/teams` | Crea (valida reglas) → 201. Genera versión 1 y su TXT |
| POST | `/teams/preview` | Valida + análisis + recomendaciones **sin guardar** (para el editor en vivo). `?stat=def` opcional |
| GET | `/teams/:id` | Detalle con estadísticas calculadas a nivel 50 |
| PUT | `/teams/:id` | Actualiza → nueva versión + nuevo TXT |
| DELETE | `/teams/:id` | Borra el equipo y sus ficheros → 204 |
| POST | `/teams/:id/duplicate` | Copia → 201 |
| GET | `/teams/:id/analysis` | Tabla de debilidades/resistencias contra los 18 tipos, cobertura ofensiva y alertas |
| GET | `/teams/:id/recommendations` | Estadística más baja (o `?stat=def`) y hasta 5 sugerencias |
| GET | `/teams/:id/versions` | Historial |
| GET | `/teams/:id/versions/:numero` | Contenido de una versión |
| POST | `/teams/:id/versions/:numero/restore` | Restaura como versión nueva |
| PATCH | `/teams/:id/share` | `{ publico: true \| false }` → `{ esPublico, enlacePublico }` |
| POST | `/teams/:id/exports` | `{ formato: "txt" \| "png" }` → 201 con el archivo generado y su URL |
| POST | `/teams/import` | multipart: `archivo` (.txt) + `nombre?`, `formato?`, `regulacion?` → 201 |
| GET / POST | `/teams/:id/files` | Adjuntos. POST multipart: `archivo` (JPG/PNG 5 MB o PDF 10 MB), `categoria?` (`captura` \| `notas_pdf`) |

Reglas que valida el servidor: máximo 6 integrantes, Pokémon y Mega permitidos por la regulación, sin especies repetidas, sin objetos repetidos, movimientos aprendibles (1 a 4, sin repetir), habilidad válida, EVs ≤ 252 por stat y ≤ 510 en total, una sola Megaevolución y con su Megapiedra equipada.

### Archivos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/files` | Mis archivos (filtros `categoria`, `equipo`, `limite`) con URL firmada |
| GET | `/files/:id` | Metadatos + URL (`?descargar=true` fuerza la descarga con el nombre original) |
| DELETE | `/files/:id` | Borra fichero y metadatos → 204 |

## 4. Uso desde el frontend

Ejemplo con `fetch`: guardar el `token` que devuelve el login y enviarlo en cada petición privada.

```js
const API = "http://localhost:3000/api";

// Login
const res = await fetch(`${API}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ correo, contrasena }),
});
const cuerpo = await res.json();
if (!res.ok) {
  // cuerpo.error.mensaje y cuerpo.error.detalles [{ campo, mensaje }]
} else {
  localStorage.setItem("token", cuerpo.data.token);
}

// Petición privada
await fetch(`${API}/teams`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

// Subida de archivo (multipart/form-data): no poner Content-Type, el navegador lo arma
const form = new FormData();
form.append("avatar", input.files[0]);
await fetch(`${API}/users/me/avatar`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: form });
```

Si una petición privada responde 401, la sesión venció o se cerró: borrar el token y redirigir al login.

En producción, agregar el dominio del frontend a `CORS_ORIGINS`.
