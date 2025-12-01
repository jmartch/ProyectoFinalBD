// backend/controllers/ESTUDIANTE.controller.js
import ESTUDIANTE from "../models/ESTUDIANTE.model.js";

// --- LISTA SIMPLE ---
export const getAllEstudiantes = async (req, res) => {
  try {
    const estudiantes = await ESTUDIANTE.getAll();
    res.json(estudiantes);
  } catch (error) {
    console.error("[ESTUDIANTE] Error getAllEstudiantes:", error);
    res.status(500).json({
      message: "Error al obtener los estudiantes",
      error: error.message,
    });
  }
};

// --- LISTA CON DETALLE (AULA, GRADO, IED) ---
export const getAllEstudiantesDetalle = async (req, res) => {
  try {
    const estudiantes = await ESTUDIANTE.getAllWithDetalle();
    res.json(estudiantes);
  } catch (error) {
    console.error("[ESTUDIANTE] Error getAllEstudiantesDetalle:", error);
    res.status(500).json({
      message: "Error al obtener los estudiantes con detalle",
      error: error.message,
    });
  }
};

export const getEstudianteById = async (req, res) => {
  try {
    const { doc } = req.params;
    const estudiante = await ESTUDIANTE.getById(doc);

    if (!estudiante) {
      return res.status(404).json({
        message: "Estudiante no encontrado",
      });
    }

    res.json(estudiante);
  } catch (error) {
    console.error("[ESTUDIANTE] Error getEstudianteById:", error);
    res.status(500).json({
      message: "Error al obtener el estudiante",
      error: error.message,
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
      sexo,
    } = req.body;

    if (
      !doc_estudiante ||
      !tipo_doc ||
      !nombre1 ||
      !apellido1 ||
      !sexo ||
      !correo_acudiente ||
      !telefono_acudiente
    ) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: doc_estudiante, tipo_doc, nombre1, apellido1, sexo, correo_acudiente, telefono_acudiente",
      });
    }

    const tiposDocValidos = ["TI", "CC", "CE", "RC", "PE"];
    if (!tiposDocValidos.includes(tipo_doc)) {
      return res.status(400).json({
        message:
          "Tipo de documento inválido. Valores permitidos: TI, CC, CE, RC, PE",
      });
    }

    const sexosValidos = ["M", "F"];
    if (!sexosValidos.includes(sexo)) {
      return res.status(400).json({
        message: "Sexo inválido. Valores permitidos: M, F",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo_acudiente)) {
      return res.status(400).json({
        message: "Correo electrónico inválido",
      });
    }

    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!telefonoRegex.test(telefono_acudiente)) {
      return res.status(400).json({
        message:
          "Teléfono inválido. Debe contener entre 7 y 15 dígitos",
      });
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
      sexo,
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
        sexo,
      },
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Ya existe un estudiante con ese documento",
      });
    }
    console.error("[ESTUDIANTE] Error createEstudiante:", error);
    res.status(500).json({
      message: "Error al crear el estudiante",
      error: error.message,
    });
  }
};

export const updateEstudiante = async (req, res) => {
  try {
    const { doc } = req.params;

    const {
      tipo_doc,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      sexo,
      correo_acudiente,
      telefono_acudiente,
      doc_estudiante,
      ...rest
    } = req.body;

    if (doc_estudiante) {
      return res.status(400).json({
        message: "No se puede actualizar el documento del estudiante",
      });
    }

    if (Object.keys(rest).length > 0) {
      return res.status(400).json({
        message:
          "Se han enviado campos no permitidos para la actualización",
      });
    }

    if (
      !tipo_doc ||
      !nombre1 ||
      !apellido1 ||
      !sexo ||
      !correo_acudiente ||
      !telefono_acudiente
    ) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos para actualizar: tipo_doc, nombre1, apellido1, sexo, correo_acudiente, telefono_acudiente",
      });
    }

    const tiposDocValidos = ["TI", "CC", "CE", "RC", "PE"];
    if (!tiposDocValidos.includes(tipo_doc)) {
      return res.status(400).json({
        message:
          "Tipo de documento inválido. Valores permitidos: TI, CC, CE, RC, PE",
      });
    }

    const sexosValidos = ["M", "F"];
    if (!sexosValidos.includes(sexo)) {
      return res.status(400).json({
        message: "Sexo inválido. Valores permitidos: M, F",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo_acudiente)) {
      return res.status(400).json({
        message: "Correo electrónico inválido",
      });
    }

    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!telefonoRegex.test(telefono_acudiente)) {
      return res.status(400).json({
        message:
          "Teléfono inválido. Debe contener entre 7 y 15 dígitos",
      });
    }

    const result = await ESTUDIANTE.update(doc, {
      tipo_doc,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      sexo,
      correo_acudiente,
      telefono_acudiente,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Estudiante no encontrado",
      });
    }

    res.json({
      message: "Estudiante actualizado exitosamente",
      data: {
        doc_estudiante: doc,
        tipo_doc,
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        sexo,
        correo_acudiente,
        telefono_acudiente,
      },
    });
  } catch (error) {
    console.error("[ESTUDIANTE] Error updateEstudiante:", error);
    res.status(500).json({
      message: "Error al actualizar el estudiante",
      error: error.message,
    });
  }
};

export const deleteEstudiante = async (req, res) => {
  try {
    const { doc } = req.params;
    const result = await ESTUDIANTE.remove(doc);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Estudiante no encontrado",
      });
    }

    res.json({
      message: "Estudiante eliminado exitosamente",
    });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "No se puede eliminar el estudiante porque tiene registros asociados (notas, asistencias, etc.)",
      });
    }
    console.error("[ESTUDIANTE] Error deleteEstudiante:", error);
    res.status(500).json({
      message: "Error al eliminar el estudiante",
      error: error.message,
    });
  }
};
