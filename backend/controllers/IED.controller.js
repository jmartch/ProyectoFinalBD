// controllers/IED.controller.js
import IED from "../models/IED.model.js";

const HORA_REGEX = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

const validarDuracion = (duracion) => {
  if (!HORA_REGEX.test(duracion)) return false;
  const [h, m, s] = duracion.split(":").map(Number);
  const totalSegundos = h * 3600 + m * 60 + s;
  return totalSegundos > 0;
};

export const getAllIEDs = async (req, res) => {
  console.log("[IED] GET /api/ieds");
  try {
    const ieds = await IED.getAll();
    console.log("[IED] Resultado getAll:", ieds);
    res.json(ieds);
  } catch (error) {
    console.error("[IED] Error en getAllIEDs:", error);
    res.status(500).json({
      message: "Error al obtener las IED",
      error: error.message,
    });
  }
};

export const getIEDById = async (req, res) => {
  console.log("[IED] GET /api/ieds/:id", req.params.id);
  try {
    const { id } = req.params;
    const ied = await IED.getById(id);

    if (!ied) {
      return res.status(404).json({
        message: "IED no encontrada",
      });
    }

    res.json(ied);
  } catch (error) {
    console.error("[IED] Error en getIEDById:", error);
    res.status(500).json({
      message: "Error al obtener la IED",
      error: error.message,
    });
  }
};

export const createIED = async (req, res) => {
  console.log("[IED] POST /api/ieds BODY:", req.body);
  try {
    const { nombre, telefono, duracion, hora_inicio, hora_fin, jornada } = req.body;

    if (!nombre || !telefono || !duracion || !hora_inicio || !hora_fin || !jornada) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: nombre, telefono, duracion, hora_inicio, hora_fin, jornada",
      });
    }

    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!telefonoRegex.test(telefono)) {
      return res.status(400).json({
        message: "Teléfono inválido. Debe contener entre 7 y 15 dígitos",
      });
    }

    if (!validarDuracion(duracion)) {
      return res.status(400).json({
        message: "Duración inválida. Use HH:MM:SS y debe ser mayor a 00:00:00",
      });
    }

    if (!HORA_REGEX.test(hora_inicio)) {
      return res.status(400).json({
        message: "Formato de hora_inicio inválido. Use HH:MM:SS",
      });
    }
    if (!HORA_REGEX.test(hora_fin)) {
      return res.status(400).json({
        message: "Formato de hora_fin inválido. Use HH:MM:SS",
      });
    }

    const [horaInicioHH, horaInicioMM, horaInicioSS] = hora_inicio
      .split(":")
      .map(Number);
    const [horaFinHH, horaFinMM, horaFinSS] = hora_fin.split(":").map(Number);

    const inicioEnSegundos = horaInicioHH * 3600 + horaInicioMM * 60 + horaInicioSS;
    const finEnSegundos = horaFinHH * 3600 + horaFinMM * 60 + horaFinSS;

    if (finEnSegundos <= inicioEnSegundos) {
      return res.status(400).json({
        message: "La hora_fin debe ser posterior a la hora_inicio",
      });
    }

    if (jornada.length > 50) {
      return res.status(400).json({
        message: "La jornada no puede exceder 50 caracteres",
      });
    }

    const result = await IED.create({
      nombre,
      telefono,
      duracion,
      hora_inicio,
      hora_fin,
      jornada,
    });

    console.log("[IED] INSERT resultado:", result);

    res.status(201).json({
      message: "IED creada exitosamente",
      data: {
        id_ied: result.insertId,
        nombre,
        telefono,
        duracion,
        hora_inicio,
        hora_fin,
        jornada,
      },
    });
  } catch (error) {
    console.error("[IED] Error al crear la IED:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Ya existe una IED con ese nombre",
      });
    }
    res.status(500).json({
      message: "Error al crear la IED",
      error: error.message,
    });
  }
};

export const updateIED = async (req, res) => {
  console.log("[IED] PUT /api/ieds/:id", req.params.id, "BODY:", req.body);
  try {
    const { id } = req.params;
    const { nombre, telefono, duracion, hora_inicio, hora_fin, jornada } = req.body;

    if (!nombre || !telefono || !duracion || !hora_inicio || !hora_fin || !jornada) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: nombre, telefono, duracion, hora_inicio, hora_fin, jornada",
      });
    }

    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!telefonoRegex.test(telefono)) {
      return res.status(400).json({
        message: "Teléfono inválido. Debe contener entre 7 y 15 dígitos",
      });
    }

    if (!validarDuracion(duracion)) {
      return res.status(400).json({
        message: "Duración inválida. Use HH:MM:SS y debe ser mayor a 00:00:00",
      });
    }

    if (!HORA_REGEX.test(hora_inicio)) {
      return res.status(400).json({
        message: "Formato de hora_inicio inválido. Use HH:MM:SS",
      });
    }
    if (!HORA_REGEX.test(hora_fin)) {
      return res.status(400).json({
        message: "Formato de hora_fin inválido. Use HH:MM:SS",
      });
    }

    const [horaInicioHH, horaInicioMM, horaInicioSS] = hora_inicio
      .split(":")
      .map(Number);
    const [horaFinHH, horaFinMM, horaFinSS] = hora_fin.split(":").map(Number);

    const inicioEnSegundos = horaInicioHH * 3600 + horaInicioMM * 60 + horaInicioSS;
    const finEnSegundos = horaFinHH * 3600 + horaFinMM * 60 + horaFinSS;

    if (finEnSegundos <= inicioEnSegundos) {
      return res.status(400).json({
        message: "La hora_fin debe ser posterior a la hora_inicio",
      });
    }

    if (jornada.length > 50) {
      return res.status(400).json({
        message: "La jornada no puede exceder 50 caracteres",
      });
    }

    const result = await IED.update(id, {
      nombre,
      telefono,
      duracion,
      hora_inicio,
      hora_fin,
      jornada,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "IED no encontrada",
      });
    }

    res.json({
      message: "IED actualizada exitosamente",
      data: {
        id_ied: id,
        nombre,
        telefono,
        duracion,
        hora_inicio,
        hora_fin,
        jornada,
      },
    });
  } catch (error) {
    console.error("[IED] Error al actualizar la IED:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Ya existe una IED con ese nombre",
      });
    }
    res.status(500).json({
      message: "Error al actualizar la IED",
      error: error.message,
    });
  }
};

export const deleteIED = async (req, res) => {
  console.log("[IED] DELETE /api/ieds/:id", req.params.id);
  try {
    const { id } = req.params;
    const result = await IED.remove(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "IED no encontrada",
      });
    }

    res.json({
      message: "IED eliminada exitosamente",
    });
  } catch (error) {
    console.error("[IED] Error al eliminar la IED:", error);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "No se puede eliminar la IED porque tiene sedes u otros registros asociados",
      });
    }
    res.status(500).json({
      message: "Error al eliminar la IED",
      error: error.message,
    });
  }
};
