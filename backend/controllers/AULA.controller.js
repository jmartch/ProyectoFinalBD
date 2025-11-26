// controllers/aula.controller.js
import AULA from "../models/AULA.model.js";

export const getAllAulas = async (req, res) => {
  try {
    const aulas = await AULA.getAll();
    res.json(aulas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las aulas",
      error: error.message,
    });
  }
};

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
    res.status(500).json({
      message: "Error al obtener el aula",
      error: error.message,
    });
  }
};

export const createAula = async (req, res) => {
  try {
    const { id_sede, id_programa, grado } = req.body;

    // Validación básica
    if (!id_sede || !id_programa || !grado) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: id_sede, id_programa, grado",
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
    // Manejo de errores de llave foránea
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        message:
          "La sede o el programa especificado no existe",
      });
    }
    res.status(500).json({
      message: "Error al crear el aula",
      error: error.message,
    });
  }
};

export const updateAula = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_sede, id_programa, grado } = req.body;

    // Validación básica
    if (!id_sede || !id_programa || !grado) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: id_sede, id_programa, grado",
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
    // Manejo de errores de llave foránea
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        message:
          "La sede o el programa especificado no existe",
      });
    }
    res.status(500).json({
      message: "Error al actualizar el aula",
      error: error.message,
    });
  }
};

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
    // Manejo de restricciones de llave foránea al eliminar
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
