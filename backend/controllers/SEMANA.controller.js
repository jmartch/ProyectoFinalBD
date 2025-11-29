// controllers/SEMANA.controller.js
import Semana from "../models/SEMANA.model.js";

export const getAllSemanas = async (req, res) => {
  try {
    const semanas = await Semana.getAll();
    res.json(semanas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las semanas",
      error: error.message,
    });
  }
};

export const getSemanaById = async (req, res) => {
  try {
    const { numero_semana } = req.params;
    const semana = await Semana.getById(numero_semana);

    if (!semana) {
      return res.status(404).json({
        message: "Semana no encontrada",
      });
    }

    res.json(semana);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la semana",
      error: error.message,
    });
  }
};

export const createSemana = async (req, res) => {
  try {
    const { id_periodo, fecha_inicio, fecha_fin } = req.body;

    // Validación de campos obligatorios
    if (!id_periodo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        message: "Faltan campos requeridos: id_periodo, fecha_inicio, fecha_fin",
      });
    }

    // Validación de formato de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_inicio) || !fechaRegex.test(fecha_fin)) {
      return res.status(400).json({
        message: "Formato de fecha inválido. Use YYYY-MM-DD",
      });
    }

    // Validar que fecha_inicio sea menor que fecha_fin
    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);
    if (inicio >= fin) {
      return res.status(400).json({
        message: "La fecha de inicio debe ser anterior a la fecha de fin",
      });
    }

    const result = await Semana.create({
      id_periodo,
      fecha_inicio,
      fecha_fin,
    });

    res.status(201).json({
      message: "Semana creada exitosamente",
      data: {
        numero_semana: result.insertId,
        id_periodo,
        fecha_inicio,
        fecha_fin,
      },
    });
  } catch (error) {
    // Manejo de llave foránea inválida (periodo no existe)
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({
        message: "El periodo especificado no existe",
      });
    }

    res.status(500).json({
      message: "Error al crear la semana",
      error: error.message,
    });
  }
};

export const updateSemana = async (req, res) => {
  try {
    const { numero_semana } = req.params;
    const { id_periodo, fecha_inicio, fecha_fin } = req.body;

    // Validación de campos obligatorios
    if (!id_periodo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        message: "Debe proporcionar id_periodo, fecha_inicio y fecha_fin para actualizar",
      });
    }

    // Validación de formato de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_inicio) || !fechaRegex.test(fecha_fin)) {
      return res.status(400).json({
        message: "Formato de fecha inválido. Use YYYY-MM-DD",
      });
    }

    // Validar que fecha_inicio sea menor que fecha_fin
    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);
    if (inicio >= fin) {
      return res.status(400).json({
        message: "La fecha de inicio debe ser anterior a la fecha de fin",
      });
    }

    const result = await Semana.updateById(numero_semana, {
      id_periodo,
      fecha_inicio,
      fecha_fin,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Semana no encontrada",
      });
    }

    res.json({
      message: "Semana actualizada exitosamente",
      data: {
        numero_semana,
        id_periodo,
        fecha_inicio,
        fecha_fin,
      },
    });
  } catch (error) {
    // Manejo de llave foránea inválida
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({
        message: "El periodo especificado no existe",
      });
    }

    res.status(500).json({
      message: "Error al actualizar la semana",
      error: error.message,
    });
  }
};

export const deleteSemana = async (req, res) => {
  try {
    const { numero_semana } = req.params;
    const result = await Semana.removeById(numero_semana);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Semana no encontrada",
      });
    }

    res.json({
      message: "Semana eliminada exitosamente",
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "No se puede eliminar la semana porque tiene registros asociados (registro_clases, etc.)",
      });
    }

    res.status(500).json({
      message: "Error al eliminar la semana",
      error: error.message,
    });
  }
};
