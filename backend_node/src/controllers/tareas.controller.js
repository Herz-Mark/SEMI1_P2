import { getConnection, sql } from "../config/db.js";

// OBTENER
export const obtenerTareas = async (req, res) => {
  try {
    const uid = req.user.uid;

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("uid", sql.VarChar, uid)
      .query("SELECT * FROM tasks WHERE uid = @uid");

    res.json(result.recordset);
  } catch (error) {
    console.error("Error obteniendo tareas:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
};

// CREAR
export const crearTarea = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { titulo, descripcion } = req.body;

    const pool = await getConnection();

    await pool
      .request()
      .input("uid", sql.VarChar, uid)
      .input("titulo", sql.VarChar, titulo)
      .input("descripcion", sql.VarChar, descripcion)
      .input("estado", sql.VarChar, "pendiente")
      .query(`
        INSERT INTO tasks (uid, titulo, descripcion, estado)
        VALUES (@uid, @titulo, @descripcion, @estado)
      `);

    res.json({ msg: "Tarea creada" });
  } catch (error) {
    console.error("Error creando tarea:", error);
    res.status(500).json({ error: "Error al crear tarea" });
  }
};

// ACTUALIZAR
export const actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado } = req.body;

    const pool = await getConnection();

    await pool
      .request()
      .input("id", sql.Int, id)
      .input("titulo", sql.VarChar, titulo)
      .input("descripcion", sql.VarChar, descripcion)
      .input("estado", sql.VarChar, estado)
      .query(`
        UPDATE tasks 
        SET titulo=@titulo, descripcion=@descripcion, estado=@estado
        WHERE task_id=@id
      `);

    res.json({ msg: "Actualizada" });
  } catch (error) {
    console.error("Error actualizando tarea:", error);
    res.status(500).json({ error: "Error al actualizar" });
  }
};

// ELIMINAR
export const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await getConnection();

    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM tasks WHERE task_id=@id");

    res.json({ msg: "Eliminada" });
  } catch (error) {
    console.error("Error eliminando tarea:", error);
    res.status(500).json({ error: "Error al eliminar" });
  }
};