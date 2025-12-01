-- 0. Borrar y crear de nuevo la base de datos
DROP DATABASE IF EXISTS global_english_db;
CREATE DATABASE global_english_db;
USE global_english_db;

-- 1. Tabla IED (ya con AUTO_INCREMENT)
CREATE TABLE ied (
  id_ied INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  telefono VARCHAR(15) NOT NULL,
  duracion TIME,
  hora_inicio TIME,
  hora_fin TIME,
  jornada VARCHAR(50)
);

INSERT INTO ied (nombre, telefono, duracion, hora_inicio, hora_fin, jornada)
VALUES ('IED Global Kids', '3000000000', '02:00:00', '07:00:00', '17:00:00', 'Jornada Única');

SELECT * FROM ied;

-- 2. Tabla SEDE (ahora sí con id_ied como FK)
CREATE TABLE sede (
  id_sede INT AUTO_INCREMENT PRIMARY KEY,
  id_ied INT NOT NULL,
  direccion VARCHAR(50) NOT NULL UNIQUE,
  tipo VARCHAR(50) NOT NULL,
  CONSTRAINT sede_ibfk_1
    FOREIGN KEY (id_ied) REFERENCES ied(id_ied)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

-- 3. Tabla PROGRAMA
CREATE TABLE programa (
  id_programa INT AUTO_INCREMENT PRIMARY KEY,
  nombre_programa VARCHAR(50) NOT NULL
);

-- 4. Tabla AULA
CREATE TABLE aula (
  id_aula INT AUTO_INCREMENT PRIMARY KEY,
  id_sede INT,
  id_programa INT,
  grado INT,
  FOREIGN KEY (id_sede) REFERENCES sede(id_sede)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_programa) REFERENCES programa(id_programa)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 5. Tabla HORARIO
CREATE TABLE horario (
  id_horario INT AUTO_INCREMENT PRIMARY KEY,
  dia_semana VARCHAR(50),
  hora_inicio TIME,
  horas_duracion INT
);

-- 6. Tabla ASIGNACION_AULA_HORARIO
CREATE TABLE asignacion_aula_horario (
  id_horario INT NOT NULL,
  id_aula INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  FOREIGN KEY (id_horario) REFERENCES horario(id_horario)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_aula) REFERENCES aula(id_aula)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (id_horario, id_aula, fecha_inicio)
);

-- 7. Tabla FUNCIONARIO
CREATE TABLE funcionario (
  doc_funcionario INT PRIMARY KEY,
  tipo_doc VARCHAR(50) NOT NULL,
  nombre1 VARCHAR(50) NOT NULL,
  nombre2 VARCHAR(50),
  apellido1 VARCHAR(50) NOT NULL,
  apellido2 VARCHAR(50),
  sexo CHAR(1),
  correo VARCHAR(50) NOT NULL,
  telefono VARCHAR(15) NOT NULL,
  fecha_contrato DATE NOT NULL
);

-- 8. Tabla ESTUDIANTE
CREATE TABLE estudiante (
  doc_estudiante INT PRIMARY KEY,
  tipo_doc VARCHAR(50) NOT NULL,
  nombre1 VARCHAR(50) NOT NULL,
  nombre2 VARCHAR(50),
  apellido1 VARCHAR(50) NOT NULL,
  apellido2 VARCHAR(50),
  sexo CHAR(1),
  correo_acudiente VARCHAR(50) NOT NULL,
  telefono_acudiente VARCHAR(15) NOT NULL
);

INSERT INTO matricula (id_aula, doc_estudiante, fecha_inicio, fecha_fin)
VALUES (6, 1001, '2025-01-01', NULL);

-- 9. Tabla TUTOR
CREATE TABLE tutor (
  id_tutor INT AUTO_INCREMENT PRIMARY KEY
);

-- 10. Tabla REGISTRO_TUTOR
CREATE TABLE registro_tutor (
  doc_funcionario INT NOT NULL,
  id_tutor INT NOT NULL,
  fecha_asignacion DATE NOT NULL,
  FOREIGN KEY (doc_funcionario) REFERENCES funcionario(doc_funcionario)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_tutor) REFERENCES tutor(id_tutor)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (doc_funcionario, id_tutor, fecha_asignacion)
);

-- 11. Tabla AULA_TUTOR
CREATE TABLE aula_tutor (
  id_aula INT NOT NULL,
  id_tutor INT NOT NULL,
  fecha_asignacion DATE NOT NULL,
  fecha_fin DATE,
  FOREIGN KEY (id_aula) REFERENCES aula(id_aula)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_tutor) REFERENCES tutor(id_tutor)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (id_aula, id_tutor, fecha_asignacion)
);

-- 12. Tabla USUARIO
CREATE TABLE usuario (
  usuario VARCHAR(50) PRIMARY KEY,
  doc_funcionario INT UNIQUE,
  contraseña VARCHAR(500) NOT NULL,
  rol VARCHAR(50) NOT NULL,
  FOREIGN KEY (doc_funcionario) REFERENCES funcionario(doc_funcionario)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 13. Tabla MATRICULA
CREATE TABLE matricula (
  id_aula INT,
  doc_estudiante INT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  FOREIGN KEY (doc_estudiante) REFERENCES estudiante(doc_estudiante)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_aula) REFERENCES aula(id_aula)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (doc_estudiante, id_aula, fecha_inicio)
);

-- 14. Tabla MOTIVO
CREATE TABLE motivo (
  codigo INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(100) NOT NULL
);

-- 15. Tabla PERIODO
CREATE TABLE periodo (
  id_periodo INT AUTO_INCREMENT PRIMARY KEY,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL
);

-- 16. Tabla SEMANA
CREATE TABLE semana (
  numero_semana INT AUTO_INCREMENT PRIMARY KEY,
  id_periodo INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  FOREIGN KEY (id_periodo) REFERENCES periodo(id_periodo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 17. Tabla REGISTRO_CLASES
CREATE TABLE registro_clases (
  num_registro INT AUTO_INCREMENT PRIMARY KEY,
  numero_semana INT NOT NULL,
  id_aula INT,
  codigo_motivo INT,
  fecha DATE NOT NULL,
  dictada BOOLEAN NOT NULL,
  is_festivo BOOLEAN NOT NULL,
  fecha_reposicion DATE,
  FOREIGN KEY (id_aula) REFERENCES aula(id_aula)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (codigo_motivo) REFERENCES motivo(codigo)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (numero_semana) REFERENCES semana(numero_semana)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 18. Tabla ASISTENCIA
CREATE TABLE asistencia (
  num_registro INT,
  doc_estudiante INT,
  asistio BOOLEAN NOT NULL,
  FOREIGN KEY (num_registro) REFERENCES registro_clases(num_registro)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (doc_estudiante) REFERENCES estudiante(doc_estudiante)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (num_registro, doc_estudiante)
);

-- 19. Tabla COMPONENTE
CREATE TABLE componente (
  id_componente INT AUTO_INCREMENT PRIMARY KEY,
  id_periodo INT,
  nombre VARCHAR(50) NOT NULL,
  porcentaje DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (id_periodo) REFERENCES periodo(id_periodo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 20. Tabla NOTA
CREATE TABLE nota (
  id_nota INT AUTO_INCREMENT PRIMARY KEY,
  doc_estudiante INT NOT NULL,
  definitiva DECIMAL(4,2) NOT NULL,
  FOREIGN KEY (doc_estudiante) REFERENCES estudiante(doc_estudiante)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 21. Tabla DETALLE_NOTA
CREATE TABLE detalle_nota (
  id_nota INT NOT NULL,
  id_componente INT NOT NULL,
  nota DECIMAL(4,2) NOT NULL,
  FOREIGN KEY (id_nota) REFERENCES nota(id_nota)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_componente) REFERENCES componente(id_componente)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (id_nota, id_componente)
);

-- 22. Tabla FESTIVO
CREATE TABLE festivo (
  id_festivo INT PRIMARY KEY,
  fecha DATE NOT NULL,
  descripcion VARCHAR(50) NOT NULL
);
