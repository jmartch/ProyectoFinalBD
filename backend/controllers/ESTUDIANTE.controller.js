// controllers/estudiante.controller.js
import ESTUDIANTE from "../models/ESTUDIANTE.model.js";

export const getAllEstudiantes = async (req, res) => {
  try {
    const estudiantes = await ESTUDIANTE.getAll();
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener los estudiantes", 
      error: error.message 
    });
  }
};

export const getEstudianteById = async (req, res) => {
  try {
    const { doc } = req.params;
    const estudiante = await ESTUDIANTE.getById(doc);
    
    if (!estudiante) {
      return res.status(404).json({ 
        message: "Estudiante no encontrado" 
      });
    }
    
    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener el estudiante", 
      error: error.message 
    });
  }
};

export const createEstudiante = async (req, res) => {
  try {
    const { 
      doc_estudiante, 
      tipo_doc, 
      nombre1, 
      nombre2, 
      apellido1, 
      apellido2, 
      correo_acudiente, 
      telefono_acudiente, 
      sexo 
    } = req.body;
    
    // Validación de campos obligatorios (nombre2 puede ser opcional)
    if (!doc_estudiante || !tipo_doc || !nombre1 || !apellido1 || !apellido2 || !sexo) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: doc_estudiante, tipo_doc, nombre1, apellido1, apellido2, sexo" 
      });
    }

    // Validación de tipo de documento
    const tiposDocValidos = ['TI', 'CC', 'CE', 'RC', 'PE'];
    if (!tiposDocValidos.includes(tipo_doc)) {
      return res.status(400).json({ 
        message: "Tipo de documento inválido. Valores permitidos: TI, CC, CE, RC, PE" 
      });
    }

    // Validación de sexo
    const sexosValidos = ['M', 'F'];
    if (!sexosValidos.includes(sexo)) {
      return res.status(400).json({ 
        message: "Sexo inválido. Valores permitidos: M, F" 
      });
    }

    // Validación de correo electrónico (si se proporciona)
    if (correo_acudiente) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo_acudiente)) {
        return res.status(400).json({ 
          message: "Correo electrónico inválido" 
        });
      }
    }

    // Validación de teléfono (si se proporciona)
    if (telefono_acudiente) {
      const telefonoRegex = /^[0-9]{7,15}$/;
      if (!telefonoRegex.test(telefono_acudiente)) {
        return res.status(400).json({ 
          message: "Teléfono inválido. Debe contener entre 7 y 15 dígitos" 
        });
      }
    }
    
    const result = await ESTUDIANTE.create({ 
      doc_estudiante, 
      tipo_doc, 
      nombre1, 
      nombre2, 
      apellido1, 
      apellido2, 
      correo_acudiente, 
      telefono_acudiente, 
      sexo 
    });
    
    res.status(201).json({ 
      message: "Estudiante creado exitosamente",
      data: { 
        doc_estudiante, 
        tipo_doc, 
        nombre1, 
        nombre2, 
        apellido1, 
        apellido2, 
        correo_acudiente, 
        telefono_acudiente, 
        sexo 
      }
    });
  } catch (error) {
    // Manejo de documento duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: "Ya existe un estudiante con ese documento" 
      });
    }
    res.status(500).json({ 
      message: "Error al crear el estudiante", 
      error: error.message 
    });
  }
};

export const updateEstudiante = async (req, res) => {
  try {
    const { doc } = req.params;
    const data = req.body;
    
    // Validar que haya datos para actualizar
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ 
        message: "No se proporcionaron datos para actualizar" 
      });
    }

    // No permitir actualizar el documento
    if (data.doc_estudiante) {
      return res.status(400).json({ 
        message: "No se puede actualizar el documento del estudiante" 
      });
    }

    // Validación de tipo de documento (si se proporciona)
    if (data.tipo_doc) {
      const tiposDocValidos = ['TI', 'CC', 'CE', 'RC', 'PE'];
      if (!tiposDocValidos.includes(data.tipo_doc)) {
        return res.status(400).json({ 
          message: "Tipo de documento inválido. Valores permitidos: TI, CC, CE, RC, PE" 
        });
      }
    }

    // Validación de sexo (si se proporciona)
    if (data.sexo) {
      const sexosValidos = ['M', 'F'];
      if (!sexosValidos.includes(data.sexo)) {
        return res.status(400).json({ 
          message: "Sexo inválido. Valores permitidos: M, F" 
        });
      }
    }

    // Validación de correo electrónico (si se proporciona)
    if (data.correo_acudiente) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.correo_acudiente)) {
        return res.status(400).json({ 
          message: "Correo electrónico inválido" 
        });
      }
    }

    // Validación de teléfono (si se proporciona)
    if (data.telefono_acudiente) {
      const telefonoRegex = /^[0-9]{7,15}$/;
      if (!telefonoRegex.test(data.telefono_acudiente)) {
        return res.status(400).json({ 
          message: "Teléfono inválido. Debe contener entre 7 y 15 dígitos" 
        });
      }
    }
    
    const result = await ESTUDIANTE.update(doc, data);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Estudiante no encontrado" 
      });
    }
    
    res.json({ 
      message: "Estudiante actualizado exitosamente",
      data: { doc_estudiante: doc, ...data }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar el estudiante", 
      error: error.message 
    });
  }
};

export const deleteEstudiante = async (req, res) => {
  try {
    const { doc } = req.params;
    const result = await ESTUDIANTE.remove(doc);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Estudiante no encontrado" 
      });
    }
    
    res.json({ 
      message: "Estudiante eliminado exitosamente" 
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: "No se puede eliminar el estudiante porque tiene registros asociados (notas, asistencias, etc.)" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar el estudiante", 
      error: error.message 
    });
  }
};