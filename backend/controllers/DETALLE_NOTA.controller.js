// controllers/detalleNota.controller.js
import DETALLE_NOTA from "../models/DETALLE_NOTA.model.js";

export const getAllDetallesNota = async (req, res) => {
  try {
    const detalles = await DETALLE_NOTA.getAll();
    res.json(detalles);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los detalles de nota",
      error: error.message,
    });
  }
};

export const getDetalleNotaByKeys = async (req, res) => {
  try {
    const { id_nota, id_componente } = req.params;
    const detalle = await DETALLE_NOTA.getByKeys(id_nota, id_componente);

    if (!detalle) {
      return res.status(404).json({
        message: "Detalle de nota no encontrado",
      });
    }

    res.json(detalle);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el detalle de nota",
      error: error.message,
    });
  }
};

export const createDetalleNota = async (req, res) => {
  try {
    const { id_nota, id_componente, nota } = req.body;

    // Validación básica
    if (!id_nota || !id_componente || nota === undefined) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: id_nota, id_componente, nota",
      });
    }

    // Validación de nota (0 a 5; ajusta si usas otra escala)
    if (nota < 0 || nota > 5) {
      return res.status(400).json({
        message: "La nota debe estar entre 0 y 5",
      });
    }

    const result = await DETALLE_NOTA.create({
      id_nota,
      id_componente,
      nota,
    });

    res.status(201).json({
      message: "Detalle de nota creado exitosamente",
      data: { id_nota, id_componente, nota },
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    // Manejo de duplicados (PK compuesta)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message:
          "Ya existe un detalle de nota para este componente en esta nota",
      });
    }
    // Manejo de errores de llave foránea
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        message: "La nota o el componente especificado no existe",
      });
    }
    res.status(500).json({
      message: "Error al crear el detalle de nota",
      error: error.message,
    });
  }
};

export const updateDetalleNota = async (req, res) => {
  try {
    const { id_nota, id_componente } = req.params;
    const { nota } = req.body;

    if (nota === undefined) {
      return res.status(400).json({
        message: "El campo 'nota' es requerido",
      });
    }

    // Validación de nota
    if (nota < 0 || nota > 5) {
      return res.status(400).json({
        message: "La nota debe estar entre 0 y 5",
      });
    }

    const result = await DETALLE_NOTA.updateByKeys(id_nota, id_componente, {
      nota,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Detalle de nota no encontrado",
      });
    }

    res.json({
      message: "Detalle de nota actualizado exitosamente",
      data: { id_nota, id_componente, nota },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el detalle de nota",
      error: error.message,
    });
  }
};

export const deleteDetalleNota = async (req, res) => {
  try {
    const { id_nota, id_componente } = req.params;
    const result = await DETALLE_NOTA.removeByKeys(
      id_nota,
      id_componente
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Detalle de nota no encontrado",
      });
    }

    res.json({
      message: "Detalle de nota eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el detalle de nota",
      error: error.message,
    });
  }
};
