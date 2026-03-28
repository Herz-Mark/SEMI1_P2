import { useState, useRef } from "react";

export default function Registro() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_image_url: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  // Estados y Referencias
  const [imagePreview, setImagePreview] = useState(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // LÓGICA DE IMÁGENES
  // ==========================================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, profile_image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const startWebcam = async () => {
    setIsWebcamOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error cámara:", err);
      setMensaje("Error: No se pudo acceder a la cámara.");
      setError(true);
      setIsWebcamOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, 300, 300);
      const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");

      setImagePreview(imageDataUrl);
      setFormData({ ...formData, profile_image_url: imageDataUrl });
      stopWebcam();
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsWebcamOpen(false);
  };

  // ==========================================
  // ENVÍO DEL FORMULARIO (MINIO + SQL SERVER)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("Paso 1: Subiendo foto al servidor...");
    setError(false);

    if (!formData.profile_image_url) {
      setMensaje("Error: Debes subir o tomar una foto de perfil.");
      setError(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMensaje("Error: Las contraseñas no coinciden.");
      setError(true);
      return;
    }

    try {
      // 1. Subir la imagen a MinIO
      const uploadResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/subir-foto`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64Image: formData.profile_image_url }),
        },
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.mensaje || "Fallo al subir la imagen");
      }

      setMensaje("Paso 2: Creando usuario...");
      const minioUrl = uploadData.url;

      // 2. Registrar en SQL Server con la URL corta
      const registerResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/registro`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, profile_image_url: minioUrl }),
        },
      );

      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        setMensaje(`Éxito: ${registerData.mensaje}`);
        setError(false);
      } else {
        setMensaje(`Error: ${registerData.mensaje}`);
        setError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje(`Error de conexión: ${error.message}`);
      setError(true);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2 className="form-title">Crear Cuenta</h2>

        {/* CONTENEDOR DE LA FOTO */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          {/* Vista Previa forzada a círculo */}
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Perfil"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid var(--accent)",
              }}
            />
          ) : (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "2px dashed var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
          )}

          {/* Botones de acción alineados */}
          <div style={{ display: "flex", gap: "10px" }}>
            <label
              className="btn-small"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              Subir Archivo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>

            <button
              type="button"
              onClick={startWebcam}
              className="btn-small"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                />
              </svg>
              Cámara
            </button>
          </div>
        </div>

        {/* FORMULARIO */}
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
              type="email"
              name="email"
              placeholder="Correo electrónico"
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
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar Contraseña"
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
            Registrarse
          </button>
        </form>

        {/* ALERTA (Sin emojis) */}
        {mensaje && (
          <div className={`alert ${error ? "alert-error" : "alert-success"}`}>
            {mensaje}
          </div>
        )}
      </div>

      {/* MODAL DE CÁMARA */}
      {isWebcamOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(2, 27, 26, 0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              border: "3px solid var(--accent)",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "400px",
              marginBottom: "20px",
              backgroundColor: "#000",
            }}
          ></video>
          <canvas
            ref={canvasRef}
            width="300"
            height="300"
            style={{ display: "none" }}
          ></canvas>

          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={capturePhoto}
              className="btn-primary"
              style={{ padding: "10px 20px", fontSize: "1.1rem" }}
            >
              Tomar Foto
            </button>
            <button
              onClick={stopWebcam}
              className="btn-outline"
              style={{ padding: "10px 20px", fontSize: "1.1rem" }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
