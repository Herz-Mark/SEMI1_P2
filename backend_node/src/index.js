// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3004;

// Middlewares globales - EL ORDEN IMPORTA
app.use(cors());

// SOLO UNA VEZ y con el límite incluido
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.json({
    mensaje: "¡Backend de Node.js + Express funcionando correctamente!",
  });
});

// --- RUTAS DE LA API ---
app.use("/api/usuarios", require("./routes/usuarios.routes"));
app.use("/api/tareas", require("./routes/tareas.routes"));

// Health Check para Azure / AWS Load Balancer
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    entorno: "Node.js",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de Node.js corriendo en el puerto ${PORT}`);
});
