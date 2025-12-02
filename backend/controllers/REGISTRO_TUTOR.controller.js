// backend/controllers/REGISTRO_TUTOR.controller.js
import RegistroTutor from "../models/REGISTRO_TUTOR.model.js";

export const getAllRegistroTutor = async (req, res) => {
  try {
    const rows = await RegistroTutor.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener registros de tutor",
      error: error.message,
    });
  }
};

export const createRegistroTutor = async (req, res) => {
  try {
    const { doc_funcionario, id_tutor, fecha_asignacion } = req.body;

    if (!doc_funcionario || !id_tutor || !fecha_asignacion) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: doc_funcionario, id_tutor, fecha_asignacion",
      });
    }

    const data = await RegistroTutor.create({
      doc_funcionario,
      id_tutor,
      fecha_asignacion,
    });

    res.status(201).json({
      message: "Registro de tutor creado correctamente",
      data,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message:
          "Ya existe un registro para este tutor y funcionario en esa fecha",
      });
    }

    res.status(500).json({
      message: "Error al registrar tutor",
      error: error.message,
    });
  }
};
