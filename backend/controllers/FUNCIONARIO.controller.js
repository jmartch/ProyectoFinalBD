// controllers/funcionario.controller.js
import FUNCIONARIO from "../models/FUNCIONARIO.model.js";

export const getAllFuncionarios = async (req, res) => {
  try {
    const funcionarios = await FUNCIONARIO.getAll();
    res.json(funcionarios);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los funcionarios",
      error: error.message,
    });
  }
};

export const getFuncionarioById = async (req, res) => {
  try {
    const { doc } = req.params;
    const funcionario = await FUNCIONARIO.getById(doc);

    if (!funcionario) {
      return res.status(404).json({
        message: "Funcionario no encontrado",
      });
    }

    res.json(funcionario);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el funcionario",
      error: error.message,
    });
  }
};

export const createFuncionario = async (req, res) => {
  try {
    const {
      doc_funcionario,
      tipo_doc,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      correo,
      telefono,
      sexo,
      fecha_contrato,
    } = req.body;

    // Campos obligatorios (nombre2 y apellido2 pueden ser opcionales)
    if (
      !doc_funcionario ||
      !tipo_doc ||
      !nombre1 ||
      !apellido1 ||
      !sexo ||
      !correo ||
      !telefono ||
      !fecha_contrato
    ) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: doc_funcionario, tipo_doc, nombre1, apellido1, sexo, correo, telefono, fecha_contrato",
      });
    }

    // Validación de tipo de documento
    const tiposDocValidos = ["TI", "CC", "CE", "PE"];
    if (!tiposDocValidos.includes(tipo_doc)) {
      return res.status(400).json({
        message:
          "Tipo de documento inválido. Valores permitidos: TI, CC, CE, PE",
      });
    }

    // Validación de sexo
    const sexosValidos = ["M", "F"];
    if (!sexosValidos.includes(sexo)) {
      return res.status(400).json({
        message: "Sexo inválido. Valores permitidos: M, F",
      });
    }

    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        message: "Correo electrónico inválido",
      });
    }

    // Validación de teléfono
    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!telefonoRegex.test(telefono)) {
      return res.status(400).json({
        message:
          "Teléfono inválido. Debe contener entre 7 y 15 dígitos",
      });
    }

    // Validación de fecha de contrato
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_contrato)) {
      return res.status(400).json({
        message: "Formato de fecha inválido. Use YYYY-MM-DD",
      });
    }

    // Validar que la fecha no sea futura
    const fechaContratoDate = new Date(fecha_contrato);
    const hoy = new Date();
    if (fechaContratoDate > hoy) {
      return res.status(400).json({
        message: "La fecha de contrato no puede ser futura",
      });
    }

    const result = await FUNCIONARIO.create({
      doc_funcionario,
      tipo_doc,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      correo,
      telefono,
      sexo,
      fecha_contrato,
    });

    res.status(201).json({
      message: "Funcionario creado exitosamente",
      data: {
        doc_funcionario,
        tipo_doc,
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        correo,
        telefono,
        sexo,
        fecha_contrato,
      },
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    // Manejo de documento duplicado
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Ya existe un funcionario con ese documento",
      });
    }
    res.status(500).json({
      message: "Error al crear el funcionario",
      error: error.message,
    });
  }
};

export const updateFuncionario = async (req, res) => {
  try {
    const { doc } = req.params;

    const {
      doc_funcionario,
      tipo_doc,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      correo,
      telefono,
      sexo,
      fecha_contrato,
      ...rest
    } = req.body;

    // No permitir actualizar el documento
    if (doc_funcionario) {
      return res.status(400).json({
        message: "No se puede actualizar el documento del funcionario",
      });
    }

    // Evitar campos basura
    if (Object.keys(rest).length > 0) {
      return res.status(400).json({
        message:
          "Se han enviado campos no permitidos para la actualización",
      });
    }

    // Validar que vengan todos los campos requeridos (update completo)
    if (
      !tipo_doc ||
      !nombre1 ||
      !apellido1 ||
      !sexo ||
      !correo ||
      !telefono ||
      !fecha_contrato
    ) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos para actualizar: tipo_doc, nombre1, apellido1, sexo, correo, telefono, fecha_contrato",
      });
    }

    // Validación de tipo de documento
    const tiposDocValidos = ["TI", "CC", "CE", "PE"];
    if (!tiposDocValidos.includes(tipo_doc)) {
      return res.status(400).json({
        message:
          "Tipo de documento inválido. Valores permitidos: TI, CC, CE, PE",
      });
    }

    // Validación de sexo
    const sexosValidos = ["M", "F"];
    if (!sexosValidos.includes(sexo)) {
      return res.status(400).json({
        message: "Sexo inválido. Valores permitidos: M, F",
      });
    }

    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        message: "Correo electrónico inválido",
      });
    }

    // Validación de teléfono
    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!telefonoRegex.test(telefono)) {
      return res.status(400).json({
        message:
          "Teléfono inválido. Debe contener entre 7 y 15 dígitos",
      });
    }

    // Validación de fecha de contrato
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_contrato)) {
      return res.status(400).json({
        message: "Formato de fecha inválido. Use YYYY-MM-DD",
      });
    }

    const fechaContratoDate = new Date(fecha_contrato);
    const hoy = new Date();
    if (fechaContratoDate > hoy) {
      return res.status(400).json({
        message: "La fecha de contrato no puede ser futura",
      });
    }

    const result = await FUNCIONARIO.update(doc, {
      tipo_doc,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      sexo,
      correo,
      telefono,
      fecha_contrato,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Funcionario no encontrado",
      });
    }

    res.json({
      message: "Funcionario actualizado exitosamente",
      data: {
        doc_funcionario: doc,
        tipo_doc,
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        correo,
        telefono,
        sexo,
        fecha_contrato,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el funcionario",
      error: error.message,
    });
  }
};

export const deleteFuncionario = async (req, res) => {
  try {
    const { doc } = req.params;
    const result = await FUNCIONARIO.remove(doc);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Funcionario no encontrado",
      });
    }

    res.json({
      message: "Funcionario eliminado exitosamente",
    });
  } catch (error) {
    // Manejo de restricciones de llave foránea al eliminar
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "No se puede eliminar el funcionario porque tiene registros asociados (usuario, tutorías, etc.)",
      });
    }
    res.status(500).json({
      message: "Error al eliminar el funcionario",
      error: error.message,
    });
  }
};
