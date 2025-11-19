import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'global_kids',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true // Importante para ejecutar triggers y procedures
});

// Exportar con promesas
const db = pool.promise();

// Función para inicializar y verificar la base de datos
export async function initializeDatabase() {
  try {
    console.log('Conexión exitosa a MySQL');
    console.log(`Base de datos: ${process.env.DB_NAME}`);
    console.log(``);
  } catch (error) {
    console.error('Error conectando a la base de datos:', error.message);
    console.error('Verifica que MySQL esté corriendo y las credenciales en .env sean correctas');
    process.exit(1);
  }
}

export default db;