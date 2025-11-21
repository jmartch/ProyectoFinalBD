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
    const { id_tutor } = req.body;
    
    // Validación de campo obligatorio
    if (!id_tutor) {
      return res.status(400).json({ 
        message: "Falta campo requerido: id_tutor" 
      });
    }
    
    const result = await Tutor.create({ id_tutor });
    
    res.status(201).json({ 
      message: "Tutor creado exitosamente",
      data: { 
        id_tutor
      }
    });
  } catch (error) {
    // Manejo de id duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: "Ya existe un tutor con ese id" 
      });
    }
    // Manejo de llave foránea inválida (si id_tutor es FK a otra tabla)
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ 
        message: "El id especificado no existe en la tabla relacionada" 
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
    
    // Validar que haya datos para actualizar
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ 
        message: "No se proporcionaron datos para actualizar" 
      });
    }

    // No permitir actualizar el id_tutor
    if (data.id_tutor) {
      return res.status(400).json({ 
        message: "No se puede actualizar el id del tutor" 
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