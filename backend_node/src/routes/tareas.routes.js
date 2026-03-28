import { Router } from "express";
import {
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea
} from "../controllers/tareas.controller.js";

import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

// GET
router.get("/", verificarToken, obtenerTareas);

// POST
router.post("/", verificarToken, crearTarea);

// PUT
router.put("/:id", verificarToken, actualizarTarea);

// DELETE
router.delete("/:id", verificarToken, eliminarTarea);

export default router;