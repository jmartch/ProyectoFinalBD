// controllers/AULA_TUTOR.controller.js
import Vinculacion from "../models/AULA_TUTOR.model.js";

export const getAllVinculaciones = async (req, res) => {
  try {
    const vinculaciones = await Vinculacion.getAll();
    res.json(vinculaciones);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener las vinculaciones", 
      error: error.message 
    });
  }
};

export const getVinculacionByKeys = async (req, res) => {
  try {
    const { id_aula, id_tutor, fecha_asignacion } = req.params;
    const vinculacion = await Vinculacion.getByKeys(id_aula, id_tutor, fecha_asignacion);
    
    if (!vinculacion) {
      return res.status(404).json({ 
        message: "Vinculación no encontrada" 
      });
    }
    
    res.json(vinculacion);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener la vinculación", 
      error: error.message 
    });
  }
};

export const createVinculacion = async (req, res) => {
  try {
    const { id_aula, id_tutor, fecha_asignacion, fecha_fin } = req.body;
    
    // Validación de campos obligatorios
    if (!id_aula || !id_tutor || !fecha_asignacion) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: id_aula, id_tutor, fecha_asignacion" 
      });
    }

    // Validación de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_asignacion) || (fecha_fin && !fechaRegex.test(fecha_fin))) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }

    // Validar que la fecha no sea futura
    const fechaVinculacion = new Date(fecha_asignacion);
    const hoy = new Date();
    if (fechaVinculacion > hoy) {
      return res.status(400).json({ 
        message: "La fecha de vinculación no puede ser futura" 
      });
    }
    
    const result = await Vinculacion.create({ 
      id_aula, 
      id_tutor, 
      fecha_asignacion,
      fecha_fin 
    });
    
    res.status(201).json({ 
      message: "Vinculación creada exitosamente",
      data: { 
        id_aula, 
        id_tutor, 
        fecha_asignacion,
        fecha_fin
      }
    });
  } catch (error) {
    // Manejo de vinculación duplicada
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: "Ya existe una vinculación para este tutor en este aula" 
      });
    }
    // Manejo de llave foránea inválida
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ 
        message: "El aula o el tutor especificado no existe" 
      });
    }
    res.status(500).json({ 
      message: "Error al crear la vinculación", 
      error: error.message 
    });
  }
};

export const updateVinculacionByKeys = async (req, res) => {
  try {
    const { id_aula, id_tutor, fecha_asignacion } = req.params;
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
    const fechaVinculacion = new Date(fecha_fin);
    const hoy = new Date();
    if (fechaVinculacion > hoy) {
      return res.status(400).json({ 
        message: "La fecha de vinculación no puede ser futura" 
      });
    }
    
    const result = await Vinculacion.updateByKeys(id_aula, id_tutor, fecha_asignacion, { fecha_fin });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Vinculación no encontrada" 
      });
    }
    
    res.json({ 
      message: "Vinculación actualizada exitosamente",
      data: { id_aula, id_tutor, fecha_asignacion, fecha_fin }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar la vinculación", 
      error: error.message 
    });
  }
};

export const deleteVinculacionByKeys = async (req, res) => {
  try {
    const { id_aula, id_tutor, fecha_asignacion } = req.params;
    const result = await Vinculacion.removeByKeys(id_aula, id_tutor, fecha_asignacion);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Vinculación no encontrada" 
      });
    }
    
    res.json({ 
      message: "Vinculación eliminada exitosamente" 
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: "No se puede eliminar la vinculación porque tiene registros asociados" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar la vinculación", 
      error: error.message 
    });
  }
};