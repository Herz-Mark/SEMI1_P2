import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";

function obtenerUidDesdeToken() {
  const token = localStorage.getItem("taskflow_token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.uid;
  } catch (error) {
    console.error("Token inválido");
    return null;
  }
}

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("taskflow_token");
  const uid = obtenerUidDesdeToken();

  // =========================
  // CARGAR
  // =========================
  const cargarTareas = async () => {
    if (!uid) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tareas/${uid}`
      );

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Respuesta no es array:", data);
        return;
      }

      const adaptadas = data.map((t) => ({
        task_id: t.task_id,
        title: t.titulo,
        description: t.descripcion,
        status: t.estado,
      }));

      setTareas(adaptadas);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  // =========================
  // CREAR
  // =========================
  const crearTarea = async (e) => {
    e.preventDefault();
    if (!title || !uid) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/tareas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          titulo: title,
          descripcion: description,
        }),
      });

      setTitle("");
      setDescription("");
      cargarTareas();
    } catch (error) {
      console.error("Error creando tarea:", error);
    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const eliminar = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/tareas/${id}`, {
      method: "DELETE",
    });

    cargarTareas();
  };

  // =========================
  // CAMBIAR ESTADO
  // =========================
  const cambiarEstado = async (id) => {
    const tarea = tareas.find((t) => t.task_id === id);

    await fetch(`${import.meta.env.VITE_API_URL}/api/tareas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: tarea.title,
        descripcion: tarea.description,
        estado:
          tarea.status === "completada" ? "pendiente" : "completada",
      }),
    });

    cargarTareas();
  };

  // =========================
  // EDITAR
  // =========================
  const editar = async (id, newTitle, newDesc) => {
    const tarea = tareas.find((t) => t.task_id === id);

    await fetch(`${import.meta.env.VITE_API_URL}/api/tareas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: newTitle,
        descripcion: newDesc,
        estado: tarea.status,
      }),
    });

    cargarTareas();
  };

  // =========================
  // ESTILO BOTÓN
  // =========================
  const botonEstilo = {
    padding: "10px 15px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    transition: "all 0.2s ease",
  };

  return (
    <div className="form-wrapper">
      <div className="form-card" style={{ maxWidth: "900px" }}>
        <h2 className="form-title">Gestión de Tareas</h2>

        {/* FORM */}
        <form onSubmit={crearTarea}>
          <input
            type="text"
            placeholder="Título de la tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          />

          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          />

          <button
            type="submit"
            style={botonEstilo}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            Crear tarea 🚀
          </button>
        </form>

        {/* LISTA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {tareas.map((task) => (
            <TaskCard
              key={task.task_id}
              task={task}
              eliminar={eliminar}
              cambiarEstado={cambiarEstado}
              editar={editar}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
