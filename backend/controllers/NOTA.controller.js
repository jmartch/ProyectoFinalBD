// controllers/NOTA.controller.js
import Nota from "../models/NOTA.model.js";

export const getAllNotas = async (req, res) => {
  try {
    const notas = await Nota.getAll();
    res.json(notas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las notas",
      error: error.message
    });
  }
};

export const getNotaById = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await Nota.getById(id);

    if (!nota) {
      return res.status(404).json({
        message: "Nota no encontrada"
      });
    }

    res.json(nota);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la nota",
      error: error.message
    });
  }
};

export const createNota = async (req, res) => {
  try {
    const { doc_estudiante, definitiva } = req.body;

    // Validación de campos obligatorios
    if (!doc_estudiante || definitiva === undefined || definitiva === null) {
      return res.status(400).json({
        message: "Faltan campos requeridos: doc_estudiante, definitiva"
      });
    }

    // Validación de doc_estudiante (numérico)
    if (isNaN(doc_estudiante)) {
      return res.status(400).json({
        message: "El documento del estudiante debe ser numérico"
      });
    }

    // Validación de nota definitiva (0.0 - 5.0)
    const notaNum = parseFloat(definitiva);
    if (isNaN(notaNum) || notaNum < 0.0 || notaNum > 5.0) {
      return res.status(400).json({
        message: "La nota definitiva debe ser un número entre 0.0 y 5.0"
      });
    }

    const result = await Nota.create({
      doc_estudiante,
      definitiva: notaNum
    });

    res.status(201).json({
      message: "Nota creada exitosamente",
      data: {
        id_nota: result.insertId,
        doc_estudiante,
        definitiva: notaNum
      }
    });
  } catch (error) {
    // Manejo de llave foránea inválida (estudiante no existe)
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({
        message: "El estudiante especificado no existe"
      });
    }
    res.status(500).json({
      message: "Error al crear la nota",
      error: error.message
    });
  }
};

export const updateNota = async (req, res) => {
  try {
    const { id } = req.params;
    const { doc_estudiante, definitiva } = req.body;

    // Update completo (igual que en otros controladores)
    if (!doc_estudiante || definitiva === undefined || definitiva === null) {
      return res.status(400).json({
        message: "Faltan campos requeridos: doc_estudiante, definitiva"
      });
    }

    // Validación de doc_estudiante
    if (isNaN(doc_estudiante)) {
      return res.status(400).json({
        message: "El documento del estudiante debe ser numérico"
      });
    }

    // Validación de nota definitiva (0.0 - 5.0)
    const notaNum = parseFloat(definitiva);
    if (isNaN(notaNum) || notaNum < 0.0 || notaNum > 5.0) {
      return res.status(400).json({
        message: "La nota definitiva debe ser un número entre 0.0 y 5.0"
      });
    }

    const result = await Nota.updateById(id, {
      doc_estudiante,
      definitiva: notaNum
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Nota no encontrada"
      });
    }

    res.json({
      message: "Nota actualizada exitosamente",
      data: { id_nota: id, doc_estudiante, definitiva: notaNum }
    });
  } catch (error) {
    // Manejo de llave foránea inválida
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({
        message: "El estudiante especificado no existe"
      });
    }
    res.status(500).json({
      message: "Error al actualizar la nota",
      error: error.message
    });
  }
};

export const deleteNota = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Nota.removeById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Nota no encontrada"
      });
    }

    res.json({
      message: "Nota eliminada exitosamente"
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "No se puede eliminar la nota porque tiene registros asociados (detalle_nota, etc.)"
      });
    }
    res.status(500).json({
      message: "Error al eliminar la nota",
      error: error.message
    });
  }
};
