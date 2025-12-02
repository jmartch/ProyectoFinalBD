import * as asistenciaModel from "../models/ASISTENCIA.model.js";
import * as notaModel from "../models/NOTA.model.js";

export const getAsistenciaEstudiante = async (req, res) => {
  try {
    const { doc_estudiante } = req.params;
    const data = await asistenciaModel.getByEstudiante(doc_estudiante);
    res.json(data);
  } catch (error) {
    console.error("[REPORTES] Error asistencia:", error);
    res.status(500).json({ message: "Error obteniendo asistencia" });
  }
};

export const getBoletinCalificaciones = async (req, res) => {
  try {
    const { doc_estudiante } = req.params;
    const data = await notaModel.getByEstudiante(doc_estudiante);
    res.json(data);
  } catch (error) {
    console.error("[REPORTES] Error boletín:", error);
    res.status(500).json({ message: "Error obteniendo calificaciones" });
  }
};
