// controllers/MATRICULA.controller.js
import Matricula from "../models/MATRICULA.model.js";

export const getAllMatriculas = async (req, res) => {
  try {
    const matriculas = await Matricula.getAll();
    res.json(matriculas);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener las matrículas", 
      error: error.message 
    });
  }
};

export const getMatriculaByKeys = async (req, res) => {
  try {
    const { id_aula, doc_estudiante, fecha_inicio } = req.params;
    const matricula = await Matricula.getByKeys(id_aula, doc_estudiante, fecha_inicio);
    
    if (!matricula) {
      return res.status(404).json({ 
        message: "Matrícula no encontrada" 
      });
    }
    
    res.json(matricula);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener la matrícula", 
      error: error.message 
    });
  }
};

export const createMatricula = async (req, res) => {
  try {
    const { id_aula, doc_estudiante, fecha_inicio, fecha_fin } = req.body;
    
    // Validación de campos obligatorios
    if (!id_aula || !doc_estudiante || !fecha_inicio) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: id_aula, doc_estudiante, fecha_inicio" 
      });
    }

    // Validación de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_inicio) || (fecha_fin && !fechaRegex.test(fecha_fin))) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }

    // Validar que la fecha no sea futura
    const fechaMatricula = new Date(fecha_inicio);
    const hoy = new Date();
    if (fechaMatricula > hoy) {
      return res.status(400).json({ 
        message: "La fecha de matrícula no puede ser futura" 
      });
    }
    
    const result = await Matricula.create({ 
      id_aula, 
      doc_estudiante, 
      fecha_inicio,
      fecha_fin 
    });
    
    res.status(201).json({ 
      message: "Matrícula creada exitosamente",
      data: { 
        id_aula, 
        doc_estudiante, 
        fecha_inicio,
        fecha_fin
      }
    });
  } catch (error) {
    // Manejo de matrícula duplicada
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: "Ya existe una matrícula para este estudiante en este aula" 
      });
    }
    // Manejo de llave foránea inválida
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ 
        message: "El aula o el estudiante especificado no existe" 
      });
    }
    res.status(500).json({ 
      message: "Error al crear la matrícula", 
      error: error.message 
    });
  }
};

export const updateMatriculaByKeys = async (req, res) => {
  try {
    const { id_aula, doc_estudiante, fecha_inicio } = req.params;
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
    const fechaMatricula = new Date(fecha_fin);
    const hoy = new Date();
    if (fechaMatricula > hoy) {
      return res.status(400).json({ 
        message: "La fecha de matrícula no puede ser futura" 
      });
    }
    
    const result = await Matricula.updateByKeys(id_aula, doc_estudiante, fecha_inicio, { fecha_fin });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Matrícula no encontrada" 
      });
    }
    
    res.json({ 
      message: "Matrícula actualizada exitosamente",
      data: { id_aula, doc_estudiante, fecha_inicio, fecha_fin }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar la matrícula", 
      error: error.message 
    });
  }
};

export const deleteMatriculaByKeys = async (req, res) => {
  try {
    const { id_aula, doc_estudiante, fecha_inicio } = req.params;
    const result = await Matricula.removeByKeys(id_aula, doc_estudiante, fecha_inicio);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Matrícula no encontrada" 
      });
    }
    
    res.json({ 
      message: "Matrícula eliminada exitosamente" 
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: "No se puede eliminar la matrícula porque tiene registros asociados" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar la matrícula", 
      error: error.message 
    });
  }
};