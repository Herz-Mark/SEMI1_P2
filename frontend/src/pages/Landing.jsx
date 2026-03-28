import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing-container">
      <h1 className="landing-title">
        Domina tus tareas con <span>TaskFlow</span>
      </h1>

      <p className="landing-subtitle">
        Gestiona tus proyectos en la nube de forma rápida y segura. Sube tus
        archivos, organiza tu día y no pierdas el ritmo.
      </p>

      <div className="landing-actions">
        <Link to="/registro" className="btn-primary">
          Comenzar ahora
        </Link>
        <Link to="/login" className="btn-outline">
          Ya tengo cuenta
        </Link>
      </div>
    </div>
  );
}
