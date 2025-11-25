// controllers/REGISTRO_CLASES.controller.js
import RegistroClases from "../models/REGISTRO_CLASES.model.js";

export const getAllRegistrosClases = async (req, res) => {
  try {
    const registros = await RegistroClases.getAll();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener los registros de clases", 
      error: error.message 
    });
  }
};

export const getRegistroClasesById = async (req, res) => {
  try {
    const { num } = req.params;
    const registro = await RegistroClases.getById(num);
    
    if (!registro) {
      return res.status(404).json({ 
        message: "Registro de clase no encontrado" 
      });
    }
    
    res.json(registro);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener el registro de clase", 
      error: error.message 
    });
  }
};

export const createRegistroClases = async (req, res) => {
  try {
    const { numero_semana, id_aula, codigo, fecha, is_festivo, dictada, fecha_reposicion } = req.body;
    
    // Validación de campos obligatorios
    if (!numero_semana || !id_aula || !codigo || !fecha) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: numero_semana, id_aula, codigo, fecha" 
      });
    }

    // Validación de formato de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido. Use YYYY-MM-DD" 
      });
    }

    // Validación de fecha_reposicion si se proporciona
    if (fecha_reposicion && !fechaRegex.test(fecha_reposicion)) {
      return res.status(400).json({ 
        message: "Formato de fecha_reposicion inválido. Use YYYY-MM-DD" 
      });
    }

    // Validación de is_festivo (debe ser booleano o 0/1)
    const isFestivoValue = is_festivo !== undefined ? (is_festivo ? 1 : 0) : 0;

    // Validación de dictada (debe ser booleano o 0/1)
    const dictadaValue = dictada !== undefined ? (dictada ? 1 : 0) : 1;

    // Si es festivo y no fue dictada, debería tener fecha de reposición
    if (isFestivoValue === 1 && dictadaValue === 0 && !fecha_reposicion) {
      return res.status(400).json({ 
        message: "Si la clase es festiva y no fue dictada, debe proporcionar una fecha de reposición" 
      });
    }

    // Validar que fecha_reposicion sea posterior a fecha si se proporciona
    if (fecha_reposicion) {
      const fechaDate = new Date(fecha);
      const fechaReposicionDate = new Date(fecha_reposicion);
      if (fechaReposicionDate <= fechaDate) {
        return res.status(400).json({ 
          message: "La fecha de reposición debe ser posterior a la fecha de la clase" 
        });
      }
    }
    
    const result = await RegistroClases.create({ 
      numero_semana,
      id_aula, 
      codigo, 
      fecha, 
      is_festivo: isFestivoValue, 
      dictada: dictadaValue, 
      fecha_reposicion: fecha_reposicion || null
    });
    
    res.status(201).json({ 
      message: "Registro de clase creado exitosamente",
      data: { 
        num_registro: result.insertId,
        numero_semana,
        id_aula, 
        codigo, 
        fecha, 
        is_festivo: isFestivoValue, 
        dictada: dictadaValue, 
        fecha_reposicion: fecha_reposicion || null
      }
    });
  } catch (error) {
    // Manejo de llave foránea inválida
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ 
        message: "El aula, el código o la semana especificados no existen" 
      });
    }
    // Manejo de registro duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: "Ya existe un registro de clase con estos datos" 
      });
    }
    res.status(500).json({ 
      message: "Error al crear el registro de clase", 
      error: error.message 
    });
  }
};

export const updateRegistroClases = async (req, res) => {
  try {
    const { num } = req.params;
    const data = req.body;
    
    // Validar que haya datos para actualizar
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ 
        message: "No se proporcionaron datos para actualizar" 
      });
    }

    // Validación de fecha si se proporciona
    if (data.fecha) {
      const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!fechaRegex.test(data.fecha)) {
        return res.status(400).json({ 
          message: "Formato de fecha inválido. Use YYYY-MM-DD" 
        });
      }
    }

    // Validación de fecha_reposicion si se proporciona
    if (data.fecha_reposicion) {
      const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!fechaRegex.test(data.fecha_reposicion)) {
        return res.status(400).json({ 
          message: "Formato de fecha_reposicion inválido. Use YYYY-MM-DD" 
        });
      }
    }

    // Convertir booleanos a 0/1
    if (data.is_festivo !== undefined) {
      data.is_festivo = data.is_festivo ? 1 : 0;
    }

    if (data.dictada !== undefined) {
      data.dictada = data.dictada ? 1 : 0;
    }

    // Validar lógica de fecha_reposicion
    if (data.fecha && data.fecha_reposicion) {
      const fechaDate = new Date(data.fecha);
      const fechaReposicionDate = new Date(data.fecha_reposicion);
      if (fechaReposicionDate <= fechaDate) {
        return res.status(400).json({ 
          message: "La fecha de reposición debe ser posterior a la fecha de la clase" 
        });
      }
    }
    
    const result = await RegistroClases.update(num, data);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Registro de clase no encontrado" 
      });
    }
    
    res.json({ 
      message: "Registro de clase actualizado exitosamente",
      data: { num_registro: num, ...data }
    });
  } catch (error) {
    // Manejo de llave foránea inválida
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ 
        message: "El aula, el código o la semana especificados no existen" 
      });
    }
    res.status(500).json({ 
      message: "Error al actualizar el registro de clase", 
      error: error.message 
    });
  }
};

export const deleteRegistroClases = async (req, res) => {
  try {
    const { num } = req.params;
    const result = await RegistroClases.remove(num);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Registro de clase no encontrado" 
      });
    }
    
    res.json({ 
      message: "Registro de clase eliminado exitosamente" 
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: "No se puede eliminar el registro de clase porque tiene registros asociados" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar el registro de clase", 
      error: error.message 
    });
  }
};