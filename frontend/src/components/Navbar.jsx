import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  // useLocation fuerza al Navbar a re-evaluar su estado cada vez que cambiamos de URL
  const location = useLocation();

  // Revisamos si existe el token y extraemos el nombre del usuario
  const token = localStorage.getItem("taskflow_token");
  const user = JSON.parse(localStorage.getItem("taskflow_user") || "{}");

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        TaskFlow
      </Link>

      <div className="nav-links">
        {token ? (
          /* 
             VISTA PARA USUARIOS LOGUEADOS
              */
          <>
            <span
              className="link-text"
              style={{ cursor: "default", color: "var(--accent)" }}
            >
              Hola, {user.username}
            </span>
            <Link to="/tareas" className="link-text">
              Tareas
            </Link>
            <Link to="/archivos" className="link-text">
              Archivos
            </Link>
            <Link to="/verArchivos" className="link-text">
              Archivos
            </Link>
            <button
              onClick={handleLogout}
              className="btn-outline"
              style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
            >
              Salir
            </button>
          </>
        ) : (
          /* 
             VISTA PARA INVITADOS (SIN SESIÓN)
              */
          <>
            <Link to="/login" className="link-text">
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="btn-primary">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
