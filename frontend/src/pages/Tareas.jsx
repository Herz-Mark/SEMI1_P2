export default function Tareas() {
  return (
    <div className="landing-container">
      <h1 className="landing-title">
        Módulo de <span>Tareas</span>
      </h1>

      <p className="landing-subtitle">
        El inicio de sesión fue exitoso. Este es el espacio reservado para que
        el equipo desarrolle la vista del tablero y gestión de actividades.
      </p>

      <div
        style={{
          marginTop: "2rem",
          padding: "2rem",
          border: "2px dashed var(--border-color)",
          borderRadius: "1rem",
          color: "var(--text-muted)",
        }}
      >
        [ Placeholder: Aquí irá el CRUD de tareas ]
      </div>
    </div>
  );
}
