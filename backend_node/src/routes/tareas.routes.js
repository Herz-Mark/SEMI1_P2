import { Router } from "express";
import {
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
} from "../controllers/tareas.controller.js";

const router = Router();

// GET
router.get("/:uid", obtenerTareas);

// POST
router.post("/", crearTarea);

// PUT
router.put("/:id", actualizarTarea);

// DELETE
router.delete("/:id", eliminarTarea);

export default router;