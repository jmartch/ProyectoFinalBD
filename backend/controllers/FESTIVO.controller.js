// controllers/FESTIVO.controller.js
import Festivo from "../models/FESTIVO.model.js";

export const getAllFestivos = async (req, res) => {
  try {
    const festivos = await Festivo.getAll();
    res.json(festivos);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener los festivos", 
      error: error.message 
    });
  }
};

export const getFestivoById = async (req, res) => {
  try {
    const { id } = req.params;
    const festivo = await Festivo.getById(id);
    
    if (!festivo) {
      return res.status(404).json({ 
        message: "Festivo no encontrado" 
      });
    }
    
    res.json(festivo);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener el festivo", 
      error: error.message 
    });
  }
};

export const getActiveFestivos = async (req, res) => {
  try {
    const festivosActivos = await Festivo.getActive();
    res.json(festivosActivos);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener los festivos activos", 
      error: error.message 
    });
  }
};

export const createFestivo = async (req, res) => {
  try {
    const { descripcion, fecha } = req.body;
    
    // Validación de campos obligatorios
    if (!fecha) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: fecha" 
      });
    }

    // Validación de formato de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }
    
    const result = await Festivo.create({ 
      descripcion, 
      fecha 
    });
    
    res.status(201).json({ 
      message: "Festivo creado exitosamente",
      data: { 
        id_festivo: result.id,
        descripcion, 
        fecha 
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al crear el festivo", 
      error: error.message 
    });
  }
};

export const updatePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, fecha } = req.body;
    
    // Validar que haya datos para actualizar
    if (!descripcion || !fecha) {
      return res.status(400).json({ 
        message: "Debe proporcionar descripcion y fecha para actualizar" 
      });
    }

    // Validación de formato de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }
    
    const result = await Festivo.update(id, { descripcion, fecha });
    
    if (result.affected === 0) {
      return res.status(404).json({ 
        message: "Festivo no encontrado" 
      });
    }
    
    res.json({ 
      message: "Festivo actualizado exitosamente",
      data: { id_festivo: id, descripcion, fecha }
    });
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ 
        message: error.message 
      });
    }
    res.status(500).json({ 
      message: "Error al actualizar el periodo", 
      error: error.message 
    });
  }
};

export const deleteFestivo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Festivo.remove(id);
    
    if (!result.deleted) {
      return res.status(404).json({ 
        message: "Festivo no encontrado" 
      });
    }
    
    res.json({ 
      message: "Festivo eliminado exitosamente" 
    });
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ 
        message: error.message 
      });
    }
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: "No se puede eliminar el festivo porque tiene registros asociados" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar el festivo", 
      error: error.message 
    });
  }
};