// controllers/SEDE.controller.js
import Sede from "../models/SEDE.model.js";

export const getAllSedes = async (req, res) => {
  try {
    const sedes = await Sede.getAll();
    res.json(sedes);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener las sedes", 
      error: error.message 
    });
  }
};

export const getSedeById = async (req, res) => {
  try {
    const { id } = req.params;
    const sede = await Sede.getById(id);
    
    if (!sede) {
      return res.status(404).json({ 
        message: "Sede no encontrada" 
      });
    }
    
    res.json(sede);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener la sede", 
      error: error.message 
    });
  }
};

export const createSede = async (req, res) => {
  try {
    const { id_IED, direccion } = req.body;
    
    // Validación de campos obligatorios
    if (!id_IED || !direccion) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: id_IED, direccion" 
      });
    }

    // Validación de longitud de dirección
    if (direccion.length < 5 || direccion.length > 200) {
      return res.status(400).json({ 
        message: "La dirección debe tener entre 5 y 200 caracteres" 
      });
    }

    // Validación básica de formato de dirección (no vacía, no solo espacios)
    if (direccion.trim().length === 0) {
      return res.status(400).json({ 
        message: "La dirección no puede estar vacía o contener solo espacios" 
      });
    }
    
    const result = await Sede.create({ 
      id_IED, 
      direccion: direccion.trim() 
    });
    
    res.status(201).json({ 
      message: "Sede creada exitosamente",
      data: { 
        id_sede: result.insertId,
        id_IED, 
        direccion: direccion.trim() 
      }
    });
  } catch (error) {
    // Manejo de llave foránea inválida (IED no existe)
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ 
        message: "La IED especificada no existe" 
      });
    }
    res.status(500).json({ 
      message: "Error al crear la sede", 
      error: error.message 
    });
  }
};

export const updateSede = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_IED, direccion } = req.body;
    
    // Validar que haya datos para actualizar
    if (!id_IED && !direccion) {
      return res.status(400).json({ 
        message: "Debe proporcionar al menos un campo para actualizar (id_IED, direccion)" 
      });
    }

    // Validación de longitud de dirección (si se proporciona)
    if (direccion) {
      if (direccion.length < 5 || direccion.length > 200) {
        return res.status(400).json({ 
          message: "La dirección debe tener entre 5 y 200 caracteres" 
        });
      }

      // Validación básica de formato de dirección
      if (direccion.trim().length === 0) {
        return res.status(400).json({ 
          message: "La dirección no puede estar vacía o contener solo espacios" 
        });
      }
    }

    // Obtener sede actual para mantener valores no actualizados
    const sedeActual = await Sede.getById(id);
    if (!sedeActual) {
      return res.status(404).json({ 
        message: "Sede no encontrada" 
      });
    }

    const datosActualizados = {
      id_IED: id_IED || sedeActual.id_IED,
      direccion: direccion ? direccion.trim() : sedeActual.direccion
    };
    
    const result = await Sede.update(id, datosActualizados);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Sede no encontrada" 
      });
    }
    
    res.json({ 
      message: "Sede actualizada exitosamente",
      data: { id_sede: id, ...datosActualizados }
    });
  } catch (error) {
    // Manejo de llave foránea inválida
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ 
        message: "La IED especificada no existe" 
      });
    }
    res.status(500).json({ 
      message: "Error al actualizar la sede", 
      error: error.message 
    });
  }
};

export const deleteSede = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Sede.remove(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Sede no encontrada" 
      });
    }
    
    res.json({ 
      message: "Sede eliminada exitosamente" 
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: "No se puede eliminar la sede porque tiene registros asociados (aulas, funcionarios, etc.)" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar la sede", 
      error: error.message 
    });
  }
};