const AWS = require("aws-sdk");
const sql = require("mssql");
const jwt = require("jsonwebtoken");

const s3 = new AWS.S3({
  endpoint: process.env.AWS_ENDPOINT_URL,
  s3ForcePathStyle: true,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { file, fileName, contentType } = body;

    // validar imagen
    if (!contentType.startsWith("image/")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Solo imágenes permitidas" }),
      };
    }

    // 🔐 JWT
    const token = event.headers.Authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const uid = decoded.uid;

    const buffer = Buffer.from(file, "base64");
    const key = `imagenes/${Date.now()}-${fileName}`;

    // subir a S3
    await s3.putObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }).promise();

    const fileUrl = `${process.env.AWS_ENDPOINT_URL}/${process.env.AWS_BUCKET_NAME}/${key}`;

    // enviar a DB
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("uid", sql.Int, uid)
      .input("name", sql.VarChar, fileName)
      .input("url", sql.VarChar, fileUrl)
      .input("type", sql.VarChar, "Imagen")
      .query(`
        INSERT INTO files (uid, file_name, file_url, file_type)
        VALUES (@uid, @name, @url, @type)
      `);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Imagen subida", url: fileUrl }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};