// controllers/SEMANA.controller.js
import Semana from "../models/SEMANA.model.js";

export const getAllSemanas = async (req, res) => {
  try {
    const semanas = await Semana.getAll();
    res.json(semanas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las semanas",
      error: error.message,
    });
  }
};

export const getSemanaById = async (req, res) => {
  try {
    const { numero_semana } = req.params;
    const semana = await Semana.getById(numero_semana);

    if (!semana) {
      return res.status(404).json({
        message: "Semana no encontrada",
      });
    }

    res.json(semana);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la semana",
      error: error.message,
    });
  }
};

export const createSemana = async (req, res) => {
  try {
    const { id_periodo, fecha_inicio, fecha_fin } = req.body;

    if (!id_periodo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        message: "Faltan campos requeridos: id_periodo, fecha_inicio, fecha_fin",
      });
    }

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_inicio) || !fechaRegex.test(fecha_fin)) {
      return res.status(400).json({
        message: "Formato de fecha inválido. Use YYYY-MM-DD",
      });
    }

    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);
    if (inicio >= fin) {
      return res.status(400).json({
        message: "La fecha de inicio debe ser anterior a la fecha de fin",
      });
    }

    const result = await Semana.create({
      id_periodo,
      fecha_inicio,
      fecha_fin,
    });

    res.status(201).json({
      message: "Semana creada exitosamente",
      data: {
        numero_semana: result.insertId,
        id_periodo,
        fecha_inicio,
        fecha_fin,
      },
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({
        message: "El periodo especificado no existe",
      });
    }

    res.status(500).json({
      message: "Error al crear la semana",
      error: error.message,
    });
  }
};

export const updateSemana = async (req, res) => {
  try {
    const { numero_semana } = req.params;
    const { id_periodo, fecha_inicio, fecha_fin } = req.body;

    if (!id_periodo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        message: "Debe proporcionar id_periodo, fecha_inicio y fecha_fin para actualizar",
      });
    }

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_inicio) || !fechaRegex.test(fecha_fin)) {
      return res.status(400).json({
        message: "Formato de fecha inválido. Use YYYY-MM-DD",
      });
    }

    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);
    if (inicio >= fin) {
      return res.status(400).json({
        message: "La fecha de inicio debe ser anterior a la fecha de fin",
      });
    }

    const result = await Semana.updateById(numero_semana, {
      id_periodo,
      fecha_inicio,
      fecha_fin,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Semana no encontrada",
      });
    }

    res.json({
      message: "Semana actualizada exitosamente",
      data: {
        numero_semana,
        id_periodo,
        fecha_inicio,
        fecha_fin,
      },
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({
        message: "El periodo especificado no existe",
      });
    }

    res.status(500).json({
      message: "Error al actualizar la semana",
      error: error.message,
    });
  }
};

export const deleteSemana = async (req, res) => {
  try {
    const { numero_semana } = req.params;
    const result = await Semana.removeById(numero_semana);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Semana no encontrada",
      });
    }

    res.json({
      message: "Semana eliminada exitosamente",
    });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "No se puede eliminar la semana porque tiene registros asociados (registro_clases, etc.)",
      });
    }

    res.status(500).json({
      message: "Error al eliminar la semana",
      error: error.message,
    });
  }
};

// 🔁 REGENERAR CALENDARIO DE SEMANAS
export const regenerarCalendarioSemanas = async (req, res) => {
  try {
    const {
      id_periodo,
      fecha_inicio,
      numero_semanas = 40,
    } = req.body;

    if (!id_periodo || !fecha_inicio) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: id_periodo y fecha_inicio (y opcional numero_semanas)",
      });
    }

    const nSemanas = Number(numero_semanas);
    if (Number.isNaN(nSemanas) || nSemanas <= 0 || nSemanas > 60) {
      return res.status(400).json({
        message: "numero_semanas debe estar entre 1 y 60",
      });
    }

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_inicio)) {
      return res.status(400).json({
        message: "Formato de fecha_inicio inválido. Use YYYY-MM-DD",
      });
    }

    const todas = await Semana.getAll();
    const semanasDelPeriodo = todas.filter(
      (s) => Number(s.id_periodo) === Number(id_periodo)
    );

    for (const s of semanasDelPeriodo) {
      await Semana.removeById(s.numero_semana);
    }

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const start = new Date(fecha_inicio);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        message: "fecha_inicio no es una fecha válida",
      });
    }

    const nuevasSemanas = [];

    for (let i = 0; i < nSemanas; i++) {
      const inicioSemana = new Date(start);
      inicioSemana.setDate(start.getDate() + i * 7);

      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);

      const fecha_inicio_str = formatDate(inicioSemana);
      const fecha_fin_str = formatDate(finSemana);

      const result = await Semana.create({
        id_periodo,
        fecha_inicio: fecha_inicio_str,
        fecha_fin: fecha_fin_str,
      });

      nuevasSemanas.push({
        numero_semana: result.insertId,
        id_periodo,
        fecha_inicio: fecha_inicio_str,
        fecha_fin: fecha_fin_str,
      });
    }

    return res.status(201).json({
      message: `Calendario de semanas regenerado correctamente para el período ${id_periodo}`,
      data: nuevasSemanas,
    });

  } catch (error) {
    console.error("Error al regenerar calendario de semanas:", error);

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({
        message: "El periodo especificado no existe",
      });
    }

    res.status(500).json({
      message: "Error al regenerar el calendario de semanas",
      error: error.message,
    });
  }
};
