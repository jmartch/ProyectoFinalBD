// backend/controllers/TUTOR.controller.js
import Tutor from "../models/TUTOR.model.js";

// ========== CRUD básico ==========

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
    if (error.code === "ER_DUP_ENTRY") {
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
    
    if (data.id_tutor) {
      return res.status(400).json({ 
        message: "No se puede actualizar el id del tutor" 
      });
    }

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
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ 
        message: "No se puede eliminar el tutor porque tiene registros asociados" 
      });
    }
    res.status(500).json({ 
      message: "Error al eliminar el tutor", 
      error: error.message 
    });
  }
};

// ========== NUEVO: /api/tutores/full ==========

export const getAllTutoresFull = async (req, res) => {
  try {
    const tutores = await Tutor.getAllWithDetails();
    res.json(tutores);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los tutores con detalle",
      error: error.message,
    });
  }
};

// ========== NUEVO: /api/tutores/:doc_funcionario/aulas-estudiantes ==========

export const getTutorAulasYEstudiantes = async (req, res) => {
  try {
    const { doc_funcionario } = req.params;
    const rows = await Tutor.getAulasYEstudiantesByDocFuncionario(doc_funcionario);

    const aulasMap = new Map();

    rows.forEach((row) => {
      const id_aula = row.id_aula;
      if (!aulasMap.has(id_aula)) {
        aulasMap.set(id_aula, {
          id_aula: row.id_aula,
          grado: row.grado,
          id_sede: row.id_sede,
          direccion_sede: row.direccion_sede,
          tipo_sede: row.tipo_sede,
          id_ied: row.id_ied,
          nombre_ied: row.nombre_ied,
          estudiantes: [],
        });
      }

      if (row.doc_estudiante) {
        aulasMap.get(id_aula).estudiantes.push({
          doc_estudiante: row.doc_estudiante,
          tipo_doc: row.est_tipo_doc,
          nombre1: row.est_nombre1,
          nombre2: row.est_nombre2,
          apellido1: row.est_apellido1,
          apellido2: row.est_apellido2,
          sexo: row.est_sexo,
          correo_acudiente: row.correo_acudiente,
          telefono_acudiente: row.telefono_acudiente,
        });
      }
    });

    res.json({
      doc_funcionario,
      aulas: Array.from(aulasMap.values()),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las aulas y estudiantes del tutor",
      error: error.message,
    });
  }
};
