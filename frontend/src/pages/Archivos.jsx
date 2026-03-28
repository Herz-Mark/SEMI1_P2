import { useState } from "react";

export default function Archivos() {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Full = reader.result;
      const base64 = base64Full.split(",")[1];

      // Diferenciar tipo
      if (file.type.startsWith("image/")) {
        setPreview(base64Full);
      } else {
        setPreview("file");
      }

      try {
        setMensaje("Subiendo archivo...");
        setError(false);

          const token = localStorage.getItem("taskflow_token");

        const response = await fetch(
          import.meta.env.VITE_API_SERVERLESS_URL,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // JWT
            },
            body: JSON.stringify({
              file: base64,
              fileName: file.name,
              contentType: file.type,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setMensaje("Archivo subido correctamente");
          setError(false);

          //  limpiar después de subir
          setTimeout(() => {
            setPreview(null);
            setFileName("");
          }, 2000);
        } else {
          setMensaje(data.error || "Error del servidor");
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setMensaje("Error de conexión con el servidor");
        setError(true);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2 className="form-title">Subir Archivo</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          {/* CÍRCULO */}
          {preview && preview !== "file" ? (
            <img
              src={preview}
              alt="preview"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid var(--accent)",
              }}
            />
          ) : preview === "file" ? (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "2px dashed var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center",
                padding: "10px",
                fontSize: "11px",
                color: "var(--text-muted)",
              }}
            >
              📄
              <span style={{ marginTop: "5px" }}>{fileName}</span>
            </div>
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
              {/* FLECHA DENTRO DEL CÍRCULO */}
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
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
          )}

          {/* BOTÓN */}
          <label
            className="btn-small"
            style={{
              cursor: "pointer",
            }}
          >
            Subir Archivo
            <input
              type="file"
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {/* MENSAJE */}
        {mensaje && (
          <div className={`alert ${error ? "alert-error" : "alert-success"}`}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}