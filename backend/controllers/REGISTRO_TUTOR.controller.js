// controllers/REGISTRO_TUTORES.controller.js
import RegistroTutores from "../models/REGISTRO_TUTORES.model.js";

export const getAllRegistrosTutores = async (req, res) => {
  try {
    const registros = await RegistroTutores.getAll();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener los registros de tutores", 
      error: error.message 
    });
  }
};

export const getRegistroTutoresByKeys = async (req, res) => {
  try {
    const { doc_funcionario, id_tutor } = req.params;
    const registro = await RegistroTutores.getByKeys(doc_funcionario, id_tutor);
    
    if (!registro) {
      return res.status(404).json({ 
        message: "Registro de tutor no encontrado" 
      });
    }
    
    res.json(registro);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener el registro de tutor", 
      error: error.message 
    });
  }
};

export const createRegistroTutores = async (req, res) => {
  try {
    const { doc_funcionario, id_tutor, fecha_asignacion } = req.body;
    
    // Validación de campos obligatorios
    if (!doc_funcionario || !id_tutor || !fecha_asignacion) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: doc_funcionario, id_tutor, fecha_asignacion" 
      });
    }

    // Validación de formato de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_asignacion)) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }

    // Validar que la fecha de asignación no sea futura
    const fechaAsignacionDate = new Date(fecha_asignacion);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    if (fechaAsignacionDate > hoy) {
      return res.status(400).json({ 
        message: "La fecha de asignación no puede ser futura" 
      });
    }
    
    const result = await RegistroTutores.create({ 
      doc_funcionario, 
      id_tutor, 
      fecha_asignacion 
    });
    
    res.status(201).json({ 
      message: "Registro de tutor creado exitosamente",
      data: { 
        doc_funcionario, 
        id_tutor, 
        fecha_asignacion 
      }
    });
  } catch (error) {
    // Manejo de registro duplicado (llave primaria compuesta)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: "Ya existe un registro para este funcionario y tutor" 
      });
    }
    // Manejo de llave foránea inválida
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ 
        message: "El funcionario o el tutor especificado no existe" 
      });
    }
    res.status(500).json({ 
      message: "Error al crear el registro de tutor", 
      error: error.message 
    });
  }
};

export const updateRegistroTutoresByKeys = async (req, res) => {
  try {
    const { doc_funcionario, id_tutor } = req.params;
    const { fecha_asignacion } = req.body;
    
    // Validar que se proporcione la fecha
    if (!fecha_asignacion) {
      return res.status(400).json({ 
        message: "Debe proporcionar la fecha_asignacion para actualizar" 
      });
    }

    // Validación de formato de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_asignacion)) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }

    // Validar que la fecha de asignación no sea futura
    const fechaAsignacionDate = new Date(fecha_asignacion);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    if (fechaAsignacionDate > hoy) {
      return res.status(400).json({ 
        message: "La fecha de asignación no puede ser futura" 
      });
    }
    
    const result = await RegistroTutores.updateByKeys(doc_funcionario, id_tutor, { fecha_asignacion });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Registro de tutor no encontrado" 
      });
    }
    
    res.json({ 
      message: "Registro de tutor actualizado exitosamente",
      data: { doc_funcionario, id_tutor, fecha_asignacion }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar el registro de tutor", 
      error: error.message 
    });
  }
};

export const deleteRegistroTutoresByKeys = async (req, res) => {
  try {
    const { doc_funcionario, id_tutor } = req.params;
    const result = await RegistroTutores.removeByKeys(doc_funcionario, id_tutor);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Registro de tutor no encontrado" 
      });
    }
    
    res.json({ 
      message: "Registro de tutor eliminado exitosamente" 
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: "No se puede eliminar el registro de tutor porque tiene registros asociados" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar el registro de tutor", 
      error: error.message 
    });
  }
};