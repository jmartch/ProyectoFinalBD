// controllers/TUTOR.controller.js
import Tutor from "../models/TUTOR.model.js";

export const getAllTutores = async (req, res) => {
  try {
    const tutores = await Tutor.getAll();
    res.json(tutores);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener los tutores", 
      error: error.message 
    });
  }
};

export const getTutorById = async (req, res) => {
  try {
    const { id } = req.params;
    const tutor = await Tutor.getById(id);
    
    if (!tutor) {
      return res.status(404).json({ 
        message: "Tutor no encontrado" 
      });
    }
    
    res.json(tutor);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener el tutor", 
      error: error.message 
    });
  }
};

export const createTutor = async (req, res) => {
  try {
    // No necesitamos nada en el body: se crea un tutor vacío y la BD genera el id
    const result = await Tutor.create();
    
    res.status(201).json({ 
      message: "Tutor creado exitosamente",
      data: { 
        id_tutor: result.insertId
      }
    });
  } catch (error) {
    // Si la tabla tuviera alguna restricción única, se podría capturar aquí
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: "Ya existe un tutor con ese id" 
      });
    }
    res.status(500).json({ 
      message: "Error al crear el tutor", 
      error: error.message 
    });
  }
};

export const updateTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // No permitir actualizar el id_tutor
    if (data.id_tutor) {
      return res.status(400).json({ 
        message: "No se puede actualizar el id del tutor" 
      });
    }

    // Si en el futuro se agregan más campos a TUTOR, aquí se validarían.
    // Por ahora, si no mandan nada útil:
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ 
        message: "No se proporcionaron datos para actualizar" 
      });
    }
    
    const result = await Tutor.update(id, data);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Tutor no encontrado" 
      });
    }
    
    res.json({ 
      message: "Tutor actualizado exitosamente",
      data: { id_tutor: id, ...data }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar el tutor", 
      error: error.message 
    });
  }
};

export const deleteTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Tutor.remove(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Tutor no encontrado" 
      });
    }
    
    res.json({ 
      message: "Tutor eliminado exitosamente" 
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: "No se puede eliminar el tutor porque tiene registros asociados (estudiantes, etc.)" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar el tutor", 
      error: error.message 
    });
  }
};
