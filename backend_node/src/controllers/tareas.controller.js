import { getConnection } from "../config/db.js";

// OBTENER
export const obtenerTareas = async (req, res) => {
  const uid = req.user.uid;

  const conn = await getConnection();
  const [rows] = await conn.execute(
    "SELECT * FROM tasks WHERE uid = ?",
    [uid]
  );

  res.json(rows);
};

// CREAR
export const crearTarea = async (req, res) => {
  const uid = req.user.uid;
  const { titulo, descripcion } = req.body;

  const conn = await getConnection();

  await conn.execute(
    "INSERT INTO tasks (uid, titulo, descripcion, estado) VALUES (?, ?, ?, ?)",
    [uid, titulo, descripcion, "pendiente"]
  );

  res.json({ msg: "Tarea creada" });
};

// ACTUALIZAR
export const actualizarTarea = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, estado } = req.body;

  const conn = await getConnection();

  await conn.execute(
    "UPDATE tasks SET titulo=?, descripcion=?, estado=? WHERE task_id=?",
    [titulo, descripcion, estado, id]
  );

  res.json({ msg: "Actualizada" });
};


// ELIMINAR
export const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  const conn = await getConnection();

  await conn.execute(
    "DELETE FROM tasks WHERE task_id=?",
    [id]
  );

  res.json({ msg: "Eliminada" });
};