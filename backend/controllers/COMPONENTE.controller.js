// controllers/componente.controller.js
import COMPONENTE from "../models/COMPONENTE.model.js";

export const getAllComponentes = async (req, res) => {
  try {
    const componentes = await COMPONENTE.getAll();
    res.json(componentes);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener los componentes", 
      error: error.message 
    });
  }
};

export const getComponenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const componente = await COMPONENTE.getById(id);
    
    if (!componente) {
      return res.status(404).json({ 
        message: "Componente no encontrado" 
      });
    }
    
    res.json(componente);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener el componente", 
      error: error.message 
    });
  }
};

export const createComponente = async (req, res) => {
  try {
    const { id_periodo, nombre, porcentaje } = req.body;
    
    // Validación básica
    if (!id_periodo || !nombre || porcentaje === undefined) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: id_periodo, nombre, porcentaje" 
      });
    }

    // Validación de porcentaje
    if (porcentaje < 0 || porcentaje > 100) {
      return res.status(400).json({ 
        message: "El porcentaje debe estar entre 0 y 100" 
      });
    }
    
    const result = await COMPONENTE.create({ id_periodo, nombre, porcentaje });
    res.status(201).json({ 
      message: "Componente creado exitosamente",
      data: { 
        id_componente: result.insertId, 
        id_periodo, 
        nombre, 
        porcentaje 
      }
    });
  } catch (error) {
    // Manejo de errores de llave foránea
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        message: "El periodo especificado no existe" 
      });
    }
    res.status(500).json({ 
      message: "Error al crear el componente", 
      error: error.message 
    });
  }
};

export const updateComponente = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_periodo, nombre, porcentaje } = req.body;
    
    // Validación básica
    if (!id_periodo || !nombre || porcentaje === undefined) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: id_periodo, nombre, porcentaje" 
      });
    }

    // Validación de porcentaje
    if (porcentaje < 0 || porcentaje > 100) {
      return res.status(400).json({ 
        message: "El porcentaje debe estar entre 0 y 100" 
      });
    }
    
    const result = await COMPONENTE.update(id, { id_periodo, nombre, porcentaje });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Componente no encontrado" 
      });
    }
    
    res.json({ 
      message: "Componente actualizado exitosamente",
      data: { 
        id_componente: id, 
        id_periodo, 
        nombre, 
        porcentaje 
      }
    });
  } catch (error) {
    // Manejo de errores de llave foránea
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        message: "El periodo especificado no existe" 
      });
    }
    res.status(500).json({ 
      message: "Error al actualizar el componente", 
      error: error.message 
    });
  }
};

export const deleteComponente = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await COMPONENTE.remove(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Componente no encontrado" 
      });
    }
    
    res.json({ 
      message: "Componente eliminado exitosamente" 
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: "No se puede eliminar el componente porque tiene registros asociados" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar el componente", 
      error: error.message 
    });
  }
};