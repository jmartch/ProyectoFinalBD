// controllers/ASIGNACION_AULA_HORARIO.controller.js
import Asignacion_aula_horario from "../models/ASIGNACION_AULA_HORARIO.model.js";

export const getAllAsignaciones = async (req, res) => {
  try {
    const asignaciones = await Asignacion_aula_horario.getAll();
    res.json(asignaciones);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener las asignaciones", 
      error: error.message 
    });
  }
};

export const getAsignacionByKeys = async (req, res) => {
  try {
    const { id_horario, id_aula, fecha_inicio } = req.params;
    const asignacion = await Asignacion_aula_horario.getByKeys(id_horario, id_aula, fecha_inicio);
    
    if (!asignacion) {
      return res.status(404).json({ 
        message: "Asignación no encontrada" 
      });
    }
    
    res.json(asignacion);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener la asignación", 
      error: error.message 
    });
  }
};

export const createAsignacion = async (req, res) => {
  try {
    const { id_horario, id_aula, fecha_inicio, fecha_fin } = req.body;
    
    // Validación de campos obligatorios
    if (!id_horario || !id_aula || !fecha_inicio) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: id_horario, id_aula, fecha_inicio" 
      });
    }

    // Validación de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_inicio) || (!fechaRegex.test(fecha_fin))) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }

    // Validar que la fecha no sea futura
    const fechaAsignacion = new Date(fecha_inicio);
    const hoy = new Date();
    if (fechaAsignacion > hoy) {
      return res.status(400).json({ 
        message: "La fecha de asignación no puede ser futura" 
      });
    }
    
    const result = await Asignacion_aula_horario.create({ 
      id_horario, 
      id_aula, 
      fecha_inicio,
      fecha_fin 
    });
    
    res.status(201).json({ 
      message: "Asignación creada exitosamente",
      data: { 
        id_horario, 
        id_aula, 
        fecha_inicio,
        fecha_fin
      }
    });
  } catch (error) {
    // Manejo de asignación duplicada
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: "Ya existe una asignación para este horario en este aula" 
      });
    }
    // Manejo de llave foránea inválida
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ 
        message: "El aula o el horario especificado no existe" 
      });
    }
    res.status(500).json({ 
      message: "Error al crear la asignación", 
      error: error.message 
    });
  }
};

export const updateAsignacionByKeys = async (req, res) => {
  try {
    const { id_horario, id_aula, fecha_inicio } = req.params;
    const { fecha_fin } = req.body;
    
    // Validar que haya datos para actualizar
    if (!fecha_fin) {
      return res.status(400).json({ 
        message: "Debe proporcionar la fecha para actualizar" 
      });
    }

    // Validación de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_fin)) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }

    // Validar que la fecha no sea futura
    const fechaAsignacion = new Date(fecha_fin);
    const hoy = new Date();
    if (fechaAsignacion > hoy) {
      return res.status(400).json({ 
        message: "La fecha de asignación no puede ser futura" 
      });
    }
    
    const result = await Asignacion_aula_horario.updateByKeys(id_horario, id_aula, fecha_inicio, { fecha_fin });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Asignación no encontrada" 
      });
    }
    
    res.json({ 
      message: "Asignación actualizada exitosamente",
      data: { id_horario, id_aula, fecha_inicio, fecha_fin }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar la asignación", 
      error: error.message 
    });
  }
};

export const deleteAsignacionByKeys = async (req, res) => {
  try {
    const { id_horario, id_aula, fecha_inicio } = req.params;
    const result = await Asignacion_aula_horario.removeByKeys(id_horario, id_aula, fecha_inicio);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Asignación no encontrada" 
      });
    }
    
    res.json({ 
      message: "Asignación eliminada exitosamente" 
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: "No se puede eliminar la asignación porque tiene registros asociados" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar la asignación", 
      error: error.message 
    });
  }
};