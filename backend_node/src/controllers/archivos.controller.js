const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// 1. Configuración dinámica usando tu .env
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const subirFotoPerfil = async (req, res) => {
  try {
    const { base64Image } = req.body;

    if (!base64Image) {
      return res
        .status(400)
        .json({ mensaje: "No se proporcionó ninguna imagen" });
    }

    // 2. Limpieza robusta del Base64 (Soporta PNG, JPEG, WEBP, etc.)
    const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return res.status(400).json({ mensaje: "Formato de imagen inválido" });
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // 3. Crear nombre único y leer el bucket del .env
    const extension = contentType.split("/")[1] || "jpg";
    const fileName = `perfil-${Date.now()}.${extension}`;
    const bucketName = process.env.AWS_BUCKET_NAME;

    // 4. Subir a MinIO / S3
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // 5. Construir la URL pública dinámicamente
    const imageUrl = `${process.env.AWS_ENDPOINT_URL}/${bucketName}/${fileName}`;

    res.status(200).json({
      mensaje: "Imagen subida con éxito",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Error al subir a S3/MinIO:", error);
    res.status(500).json({ mensaje: "Error interno al guardar la imagen" });
  }
};

module.exports = { subirFotoPerfil };
