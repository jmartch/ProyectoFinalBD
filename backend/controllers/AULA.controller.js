// backend/controllers/AULA.controller.js
import AULA from "../models/AULA.model.js";

// GET /api/aulas
export const getAllAulas = async (req, res) => {
  try {
    const aulas = await AULA.getAll();
    res.json(aulas);
  } catch (error) {
    console.error("[AULA] Error al obtener las aulas:", error);
    res.status(500).json({
      message: "Error al obtener las aulas",
      error: error.message,
    });
  }
};

// GET /api/aulas/:id
export const getAulaById = async (req, res) => {
  try {
    const { id } = req.params;
    const aula = await AULA.getById(id);

    if (!aula) {
      return res.status(404).json({
        message: "Aula no encontrada",
      });
    }

    res.json(aula);
  } catch (error) {
    console.error("[AULA] Error al obtener el aula:", error);
    res.status(500).json({
      message: "Error al obtener el aula",
      error: error.message,
    });
  }
};

// POST /api/aulas
export const createAula = async (req, res) => {
  try {
    const { id_sede, id_programa, grado } = req.body;

    if (!id_sede || !id_programa || !grado) {
      return res.status(400).json({
        message: "Faltan campos requeridos: id_sede, id_programa, grado",
      });
    }

    const result = await AULA.create({ id_sede, id_programa, grado });

    res.status(201).json({
      message: "Aula creada exitosamente",
      data: {
        id_aula: result.insertId,
        id_sede,
        id_programa,
        grado,
      },
    });
  } catch (error) {
    console.error("[AULA] Error al crear el aula:", error);

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        message: "La sede o el programa especificado no existe",
      });
    }

    res.status(500).json({
      message: "Error al crear el aula",
      error: error.message,
    });
  }
};

// PUT /api/aulas/:id
export const updateAula = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_sede, id_programa, grado } = req.body;

    if (!id_sede || !id_programa || !grado) {
      return res.status(400).json({
        message: "Faltan campos requeridos: id_sede, id_programa, grado",
      });
    }

    const result = await AULA.update(id, { id_sede, id_programa, grado });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Aula no encontrada",
      });
    }

    res.json({
      message: "Aula actualizada exitosamente",
      data: {
        id_aula: id,
        id_sede,
        id_programa,
        grado,
      },
    });
  } catch (error) {
    console.error("[AULA] Error al actualizar el aula:", error);

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        message: "La sede o el programa especificado no existe",
      });
    }

    res.status(500).json({
      message: "Error al actualizar el aula",
      error: error.message,
    });
  }
};

// DELETE /api/aulas/:id
export const deleteAula = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await AULA.remove(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Aula no encontrada",
      });
    }

    res.json({
      message: "Aula eliminada exitosamente",
    });
  } catch (error) {
    console.error("[AULA] Error al eliminar el aula:", error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "No se puede eliminar el aula porque tiene registros asociados",
      });
    }

    res.status(500).json({
      message: "Error al eliminar el aula",
      error: error.message,
    });
  }
};
