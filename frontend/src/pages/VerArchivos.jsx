import { useEffect, useState } from "react";

export default function Archivos() {
    const [files, setFiles] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem("taskflow_token");

            const res = await fetch("TU_API_LISTAR", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setFiles(data);
        } catch (error) {
            console.error("Error cargando archivos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const filteredFiles = files.filter((f) => {
        if (filter === "all") return true;
        if (filter === "imagen") return f.file_type?.toLowerCase() === "imagen";
        if (filter === "documento") return f.file_type?.toLowerCase() === "documento";
        return true;
    });

    return (
        <div style={styles.container}>

            {/* HEADER */}
            <div style={styles.header}>
                <h2 style={styles.title}>Mis Archivos</h2>

                {/* FILTROS */}
                <div style={styles.filterContainer}>

                    <button
                        onClick={() => setFilter("all")}
                        style={{
                            ...styles.button,
                            ...(filter === "all" ? styles.active : {}),
                        }}
                    >
                        🗂️ Todos
                    </button>

                    <button
                        onClick={() => setFilter("imagen")}
                        style={{
                            ...styles.button,
                            ...(filter === "imagen" ? styles.active : {}),
                        }}
                    >
                        🖼️ Imágenes
                    </button>

                    <button
                        onClick={() => setFilter("documento")}
                        style={{
                            ...styles.button,
                            ...(filter === "documento" ? styles.active : {}),
                        }}
                    >
                        📄 Documentos
                    </button>

                </div>
            </div>

            {/* LOADING */}
            {loading ? (
                <p>Cargando archivos...</p>
            ) : (
                <div style={styles.grid}>
                    {filteredFiles.map((file, index) => (
                        <div key={index} style={styles.card}>

                            {/* PREVIEW */}
                            <div style={styles.preview}>
                                {file.file_type === "Imagen" ? (
                                    <a href={file.file_url} target="_blank" rel="noreferrer">
                                        <img src={file.file_url} alt="" style={styles.image} />
                                    </a>
                                ) : (
                                    <a href={file.file_url} target="_blank" rel="noreferrer">
                                        <div style={styles.docCircle}>📄</div>
                                    </a>
                                )}
                            </div>

                            {/* INFO */}
                            <div style={styles.info}>
                                <p style={styles.name}>{file.file_name}</p>

                                <a href={file.file_url} target="_blank" rel="noreferrer" style={styles.link}>
                                    Abrir
                                </a>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        background: "#021f1f",
        minHeight: "100vh",
        padding: "30px",
        color: "white",
    },

    header: {
        display: "flex",
        alignItems: "center",
        marginBottom: "30px",
    },

    title: {
        margin: 0,
        fontSize: "24px",
    },

    filterContainer: {
        marginLeft: "auto",
        display: "flex",
        background: "rgba(5,45,45,0.8)",
        padding: "5px",
        borderRadius: "50px",
        border: "1px solid #0a3f3f",
    },

    button: {
        padding: "8px 14px",
        borderRadius: "50px",
        border: "none",
        background: "transparent",
        color: "#ccc",
        cursor: "pointer",
        transition: "0.3s",
    },

    active: {
        background: "#22c55e",
        color: "black",
        fontWeight: "bold",
        transform: "scale(1.05)",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px",
    },

    card: {
        background: "#052d2d",
        borderRadius: "15px",
        overflow: "hidden",
    },

    preview: {
        height: "150px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#021f1f",
    },

    image: {
        width: "100%",
        height: "150px",
        objectFit: "cover",
    },

    docCircle: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        border: "2px dashed gray",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "30px",
    },

    info: {
        padding: "10px",
    },

    name: {
        fontSize: "14px",
        marginBottom: "5px",
    },

    link: {
        color: "#22c55e",
        textDecoration: "none",
    },
};