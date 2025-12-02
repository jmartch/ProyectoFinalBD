// backend/controllers/PROGRAMA.controller.js
import Programa from "../models/PROGRAMA.model.js";

export const getAllProgramas = async (req, res) => {
  try {
    const programas = await Programa.getAll();
    res.json(programas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los programas",
      error: error.message,
    });
  }
};

export const getProgramaById = async (req, res) => {
  try {
    const { id } = req.params;
    const programa = await Programa.getById(id);

    if (!programa) {
      return res.status(404).json({ message: "Programa no encontrado" });
    }

    res.json(programa);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el programa",
      error: error.message,
    });
  }
};

export const createPrograma = async (req, res) => {
  try {
    const { nombre_programa } = req.body;

    if (!nombre_programa) {
      return res.status(400).json({
        message: "Falta el campo requerido: nombre_programa",
      });
    }

    const result = await Programa.create({ nombre_programa });

    res.status(201).json({
      message: "Programa creado exitosamente",
      data: {
        id_programa: result.insertId,
        nombre_programa,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el programa",
      error: error.message,
    });
  }
};

export const updatePrograma = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_programa } = req.body;

    if (!nombre_programa) {
      return res.status(400).json({
        message: "Falta el campo requerido: nombre_programa",
      });
    }

    const result = await Programa.update(id, { nombre_programa });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Programa no encontrado" });
    }

    res.json({
      message: "Programa actualizado exitosamente",
      data: {
        id_programa: id,
        nombre_programa,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el programa",
      error: error.message,
    });
  }
};

export const deletePrograma = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Programa.remove(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Programa no encontrado" });
    }

    res.json({ message: "Programa eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el programa",
      error: error.message,
    });
  }
};
