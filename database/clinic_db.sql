CREATE DATABASE clinic_db;
USE clinic_db;

-- Tabla Pacientes
CREATE TABLE pacientes (
	id_paciente INT auto_increment PRIMARY KEY,
    nombre1 VARCHAR(50) NOT NULL,
    nombre2 VARCHAR(50),
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50),
    apellido_casado VARCHAR(50),
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(50),
    telefono VARCHAR(15),
    genero ENUM('Masculino', 'Femenino', 'Otro'),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Doctores
CREATE TABLE doctores (
 id_doctor INT auto_increment PRIMARY KEY,
 nombre VARCHAR(100) NOT NULL
);

-- Tabla Consulta
CREATE TABLE Consultas(
 id_consulta INT auto_increment PRIMARY KEY,
 id_paciente INT NOT NULL,
 fecha_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- ES automatico no lo inserta el cliente
 motivo_consulta TEXT NOT NULL,
 historial_enfermedad text NOT NULL,
 presion_arterial VARCHAR(20),
 frecuencia_cardiaca VARCHAR(20),
 peso DECIMAL(5,2),
 altura DECIMAL(5,2),
 FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

-- Tabla Citas
CREATE TABLE Citas(
 id_citas INT auto_increment PRIMARY KEY,
 id_paciente INT NOT NULL,
 id_consulta INT NOT NULL,
 id_doctor INT NOT NULL,
 proxima_cita DATE NOT NULL,
 FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
 FOREIGN KEY (id_consulta) REFERENCES consultas(id_consulta) ON DELETE CASCADE,
 FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor)
);

-- Tabla Antecedentes Médicos
CREATE TABLE antecedentes (
	id_antecedente INT auto_increment PRIMARY KEY,
    id_paciente INT NOT NULL,
    descripcion TEXT NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

-- Tabla de Tratamiento
CREATE TABLE tratamiento (
	id_tratamiento INT auto_increment PRIMARY KEY,
    descripcion TEXT NOT NULL,
    id_consulta INT NOT NULL,
    FOREIGN KEY (id_consulta) REFERENCES consultas(id_consulta)
);

-- Tabla Examen
CREATE TABLE tipo_examen(
 id_tipo_examen INT auto_increment PRIMARY KEY,
 nombre_examen VARCHAR(50) NOT NULL
);

-- Tabla Examen médico
CREATE TABLE examen_medico(
 id_examen INT auto_increment PRIMARY KEY,
 descripcion TEXT NOT NULL,
 id_tipo_examen INT,
 FOREIGN KEY(id_tipo_examen) REFERENCES tipo_examen(id_tipo_examen) ON DELETE CASCADE
);
select * from pacientes;
select * from consultas;
select * from doctores;
