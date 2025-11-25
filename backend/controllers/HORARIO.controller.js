// controllers/HORARIO.controller.js
import Horario from "../models/HORARIO.model.js";

export const getAllHorarios = async (req, res) => {
  try {
    const horarios = await Horario.getAll();
    res.json(horarios);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener los horarios", 
      error: error.message 
    });
  }
};

export const getHorarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const horario = await Horario.getById(id);
    
    if (!horario) {
      return res.status(404).json({ 
        message: "Horario no encontrado" 
      });
    }
    
    res.json(horario);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener el horario", 
      error: error.message 
    });
  }
};

export const createHorario = async (req, res) => {
  try {
    const {dia_semana, hora_inicio, horas_duracion } = req.body;
    
    // Validación de campos obligatorios
    if (!dia_semana || !hora_inicio || !horas_duracion) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: dia_semana, hora_inicio, horas_duracion" 
      });
    }

    // Validación de día de la semana
    const diasValidos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    if (!diasValidos.includes(dia_semana)) {
      return res.status(400).json({ 
        message: "Día de la semana inválido. Valores permitidos: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo" 
      });
    }

    // Validación de hora de inicio (formato HH:MM:SS)
    const horaRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!horaRegex.test(hora_inicio)) {
      return res.status(400).json({ 
        message: "Formato de hora inválido. Use HH:MM:SS (ejemplo: 08:00:00)" 
      });
    }

    // Validación de horas de duración (debe ser un número positivo)
    if (isNaN(horas_duracion) || horas_duracion <= 0 || horas_duracion > 24) {
      return res.status(400).json({ 
        message: "Horas de duración inválidas. Debe ser un número entre 1 y 24" 
      });
    }
    
    const result = await Horario.create({ 
      dia_semana, 
      hora_inicio, 
      horas_duracion 
    });
    
    res.status(201).json({ 
      message: "Horario creado exitosamente",
      data: { 
        id_horario: result.insertId,
        dia_semana, 
        hora_inicio, 
        horas_duracion 
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al crear el horario", 
      error: error.message 
    });
  }
};

export const updateHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Validar que haya datos para actualizar
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ 
        message: "No se proporcionaron datos para actualizar" 
      });
    }

    // Validación de día de la semana (si se proporciona)
    if (data.dia_semana) {
      const diasValidos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      if (!diasValidos.includes(data.dia_semana)) {
        return res.status(400).json({ 
          message: "Día de la semana inválido. Valores permitidos: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo" 
        });
      }
    }

    // Validación de hora de inicio (si se proporciona)
    if (data.hora_inicio) {
      const horaRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
      if (!horaRegex.test(data.hora_inicio)) {
        return res.status(400).json({ 
          message: "Formato de hora inválido. Use HH:MM:SS (ejemplo: 08:00:00)" 
        });
      }
    }

    // Validación de horas de duración (si se proporciona)
    if (data.horas_duracion !== undefined) {
      if (isNaN(data.horas_duracion) || data.horas_duracion <= 0 || data.horas_duracion > 24) {
        return res.status(400).json({ 
          message: "Horas de duración inválidas. Debe ser un número entre 1 y 24" 
        });
      }
    }
    
    const result = await Horario.update(id, data);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Horario no encontrado" 
      });
    }
    
    res.json({ 
      message: "Horario actualizado exitosamente",
      data: { id_horario: id, ...data }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar el horario", 
      error: error.message 
    });
  }
};

export const deleteHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Horario.remove(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Horario no encontrado" 
      });
    }
    
    res.json({ 
      message: "Horario eliminado exitosamente" 
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: "No se puede eliminar el horario porque tiene registros asociados" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar el horario", 
      error: error.message 
    });
  }
};