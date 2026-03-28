exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { file, fileName, contentType } = body;

    // validar documento
    if (contentType.startsWith("image/")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Solo documentos permitidos" }),
      };
    }

    const token = event.headers.Authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const uid = decoded.uid;

    const buffer = Buffer.from(file, "base64");
    const key = `documentos/${Date.now()}-${fileName}`;

    await s3.putObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }).promise();

    const fileUrl = `${process.env.AWS_ENDPOINT_URL}/${process.env.AWS_BUCKET_NAME}/${key}`;

    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("uid", sql.Int, uid)
      .input("name", sql.VarChar, fileName)
      .input("url", sql.VarChar, fileUrl)
      .input("type", sql.VarChar, "Documento")
      .query(`
        INSERT INTO files (uid, file_name, file_url, file_type)
        VALUES (@uid, @name, @url, @type)
      `);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Documento subido", url: fileUrl }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};