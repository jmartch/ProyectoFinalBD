// backend/config/seedUsers.js
import db from "./db.js";        // el mismo db que usas en los modelos
import bcrypt from "bcrypt";

export async function seedInitialUsers() {
  try {
    // 1. Verificar si ya existen (para no duplicar)
    const [existing] = await db.query(
      `
      SELECT usuario 
      FROM usuario 
      WHERE usuario IN (?, ?, ?)
      `,
      [
        "admin@globalenglish.edu",
        "carlos.admin@globalenglish.edu",
        "ana.tutor@globalenglish.edu",
      ]
    );

    if (existing.length > 0) {
      console.log("👉 Usuarios de prueba ya existen, no se vuelven a crear.");
      return;
    }

    console.log("🌱 Sembrando usuarios de prueba...");

    // 2. Hashear contraseñas
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const tutorPasswordHash = await bcrypt.hash("tutor123", 10);

    // 3. Crear funcionarios (si no existen)
    // Usamos doc_funcionario "altos" para no chocarnos con otros
    await db.query(
      `
      INSERT IGNORE INTO funcionario 
        (doc_funcionario, tipo_doc, nombre1, nombre2, apellido1, apellido2, sexo, correo, telefono, fecha_contrato)
      VALUES
        (900001, 'CC', 'Global', '', 'Admin', '', 'M', 'admin@globalenglish.edu', '3000000001', '2024-01-01'),
        (900002, 'CC', 'Carlos', '', 'Admin', '', 'M', 'carlos.admin@globalenglish.edu', '3000000002', '2024-01-01'),
        (900003, 'CC', 'Ana', '', 'Tutor', '', 'F', 'ana.tutor@globalenglish.edu', '3000000003', '2024-01-01')
      `
    );

    // 4. Crear usuarios vinculados a esos funcionarios
    await db.query(
      `
      INSERT IGNORE INTO usuario (usuario, doc_funcionario, contraseña, rol)
      VALUES
        ('admin@globalenglish.edu',        900001, ?, 'Administrador'),
        ('carlos.admin@globalenglish.edu', 900002, ?, 'Administrativo'),
        ('ana.tutor@globalenglish.edu',    900003, ?, 'Tutor')
      `,
      [
        adminPasswordHash,  // para admin
        adminPasswordHash,  // para carlos (admin123 también)
        tutorPasswordHash,  // para ana tutor (tutor123)
      ]
    );

    console.log("✅ Usuarios de prueba creados correctamente.");
  } catch (err) {
    console.error("❌ Error al sembrar usuarios de prueba:", err);
  }
}
