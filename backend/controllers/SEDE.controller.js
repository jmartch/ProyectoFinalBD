// backend/controllers/SEDE.controller.js
import Sede from "../models/SEDE.model.js";

export const getSedes = async (req, res) => {
  try {
    const { iedId } = req.query;

    if (!iedId) {
      return res.status(400).json({
        message: "El parámetro 'iedId' es obligatorio",
      });
    }

    const sedes = await Sede.getByIED(iedId);
    res.json(sedes);
  } catch (error) {
    console.error("[SEDE] Error al obtener sedes:", error);
    res.status(500).json({
      message: "Error al obtener las sedes",
      error: error.message,
    });
  }
};

export const createSede = async (req, res) => {
  try {
    const { id_ied, direccion, tipo } = req.body;

    if (!id_ied || !direccion || !tipo) {
      return res.status(400).json({
        message: "Faltan campos requeridos: id_ied, direccion, tipo",
      });
    }

    if (direccion.length > 50) {
      return res.status(400).json({
        message: "La dirección no puede exceder 50 caracteres",
      });
    }

    if (tipo.length > 50) {
      return res.status(400).json({
        message: "El tipo no puede exceder 50 caracteres",
      });
    }

    const result = await Sede.create({ id_ied, direccion, tipo });

    res.status(201).json({
      message: "Sede creada exitosamente",
      data: {
        id_sede: result.insertId,
        id_ied,
        direccion,
        tipo,
      },
    });
  } catch (error) {
    console.error("[SEDE] Error al crear sede:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Ya existe una sede con esa dirección",
      });
    }
    res.status(500).json({
      message: "Error al crear la sede",
      error: error.message,
    });
  }
};

export const updateSede = async (req, res) => {
  try {
    const { id } = req.params;
    const { direccion, tipo } = req.body;

    if (!direccion || !tipo) {
      return res.status(400).json({
        message: "Faltan campos requeridos: direccion, tipo",
      });
    }

    const result = await Sede.update(id, { direccion, tipo });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sede no encontrada" });
    }

    res.json({
      message: "Sede actualizada exitosamente",
      data: { id_sede: id, direccion, tipo },
    });
  } catch (error) {
    console.error("[SEDE] Error al actualizar sede:", error);
    res.status(500).json({
      message: "Error al actualizar la sede",
      error: error.message,
    });
  }
};

export const deleteSede = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Sede.remove(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sede no encontrada" });
    }

    res.json({ message: "Sede eliminada exitosamente" });
  } catch (error) {
    console.error("[SEDE] Error al eliminar sede:", error);
    res.status(500).json({
      message: "Error al eliminar la sede",
      error: error.message,
    });
  }
};
