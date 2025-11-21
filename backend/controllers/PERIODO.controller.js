// controllers/PERIODO.controller.js
import Periodo from "../models/PERIODO.model.js";

export const getAllPeriodos = async (req, res) => {
  try {
    const periodos = await Periodo.getAll();
    res.json(periodos);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener los periodos", 
      error: error.message 
    });
  }
};

export const getPeriodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const periodo = await Periodo.getById(id);
    
    if (!periodo) {
      return res.status(404).json({ 
        message: "Periodo no encontrado" 
      });
    }
    
    res.json(periodo);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener el periodo", 
      error: error.message 
    });
  }
};

export const getActivePeriodos = async (req, res) => {
  try {
    const periodosActivos = await Periodo.getActive();
    res.json(periodosActivos);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener los periodos activos", 
      error: error.message 
    });
  }
};

export const createPeriodo = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.body;
    
    // Validación de campos obligatorios
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: fecha_inicio, fecha_fin" 
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
    const hasOverlap = await Periodo.checkOverlap(fecha_inicio, fecha_fin);
    if (hasOverlap) {
      return res.status(409).json({ 
        message: "Ya existe un periodo que se solapa con las fechas especificadas" 
      });
    }
    
    const result = await Periodo.create({ 
      fecha_inicio, 
      fecha_fin 
    });
    
    res.status(201).json({ 
      message: "Periodo creado exitosamente",
      data: { 
        id_periodo: result.id,
        fecha_inicio, 
        fecha_fin 
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al crear el periodo", 
      error: error.message 
    });
  }
};

export const updatePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin } = req.body;
    
    // Validar que haya datos para actualizar
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ 
        message: "Debe proporcionar fecha_inicio y fecha_fin para actualizar" 
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

    // Verificar solapamiento de fechas (excluyendo el periodo actual)
    const hasOverlap = await Periodo.checkOverlap(fecha_inicio, fecha_fin, id);
    if (hasOverlap) {
      return res.status(409).json({ 
        message: "Las fechas especificadas se solapan con otro periodo existente" 
      });
    }
    
    const result = await Periodo.update(id, { fecha_inicio, fecha_fin });
    
    if (result.affected === 0) {
      return res.status(404).json({ 
        message: "Periodo no encontrado" 
      });
    }
    
    res.json({ 
      message: "Periodo actualizado exitosamente",
      data: { id_periodo: id, fecha_inicio, fecha_fin }
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

export const deletePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Periodo.remove(id);
    
    if (!result.deleted) {
      return res.status(404).json({ 
        message: "Periodo no encontrado" 
      });
    }
    
    res.json({ 
      message: "Periodo eliminado exitosamente" 
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
        message: "No se puede eliminar el periodo porque tiene registros asociados" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar el periodo", 
      error: error.message 
    });
  }
};