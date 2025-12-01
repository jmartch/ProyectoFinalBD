// controllers/SEDE.controller.js
import Sede from "../models/SEDE.model.js";

export const getSedes = async (req, res) => {
  try {
    const { id_ied } = req.query;
    let sedes;

    if (id_ied) {
      sedes = await Sede.getByIed(id_ied);
    } else {
      sedes = await Sede.getAll();
    }

    res.json(sedes);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener sedes",
      error: error.message,
    });
  }
};

export const createSede = async (req, res) => {
  try {
    const { id_ied, direccion, tipo } = req.body;

    if (!id_ied || !direccion || !tipo) {
      return res.status(400).json({
        message: "Faltan campos requeridos: id_ied, direccion, tipo",
      });
    }

    if (direccion.length > 50) {
      return res.status(400).json({
        message: "La dirección no puede exceder 50 caracteres",
      });
    }

    const result = await Sede.create({ id_ied, direccion, tipo });

    res.status(201).json({
      message: "Sede creada exitosamente",
      data: {
        id_sede: result.insertId,
        id_ied,
        direccion,
        tipo,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Ya existe una sede con esa dirección",
      });
    }
    res.status(500).json({
      message: "Error al crear la sede",
      error: error.message,
    });
  }
};
