// controllers/MOTIVO.controller.js
import Motivo from "../models/MOTIVO.model.js";

export const getAllMotivos = async (req, res) => {
  try {
    const motivos = await Motivo.getAll();
    res.json(motivos);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los motivos",
      error: error.message
    });
  }
};

export const getMotivoById = async (req, res) => {
  try {
    const { codigo } = req.params;
    const motivo = await Motivo.getById(codigo);

    if (!motivo) {
      return res.status(404).json({
        message: "Motivo no encontrado"
      });
    }

    res.json(motivo);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el motivo",
      error: error.message
    });
  }
};

export const createMotivo = async (req, res) => {
  try {
    const { descripcion } = req.body;

    // Solo descripcion es requerida (codigo es AUTO_INCREMENT)
    if (!descripcion) {
      return res.status(400).json({
        message: "Falta campo requerido: descripcion"
      });
    }

    // Longitud de descripción (según BD: varchar(100))
    if (descripcion.length > 100) {
      return res.status(400).json({
        message: "La descripción no puede exceder 100 caracteres"
      });
    }

    const result = await Motivo.create({ descripcion });

    res.status(201).json({
      message: "Motivo creado exitosamente",
      data: {
        codigo: result.insertId,
        descripcion
      }
    });
  } catch (error) {
    // Por si luego pones UNIQUE en descripcion
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Ya existe un motivo con esa descripción"
      });
    }
    res.status(500).json({
      message: "Error al crear el motivo",
      error: error.message
    });
  }
};

export const updateMotivo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { descripcion } = req.body;

    // Validar que haya datos para actualizar
    if (!descripcion) {
      return res.status(400).json({
        message: "Debe proporcionar la descripción para actualizar"
      });
    }

    // Longitud de descripción
    if (descripcion.length > 100) {
      return res.status(400).json({
        message: "La descripción no puede exceder 100 caracteres"
      });
    }

    const result = await Motivo.updateById(codigo, { descripcion });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Motivo no encontrado"
      });
    }

    res.json({
      message: "Motivo actualizado exitosamente",
      data: { codigo, descripcion }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el motivo",
      error: error.message
    });
  }
};

export const deleteMotivo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const result = await Motivo.removeById(codigo);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Motivo no encontrado"
      });
    }

    res.json({
      message: "Motivo eliminado exitosamente"
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "No se puede eliminar el motivo porque tiene registros asociados"
      });
    }
    res.status(500).json({
      message: "Error al eliminar el motivo",
      error: error.message
    });
  }
};
