const express = require("express");
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario,
} = require("../controllers/usuarios.controller.js");
const { subirFotoPerfil } = require("../controllers/archivos.controller");

// Endpoint: POST /api/usuarios/registro
router.post("/registro", registrarUsuario);

// Endpoint: POST /api/usuarios/login
router.post("/login", loginUsuario);

// Endpoint: POST /api/usuarios/subir-foto (El puente hacia MinIO)
router.post("/subir-foto", subirFotoPerfil);

module.exports = router;
