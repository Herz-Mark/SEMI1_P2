const sql = require("mssql");

const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || 1433),
  options: {
    encrypt: false, // Para desarrollo local. En producción (Azure/AWS) se pasa a true
    trustServerCertificate: true,
  },
};

async function getConnection() {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.error("❌ Error conectando a SQL Server:", error);
    throw error;
  }
}

module.exports = { getConnection, sql };
