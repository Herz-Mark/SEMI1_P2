// routes/archivos.js

const express = require("express");
const jwt = require("jsonwebtoken");
const sql = require("mssql");

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

// 🔗 Configuración SQL Server
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // true si usas Azure
        trustServerCertificate: true,
    },
};

// 📂 GET /archivos
router.get("/archivos", async (req, res) => {
    const authHeader = req.headers["authorization"];

    // 🔐 Validar token
    if (!authHeader) {
        return res.status(401).json({ detail: "Token requerido" });
    }

    let user_id;

    try {
        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, SECRET_KEY);
        user_id = payload.user_id;
    } catch (error) {
        return res.status(401).json({ detail: "Token inválido" });
    }

    try {
        // 🗄️ Conectar a BD
        const pool = await sql.connect(dbConfig);

        const result = await pool
            .request()
            .input("user_id", sql.Int, user_id)
            .query(`
                SELECT file_name, file_type, file_url
                FROM archivos
                WHERE user_id = @user_id
            `);

        const archivos = result.recordset.map((row) => {
            let tipo = String(row.file_type).toLowerCase();
            let tipo_normalizado;

            // 🔥 NORMALIZACIÓN (igual que Python)
            if (["jpg", "jpeg", "png", "gif", "webp"].includes(tipo)) {
                tipo_normalizado = "Imagen";
            } else if (["pdf", "doc", "docx", "xls", "xlsx", "txt"].includes(tipo)) {
                tipo_normalizado = "Documento";
            } else if (["imagen", "image"].includes(tipo)) {
                tipo_normalizado = "Imagen";
            } else if (["documento", "document"].includes(tipo)) {
                tipo_normalizado = "Documento";
            } else {
                tipo_normalizado = "Documento";
            }

            return {
                file_name: row.file_name,
                file_type: tipo_normalizado,
                file_url: row.file_url,
            };
        });

        return res.json(archivos);

    } catch (error) {
        console.error("Error al listar archivos:", error);
        return res.status(500).json({ detail: "Error interno del servidor" });
    }
});

module.exports = router;