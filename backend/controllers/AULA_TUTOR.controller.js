// backend/controllers/AULA_TUTOR.controller.js
import AulaTutor from "../models/AULA_TUTOR.model.js";

export const getAllAulaTutor = async (req, res) => {
  try {
    const rows = await AulaTutor.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las asignaciones aula-tutor",
      error: error.message,
    });
  }
};

export const createAulaTutor = async (req, res) => {
  try {
    const { id_aula, id_tutor, fecha_asignacion, fecha_fin } = req.body;

    if (!id_aula || !id_tutor || !fecha_asignacion) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: id_aula, id_tutor, fecha_asignacion",
      });
    }

    const data = await AulaTutor.create({
      id_aula,
      id_tutor,
      fecha_asignacion,
      fecha_fin: fecha_fin || null,
    });

    res.status(201).json({
      message: "Aula asignada al tutor correctamente",
      data,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message:
          "Ya existe una asignación de este tutor a esa aula en esa fecha",
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        message:
          "No se encontró el aula o el tutor especificado (revisa los IDs)",
      });
    }

    res.status(500).json({
      message: "Error al asignar aula al tutor",
      error: error.message,
    });
  }
};
