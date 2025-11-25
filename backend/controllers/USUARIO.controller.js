// controllers/USUARIO.controller.js
import Usuario from "../models/USUARIO.model.js";
import bcrypt from "bcrypt";

export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();
    // No enviar contraseñas en la respuesta
    const usuariosSinPassword = usuarios.map(({ contraseña, ...usuario }) => usuario);
    res.json(usuariosSinPassword);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los usuarios",
      error: error.message
    });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const { usuario } = req.params;
    const usuarioData = await Usuario.getById(usuario);

    if (!usuarioData) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    // No enviar contraseña en la respuesta
    const { contraseña, ...usuarioSinPassword } = usuarioData;
    res.json(usuarioSinPassword);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el usuario",
      error: error.message
    });
  }
};

export const createUsuario = async (req, res) => {
  console.log("BODY RECIBIDO:", req.body);  
  try {
    const { usuario, doc_funcionario, contraseña, rol } = req.body;

    // Validación de campos obligatorios
    if (!usuario || !doc_funcionario || !contraseña || !rol) {
      return res.status(400).json({
        message: "Faltan campos requeridos: usuario, doc_funcionario, contraseña, rol"
      });
    }

    // Validación de longitud de usuario
    if (usuario.length < 3 || usuario.length > 50) {
      return res.status(400).json({
        message: "El usuario debe tener entre 3 y 50 caracteres"
      });
    }

    // Validación de contraseña
    if (contraseña.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    // Validación de rol
    const rolesValidos = ['admin', 'profesor', 'coordinador', 'secretario'];
    if (!rolesValidos.includes(rol.toLowerCase())) {
      return res.status(400).json({
        message: "Rol inválido. Valores permitidos: admin, profesor, coordinador, secretario"
      });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const result = await Usuario.create({
      usuario,
      doc_funcionario,
      contraseña: hashedPassword,
      rol
    });

    res.status(201).json({
      message: "Usuario creado exitosamente",
      data: {
        usuario,
        id_funcionario,
        rol: rol.toLowerCase()
      }
    });
  } catch (error) {
    // Manejo de usuario duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: "Ya existe un usuario con ese nombre"
      });
    }
    // Manejo de llave foránea inválida (funcionario no existe)
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({
        message: "El funcionario especificado no existe"
      });
    }
    res.status(500).json({
      message: "Error al crear el usuario",
      error: error.message
    });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const { usuario } = req.params;
    const data = req.body;

    // Validar que haya datos para actualizar
    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "No se proporcionaron datos para actualizar"
      });
    }

    // No permitir actualizar el nombre de usuario
    if (data.usuario) {
      return res.status(400).json({
        message: "No se puede actualizar el nombre de usuario"
      });
    }

    // Validación de rol (si se proporciona)
    if (data.rol) {
      const rolesValidos = ['admin', 'profesor', 'coordinador', 'secretario'];
      if (!rolesValidos.includes(data.rol.toLowerCase())) {
        return res.status(400).json({
          message: "Rol inválido. Valores permitidos: admin, profesor, coordinador, secretario"
        });
      }
      data.rol = data.rol.toLowerCase();
    }

    // Si se actualiza la contraseña, hashearla
    if (data.contraseña) {
      if (data.contraseña.length < 6) {
        return res.status(400).json({
          message: "La contraseña debe tener al menos 6 caracteres"
        });
      }
      const saltRounds = 10;
      data.contraseña = await bcrypt.hash(data.contraseña, saltRounds);
    }

    const result = await Usuario.update(usuario, data);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    // No enviar contraseña en la respuesta
    const { contraseña, ...dataParaRespuesta } = data;
    res.json({
      message: "Usuario actualizado exitosamente",
      data: { usuario, ...dataParaRespuesta }
    });
  } catch (error) {
    // Manejo de llave foránea inválida
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({
        message: "El funcionario especificado no existe"
      });
    }
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message
    });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const { usuario } = req.params;
    const result = await Usuario.remove(usuario);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    res.json({
      message: "Usuario eliminado exitosamente"
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        message: "No se puede eliminar el usuario porque tiene registros asociados"
      });
    }
    res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error.message
    });
  }
};