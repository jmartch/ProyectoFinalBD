// controllers/AUTH.controller.js
import Usuario from "../models/USUARIO.model.js";
import db from "../config/db.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
      return res.status(400).json({
        message: "Debes enviar usuario y contraseña",
      });
    }

    const user = await Usuario.getById(usuario);
    if (!user) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
      });
    }

    const passwordOk = await bcrypt.compare(contraseña, user.contraseña);
    if (!passwordOk) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
      });
    }

    // Traer datos de la persona (funcionario por ahora)
    let person = null;
    if (user.doc_funcionario) {
      const [rows] = await db.query(
        `SELECT 
           doc_funcionario AS id,
           nombre1 AS firstName,
           apellido1 AS lastName,
           correo,
           telefono
         FROM funcionario
         WHERE doc_funcionario = ?`,
        [user.doc_funcionario]
      );
      person = rows[0] || null;
    }

    // Aquí podrías luego incluir estudiantes si creas usuarios para ellos
    // if (!person) { buscar en estudiante... }

    // Construimos el objeto que tu Dashboard necesita
    const authUser = {
      user: {
        username: user.usuario,
        role: user.rol, // ADMIN / ADMINISTRATIVO / TUTOR
      },
      person, // { id, firstName, lastName, correo, telefono }
    };

    res.json(authUser);
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      message: "Error en el servidor al iniciar sesión",
      error: error.message,
    });
  }
};
