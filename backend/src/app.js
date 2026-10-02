const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const env = require("./config/env");
const rutas = require("./routes");
const { rutaNoEncontrada, manejarErrores } = require("./middlewares/manejoErrores");

const app = express();

app.set("trust proxy", 1); // detrás del proxy del hosting (Render, Railway...) para el rate limit por IP
app.use(helmet());
app.use(
  cors({
    origin(origen, callback) {
      // Sin origen = curl/Postman. En desarrollo también se permite abrir el HTML como archivo (origen "null").
      const permitido =
        !origen || env.corsOrigins.includes(origen) || (env.nodeEnv !== "production" && origen === "null");
      callback(null, permitido);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Location"],
  })
);
app.use(express.json({ limit: "200kb" }));

app.get("/", (req, res) => res.json({ nombre: "Pokémon Team Builder API", salud: "/api/health" }));
app.use("/api", rutas);

app.use(rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;
