const { getConnection, sql } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// MÓDULO 1: REGISTRO DE USUARIOS
const registrarUsuario = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, profile_image_url } =
      req.body;

    // 1. Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return res.status(400).json({ mensaje: "Las contraseñas no coinciden" });
    }

    const pool = await getConnection();

    // 2. Validar que el usuario o correo no existan ya
    const checkUser = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .query(
        "SELECT uid FROM users WHERE username = @username OR email = @email",
      );

    if (checkUser.recordset.length > 0) {
      return res
        .status(400)
        .json({ mensaje: "El nombre de usuario o correo ya está en uso" });
    }

    // 3. Encriptar la contraseña (10 rondas de salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insertar en la base de datos
    await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .input("profile_image_url", sql.VarChar, profile_image_url).query(`
                INSERT INTO users (username, email, password, profile_image_url)
                VALUES (@username, @email, @password, @profile_image_url)
            `);

    res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// MÓDULO 2: INICIO DE SESIÓN (LOGIN)
const loginUsuario = async (req, res) => {
  try {
    const { username, password } = req.body;

    const pool = await getConnection();

    // 1. Buscar al usuario por su username
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM users WHERE username = @username");

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // 2. Comparar la contraseña ingresada con el hash de la BD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // 3. Generar el Token JWT con el UID del usuario
    // El token durará 24 horas
    const token = jwt.sign(
      { uid: user.uid, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // 4. Devolver el token y datos básicos (sin la contraseña)
    res.status(200).json({
      mensaje: "Login exitoso",
      token: token,
      usuario: {
        uid: user.uid,
        username: user.username,
        profile_image_url: user.profile_image_url,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
};
