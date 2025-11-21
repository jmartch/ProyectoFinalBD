// controllers/asistencia.controller.js
import ASISTENCIA from "../models/ASISTENCIA.model.js";

export const getAllAsistencias = async (req, res) => {
  try {
    const asistencias = await ASISTENCIA.getAll();
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener las asistencias", 
      error: error.message 
    });
  }
};

export const getAsistenciaByKeys = async (req, res) => {
  try {
    const { num_registro, doc_estudiante } = req.params;
    const asistencia = await ASISTENCIA.getByKeys(num_registro, doc_estudiante);
    
    if (!asistencia) {
      return res.status(404).json({ 
        message: "Asistencia no encontrada" 
      });
    }
    
    res.json(asistencia);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener la asistencia", 
      error: error.message 
    });
  }
};

export const createAsistencia = async (req, res) => {
  try {
    const { num_registro, doc_estudiante, asisto } = req.body;
    
    // Validación básica
    if (!num_registro || !doc_estudiante || asisto === undefined) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: num_registro, doc_estudiante, asisto" 
      });
    }
    
    const result = await ASISTENCIA.create({ num_registro, doc_estudiante, asisto });
    res.status(201).json({ 
      message: "Asistencia creada exitosamente",
      data: { num_registro, doc_estudiante, asisto }
    });
  } catch (error) {
    // Manejo de duplicados (llave primaria compuesta)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: "Ya existe un registro de asistencia para este estudiante en este registro" 
      });
    }
    res.status(500).json({ 
      message: "Error al crear la asistencia", 
      error: error.message 
    });
  }
};

export const updateAsistencia = async (req, res) => {
  try {
    const { num_registro, doc_estudiante } = req.params;
    const { asisto } = req.body;
    
    if (asisto === undefined) {
      return res.status(400).json({ 
        message: "El campo 'asisto' es requerido" 
      });
    }
    
    const result = await ASISTENCIA.updateByKeys(num_registro, doc_estudiante, { asisto });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Asistencia no encontrada" 
      });
    }
    
    res.json({ 
      message: "Asistencia actualizada exitosamente",
      data: { num_registro, doc_estudiante, asisto }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar la asistencia", 
      error: error.message 
    });
  }
};

export const deleteAsistencia = async (req, res) => {
  try {
    const { num_registro, doc_estudiante } = req.params;
    const result = await ASISTENCIA.removeByKeys(num_registro, doc_estudiante);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Asistencia no encontrada" 
      });
    }
    
    res.json({ 
      message: "Asistencia eliminada exitosamente" 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al eliminar la asistencia", 
      error: error.message 
    });
  }
};