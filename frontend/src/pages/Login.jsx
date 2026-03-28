import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("Verificando credenciales...");
    setError(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMensaje("Acceso concedido. Redirigiendo...");
        setError(false);

        // Guardamos el token y datos del usuario
        localStorage.setItem("taskflow_token", data.token);
        localStorage.setItem("taskflow_user", JSON.stringify(data.usuario));

        // Redirigimos al módulo de tareas
        setTimeout(() => {
          navigate("/tareas");
        }, 1500);
      } else {
        setMensaje(`Error: ${data.mensaje}`);
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error de conexión con el servidor.");
      setError(true);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2 className="form-title">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: "10px" }}
          >
            Ingresar
          </button>
        </form>

        {/* ALERTA CON ICONOS SVG */}
        {mensaje && (
          <div
            className={`alert ${error ? "alert-error" : "alert-success"}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {error ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <span>{mensaje}</span>
          </div>
        )}

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
