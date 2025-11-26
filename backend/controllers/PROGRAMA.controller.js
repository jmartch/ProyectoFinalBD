// controllers/PROGRAMA.controller.js
import Programa from "../models/PROGRAMA.model.js";

export const getAllProgramas = async (req, res) => {
  try {
    const programas = await Programa.getAll();
    res.json(programas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los programas",
      error: error.message
    });
  }
};

export const getProgramaById = async (req, res) => {
  try {
    const { id_programa } = req.params;
    const programa = await Programa.getById(id_programa);

    if (!programa) {
      return res.status(404).json({
        message: "Programa no encontrado"
      });
    }

    res.json(programa);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el programa",
      error: error.message
    });
  }
};

export const createPrograma = async (req, res) => {
  try {
    const { nombre_programa } = req.body;

    // Validación de campo obligatorio
    if (!nombre_programa) {
      return res.status(400).json({
        message: "Falta el campo requerido: nombre_programa"
      });
    }

    // Validación de longitud de nombre_programa (VARCHAR(50))
    if (nombre_programa.length > 50) {
      return res.status(400).json({
        message: "El nombre del programa no puede exceder 50 caracteres"
      });
    }

    const result = await Programa.create({
      nombre_programa
    });

    res.status(201).json({
      message: "Programa creado exitosamente",
      data: {
        id_programa: result.insertId,
        nombre_programa
      }
    });
  } catch (error) {
    // Manejo de duplicado (si en algún momento le pones UNIQUE al nombre)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "El programa ya existe"
      });
    }
    res.status(500).json({
      message: "Error al crear el programa",
      error: error.message
    });
  }
};

export const updatePrograma = async (req, res) => {
  try {
    const { id_programa } = req.params;
    const { nombre_programa } = req.body;

    // Validar que haya datos para actualizar
    if (!nombre_programa) {
      return res.status(400).json({
        message: "Debe proporcionar el nombre del programa para actualizar"
      });
    }

    // Validación de longitud de nombre_programa
    if (nombre_programa.length > 50) {
      return res.status(400).json({
        message: "El nombre del programa no puede exceder 50 caracteres"
      });
    }

    const result = await Programa.update(id_programa, { nombre_programa });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Programa no encontrado"
      });
    }

    res.json({
      message: "Programa actualizado exitosamente",
      data: {
        id_programa,
        nombre_programa
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el programa",
      error: error.message
    });
  }
};

export const deletePrograma = async (req, res) => {
  try {
    const { id_programa } = req.params;
    const result = await Programa.remove(id_programa);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Programa no encontrado"
      });
    }

    res.json({
      message: "Programa eliminado exitosamente"
    });
  } catch (error) {
    // Manejo de restricciones de clave foránea al eliminar
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "No se puede eliminar el programa porque está asociado a otros registros (aulas, etc.)"
      });
    }

    res.status(500).json({
      message: "Error al eliminar el programa",
      error: error.message
    });
  }
};
