// backend/controllers/SEDE.controller.js
import SEDE from "../models/SEDE.model.js";

// GET /api/sedes
export const getAllSedes = async (req, res) => {
  try {
    const sedes = await SEDE.getAll();
    res.json(sedes);
  } catch (error) {
    console.error("[SEDE] Error al obtener las sedes:", error);
    res.status(500).json({
      message: "Error al obtener las sedes",
      error: error.message,
    });
  }
};

// GET /api/sedes/:id
export const getSedeById = async (req, res) => {
  try {
    const { id } = req.params;
    const sede = await SEDE.getById(id);

    if (!sede) {
      return res.status(404).json({ message: "Sede no encontrada" });
    }

    res.json(sede);
  } catch (error) {
    console.error("[SEDE] Error al obtener la sede:", error);
    res.status(500).json({
      message: "Error al obtener la sede",
      error: error.message,
    });
  }
};

// POST /api/sedes
export const createSede = async (req, res) => {
  try {
    const { id_ied, direccion, tipo } = req.body;

    if (!id_ied || !direccion || !tipo) {
      return res.status(400).json({
        message: "Faltan campos requeridos: id_ied, direccion, tipo",
      });
    }

    const result = await SEDE.create({ id_ied, direccion, tipo });

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
    console.error("[SEDE] Error al crear la sede:", error);

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        message: "La IED especificada no existe",
      });
    }

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

// PUT /api/sedes/:id
export const updateSede = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_ied, direccion, tipo } = req.body;

    if (!id_ied || !direccion || !tipo) {
      return res.status(400).json({
        message: "Faltan campos requeridos: id_ied, direccion, tipo",
      });
    }

    const result = await SEDE.update(id, { id_ied, direccion, tipo });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sede no encontrada" });
    }

    res.json({
      message: "Sede actualizada exitosamente",
      data: {
        id_sede: id,
        id_ied,
        direccion,
        tipo,
      },
    });
  } catch (error) {
    console.error("[SEDE] Error al actualizar la sede:", error);

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        message: "La IED especificada no existe",
      });
    }

    res.status(500).json({
      message: "Error al actualizar la sede",
      error: error.message,
    });
  }
};

// DELETE /api/sedes/:id
export const deleteSede = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SEDE.remove(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sede no encontrada" });
    }

    res.json({ message: "Sede eliminada exitosamente" });
  } catch (error) {
    console.error("[SEDE] Error al eliminar la sede:", error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "No se puede eliminar la sede porque tiene aulas u otros registros asociados",
      });
    }

    res.status(500).json({
      message: "Error al eliminar la sede",
      error: error.message,
    });
  }
};
