// controllers/SEMANA.controller.js
import Semana from "../models/SEMANA.model.js";

export const getAllSemanas = async (req, res) => {
  try {
    const semanas = await Semana.getAll();
    res.json(semanas);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener las semanas", 
      error: error.message 
    });
  }
};

export const getSemanaById = async (req, res) => {
  try {
    const { id } = req.params;
    const semana = await Semana.getById(id);
    
    if (!semana) {
      return res.status(404).json({ 
        message: "Semana no encontrada" 
      });
    }
    
    res.json(semana);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener la semana", 
      error: error.message 
    });
  }
};

export const getActiveSemanas = async (req, res) => {
  try {
    const semanasActivas = await Semana.getActive();
    res.json(semanasActivas);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener las semanas activas", 
      error: error.message 
    });
  }
};

export const createSemana = async (req, res) => {
  try {
    const { id_periodo, fecha_inicio, fecha_fin } = req.body;
    
    // Validación de campos obligatorios
    if (!id_periodo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: id_periodo, fecha_inicio, fecha_fin" 
      });
    }

    // Validación de formato de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_inicio) || !fechaRegex.test(fecha_fin)) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }

    // Validar que fecha_inicio sea menor que fecha_fin
    const fechaInicioDate = new Date(fecha_inicio);
    const fechaFinDate = new Date(fecha_fin);
    if (fechaInicioDate >= fechaFinDate) {
      return res.status(400).json({ 
        message: "La fecha de inicio debe ser anterior a la fecha de fin" 
      });
    }

    // Verificar solapamiento de fechas
    const hasOverlap = await Semana.checkOverlap(fecha_inicio, fecha_fin);
    if (hasOverlap) {
      return res.status(409).json({ 
        message: "Ya existe una semana que se solapa con las fechas especificadas" 
      });
    }
    
    const result = await Semana.create({ 
      id_periodo,
      fecha_inicio, 
      fecha_fin 
    });
    
    res.status(201).json({ 
      message: "Semana creada exitosamente",
      data: { 
        numero_semana: result.id,
        id_periodo,
        fecha_inicio, 
        fecha_fin 
      }
    });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        message: "El periodo especificado no existe" 
      });
    }
    res.status(500).json({ 
      message: "Error al crear la semana", 
      error: error.message 
    });
  }
};

export const updateSemana = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_periodo, fecha_inicio, fecha_fin } = req.body;
    
    // Validar que haya datos para actualizar
    if (!id_periodo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ 
        message: "Debe proporcionar id_periodo, fecha_inicio y fecha_fin para actualizar" 
      });
    }

    // Validación de formato de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_inicio) || !fechaRegex.test(fecha_fin)) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }

    // Validar que fecha_inicio sea menor que fecha_fin
    const fechaInicioDate = new Date(fecha_inicio);
    const fechaFinDate = new Date(fecha_fin);
    if (fechaInicioDate >= fechaFinDate) {
      return res.status(400).json({ 
        message: "La fecha de inicio debe ser anterior a la fecha de fin" 
      });
    }

    // Verificar solapamiento de fechas (excluyendo la semana actual)
    const hasOverlap = await Semana.checkOverlap(id_periodo, fecha_inicio, fecha_fin, id);
    if (hasOverlap) {
      return res.status(409).json({ 
        message: "Las fechas especificadas se solapan con otra semana existente" 
      });
    }
    
    const result = await Semana.update(id, { id_periodo, fecha_inicio, fecha_fin });
    
    if (result.affected === 0) {
      return res.status(404).json({ 
        message: "Semana no encontrada" 
      });
    }
    
    res.json({ 
      message: "Semana actualizada exitosamente",
      data: { numero_semana: id, id_periodo, fecha_inicio, fecha_fin }
    });
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ 
        message: error.message 
      });
    }
    res.status(500).json({ 
      message: "Error al actualizar la semana", 
      error: error.message 
    });
  }
};

export const deleteSemana = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Semana.remove(id);
    
    if (!result.deleted) {
      return res.status(404).json({ 
        message: "Semana no encontrada" 
      });
    }
    
    res.json({ 
      message: "Semana eliminada exitosamente" 
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
        message: "No se puede eliminar la semana porque tiene registros asociados" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar la semana", 
      error: error.message 
    });
  }
};