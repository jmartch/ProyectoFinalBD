//models/AULA_TUTOR.model.js
import db from "../config/db.js";

export default {
    getAll: async () => {
        const [rows] = await db.query("SELECT * FROM AULA_TUTOR");
        return rows;
    },

    getByKeys: async (id_aula, id_tutor, fecha_asignacion) => {
        const [rows] = await db.query(
            "SELECT * FROM AULA_TUTOR WHERE id_aula=? AND id_tutor=? AND fecha_asignacion=?",
            [id_aula, id_tutor, fecha_asignacion]
        );
        return rows[0];
    },

    create: async ({ id_aula, id_tutor, fecha_asignacion, fecha_fin }) => {
        const [result] = await db.query(
            "INSERT INTO AULA_TUTOR (id_aula, id_tutor, fecha_asignacion, fecha_fin) VALUES (?, ?, ?, ?)",
            [id_aula, id_tutor, fecha_asignacion, fecha_fin]
        );
        return result;
    },

    updateByKeys: async (id_aula, id_tutor, fecha_asignacion, { fecha_fin }) => {
        const [result] = await db.query(
            "UPDATE AULA_TUTOR SET fecha_fin=? WHERE id_aula=? AND id_tutor=? AND fecha_asignacion=?",
            [fecha_fin, id_aula, id_tutor, fecha_asignacion]
        );
        return result;
    },

    removeByKeys: async (id_aula, id_tutor, fecha_asignacion) => {
        const [result] = await db.query(
            "DELETE FROM AULA_TUTOR WHERE id_aula=? AND id_tutor=? AND fecha_asignacion=?",
            [id_aula, id_tutor, fecha_asignacion]
        );
        return result;
    }
};