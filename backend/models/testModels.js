// testModels.js
import db from "../config/db.js";

// IMPORTAR LOS 17 MODELOS
import IED from "./IED.model.js";
import SEDE from "./SEDE.model.js";
import FUNCIONARIO from "./FUNCIONARIO.model.js";
import USUARIO from "./USUARIO.model.js";
import ESTUDIANTE from "./ESTUDIANTE.model.js";
import MATRICULA from "./MATRICULA.model.js";
import TUTOR from "./TUTOR.model.js";
import REGISTRO_TUTOR from "./REGISTRO_TUTOR.model.js";
import AULA from "./AULA.model.js";
import HORARIO from "./HORARIO.model.js";
import REGISTRO_CLASES from "./REGISTRO_CLASES.model.js";
import MOTIVO from "./MOTIVO.model.js";
import NOTA from "./NOTA.model.js";
import DETALLE_NOTA from "./DETALLE_NOTA.model.js";
import PERIODO from "./PERIODO.model.js";
import COMPONENTE from "./COMPONENTE.model.js";
import ASISTENCIA from "./ASISTENCIA.model.js";


// --------------------------------------------------------------------
// FUNCIÓN GENÉRICA PARA TESTEAR MODELOS
// --------------------------------------------------------------------
async function testModel(name, model) {
  console.log(`\n==============================`);
  console.log(`🔍 Probando modelo: ${name}`);
  console.log(`==============================`);

  try {
    // Test GET ALL
    const all = await model.getAll();
    console.log(`✔️ getAll() OK — Registros: ${all.length}`);

  } catch (err) {
    console.error(`❌ Error en modelo ${name}:`, err.message);
  }
}


// --------------------------------------------------------------------
// MAIN
// --------------------------------------------------------------------
async function main() {
  try {
    const [rows] = await db.query("SELECT NOW() AS fecha");
    console.log("📌 Conexión OK — Fecha actual BD:", rows[0].fecha);
  } catch (err) {
    console.error("❌ Error conectando a la base de datos:", err.message);
    return;
  }

  // PROBAR MODELOS (los 17)
  await testModel("IED", IED);
  await testModel("SEDE", SEDE);
  await testModel("FUNCIONARIO", FUNCIONARIO);
  await testModel("USUARIO", USUARIO);
  await testModel("ESTUDIANTE", ESTUDIANTE);
  await testModel("MATRICULA", MATRICULA);
  await testModel("TUTOR", TUTOR);
  await testModel("REGISTRO_TUTORES", REGISTRO_TUTOR);
  await testModel("AULA", AULA);
  await testModel("HORARIO", HORARIO);
  await testModel("REGISTRO_CLASES", REGISTRO_CLASES);
  await testModel("MOTIVO", MOTIVO);
  await testModel("NOTA", NOTA);
  await testModel("DETALLE_NOTA", DETALLE_NOTA);
  await testModel("PERIODO", PERIODO);
  await testModel("COMPONENTE", COMPONENTE);
  await testModel("ASISTENCIA", ASISTENCIA);

  console.log("\n🎉 FIN DE PRUEBAS — TODO OK SI NO HAY ERRORES.");
}

main();
