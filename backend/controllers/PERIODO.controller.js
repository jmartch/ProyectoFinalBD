// controllers/PERIODO.controller.js
import Periodo from "../models/PERIODO.model.js";

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const getAllPeriodos = async (req, res) => {
  try {
    const periodos = await Periodo.getAll();
    res.json(periodos);
  } catch (error) {
    console.error("[PERIODO.controller] Error en getAllPeriodos:", error);
    res.status(500).json({
      message: "Error al obtener los periodos",
      error: error.sqlMessage || error.message,
    });
  }
};


export const getPeriodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const periodo = await Periodo.getById(id);

    if (!periodo) {
      return res.status(404).json({
        message: "Periodo no encontrado",
      });
    }

    res.json(periodo);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el periodo",
      error: error.message,
    });
  }
};

export const getActivePeriodos = async (req, res) => {
  try {
    const periodosActivos = await Periodo.getActive();
    res.json(periodosActivos);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los periodos activos",
      error: error.message,
    });
  }
};

export const createPeriodo = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, id_programa } = req.body;

    // Validación de campos obligatorios
    if (!fecha_inicio || !fecha_fin || !id_programa) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: fecha_inicio, fecha_fin, id_programa",
      });
    }

    // Validación formato fechas
    if (!FECHA_REGEX.test(fecha_inicio) || !FECHA_REGEX.test(fecha_fin)) {
      return res.status(400).json({
        message: "Formato de fecha inválido. Use YYYY-MM-DD",
      });
    }

    // Validar relación de fechas
    const fechaInicioDate = new Date(fecha_inicio);
    const fechaFinDate = new Date(fecha_fin);
    if (fechaInicioDate >= fechaFinDate) {
      return res.status(400).json({
        message: "La fecha de inicio debe ser anterior a la fecha de fin",
      });
    }

    // Validar que el programa exista
    const programaExiste = await Periodo.checkProgramaExists(id_programa);
    if (!programaExiste) {
      return res.status(400).json({
        message: "El programa especificado no existe",
      });
    }

    // Verificar solapamiento (si quieres que sea global)
    const hasOverlap = await Periodo.checkOverlap(fecha_inicio, fecha_fin);
    if (hasOverlap) {
      return res.status(409).json({
        message:
          "Ya existe un periodo que se solapa con las fechas especificadas",
      });
    }

    const result = await Periodo.create({
      fecha_inicio,
      fecha_fin,
      id_programa,
    });

    res.status(201).json({
      message: "Periodo creado exitosamente",
      data: {
        id_periodo: result.insertId,
        fecha_inicio,
        fecha_fin,
        id_programa,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el periodo",
      error: error.message,
    });
  }
};

export const updatePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin, id_programa } = req.body;

    if (!fecha_inicio || !fecha_fin || !id_programa) {
      return res.status(400).json({
        message:
          "Debe proporcionar fecha_inicio, fecha_fin e id_programa para actualizar",
      });
    }

    if (!FECHA_REGEX.test(fecha_inicio) || !FECHA_REGEX.test(fecha_fin)) {
      return res.status(400).json({
        message: "Formato de fecha inválido. Use YYYY-MM-DD",
      });
    }

    const fechaInicioDate = new Date(fecha_inicio);
    const fechaFinDate = new Date(fecha_fin);
    if (fechaInicioDate >= fechaFinDate) {
      return res.status(400).json({
        message: "La fecha de inicio debe ser anterior a la fecha de fin",
      });
    }

    // Validar que el programa exista
    const programaExiste = await Periodo.checkProgramaExists(id_programa);
    if (!programaExiste) {
      return res.status(400).json({
        message: "El programa especificado no existe",
      });
    }

    // Verificar solapamiento excluyendo este periodo
    const hasOverlap = await Periodo.checkOverlap(fecha_inicio, fecha_fin, id);
    if (hasOverlap) {
      return res.status(409).json({
        message:
          "Las fechas especificadas se solapan con otro periodo existente",
      });
    }

    const result = await Periodo.updateById(id, {
      fecha_inicio,
      fecha_fin,
      id_programa,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Periodo no encontrado",
      });
    }

    res.json({
      message: "Periodo actualizado exitosamente",
      data: { id_periodo: id, fecha_inicio, fecha_fin, id_programa },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el periodo",
      error: error.message,
    });
  }
};

export const deletePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Periodo.removeById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Periodo no encontrado",
      });
    }

    res.json({
      message: "Periodo eliminado exitosamente",
    });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "No se puede eliminar el periodo porque tiene registros asociados (semana, componente, etc.)",
      });
    }
    res.status(500).json({
      message: "Error al eliminar el periodo",
      error: error.message,
    });
  }
};
