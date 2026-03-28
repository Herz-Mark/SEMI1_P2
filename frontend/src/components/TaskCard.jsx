import { useState } from "react";

export default function TaskCard({ task, recargar }) {
  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(task.titulo);
  const [desc, setDesc] = useState(task.descripcion);

  const btn = {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginRight: "5px",
    marginTop: "5px",
  };

  const eliminar = async () => {
    await fetch(`http://localhost:5000/tasks/${task.task_id}`, {
      method: "DELETE",
    });
    recargar();
  };

  const cambiarEstado = async () => {
    await fetch(`http://localhost:5000/tasks/${task.task_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...task,
        estado: task.estado === "completada" ? "pendiente" : "completada",
      }),
    });
    recargar();
  };

  const guardar = async () => {
    await fetch(`http://localhost:5000/tasks/${task.task_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...task,
        titulo,
        descripcion: desc,
      }),
    });

    setEditando(false);
    recargar();
  };

  return (
    <div
      style={{
        background: "#1e293b",
        padding: "15px",
        borderRadius: "12px",
        color: "white",
      }}
    >
      {editando ? (
        <>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />

          <button
            style={{ ...btn, background: "#22c55e", color: "white" }}
            onClick={guardar}
          >
            Guardar
          </button>
        </>
      ) : (
        <>
          <h3>{task.titulo}</h3>
          <p>{task.descripcion}</p>

          <span
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
              background:
                task.estado === "completada" ? "#22c55e" : "#eab308",
              color: "black",
            }}
          >
            {task.estado}
          </span>

          <div>
            <button
              style={{ ...btn, background: "#eab308" }}
              onClick={cambiarEstado}
            >
              Estado
            </button>

            <button
              style={{ ...btn, background: "#3b82f6", color: "white" }}
              onClick={() => setEditando(true)}
            >
              Editar
            </button>

            <button
              style={{ ...btn, background: "#ef4444", color: "white" }}
              onClick={eliminar}
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  );
}