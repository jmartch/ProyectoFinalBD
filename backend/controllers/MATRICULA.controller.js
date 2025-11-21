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
    const { id_IED, doc_estudiante } = req.params;
    const matricula = await Matricula.getByKeys(id_IED, doc_estudiante);
    
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
    const { id_IED, doc_estudiante, fecha } = req.body;
    
    // Validación de campos obligatorios
    if (!id_IED || !doc_estudiante || !fecha) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: id_IED, doc_estudiante, fecha" 
      });
    }

    // Validación de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }

    // Validar que la fecha no sea futura
    const fechaMatricula = new Date(fecha);
    const hoy = new Date();
    if (fechaMatricula > hoy) {
      return res.status(400).json({ 
        message: "La fecha de matrícula no puede ser futura" 
      });
    }
    
    const result = await Matricula.create({ 
      id_IED, 
      doc_estudiante, 
      fecha 
    });
    
    res.status(201).json({ 
      message: "Matrícula creada exitosamente",
      data: { 
        id_IED, 
        doc_estudiante, 
        fecha 
      }
    });
  } catch (error) {
    // Manejo de matrícula duplicada
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: "Ya existe una matrícula para este estudiante en esta IED" 
      });
    }
    // Manejo de llave foránea inválida
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ 
        message: "La IED o el estudiante especificado no existe" 
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
    const { id_IED, doc_estudiante } = req.params;
    const { fecha } = req.body;
    
    // Validar que haya datos para actualizar
    if (!fecha) {
      return res.status(400).json({ 
        message: "Debe proporcionar la fecha para actualizar" 
      });
    }

    // Validación de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }

    // Validar que la fecha no sea futura
    const fechaMatricula = new Date(fecha);
    const hoy = new Date();
    if (fechaMatricula > hoy) {
      return res.status(400).json({ 
        message: "La fecha de matrícula no puede ser futura" 
      });
    }
    
    const result = await Matricula.updateByKeys(id_IED, doc_estudiante, { fecha });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Matrícula no encontrada" 
      });
    }
    
    res.json({ 
      message: "Matrícula actualizada exitosamente",
      data: { id_IED, doc_estudiante, fecha }
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
    const { id_IED, doc_estudiante } = req.params;
    const result = await Matricula.removeByKeys(id_IED, doc_estudiante);
    
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