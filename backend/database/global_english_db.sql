-- Active: 1763606210735@@127.0.0.1@3306@global_english_db
use global_english_db;

create table ied(
    id_ied int primary key,
    nombre varchar(50) not null,
    telefono varchar(15) not null,
    duracion time,
    hora_inicio time,
    hora_fin time,
    jornada varchar(50)
);

create table sede(
    id_sede int auto_increment primary key,
    id_ied int,
    direccion varchar(50) not null unique,
    tipo varchar(50) not null,
    foreign key (id_ied) references ied(id_ied)
        on delete cascade
        on update cascade
);

create table programa(
	id_programa int auto_increment primary key,
    nombre_programa varchar(50) not null
);

create table aula(
    id_aula int auto_increment primary key,
    id_sede int,
    id_programa int,
    grado int,
    foreign key (id_sede) references sede(id_sede)
        on delete cascade
        on update cascade,
	foreign key (id_programa) references programa(id_programa)
        on delete cascade
        on update cascade
);

create table horario(
    id_horario int auto_increment primary key,
    dia_semana varchar(50),
    hora_inicio time,
    horas_duracion int
);

create table asignario_aula_horario(
	id_horario int not null,
    id_aula int not null,
    fecha_inicio date,
    fecha_fin date,
    foreign key (id_horario) references horario(id_horario)
        on delete cascade
        on update cascade,
	foreign key (id_aula) references aula(id_aula)
        on delete cascade
        on update cascade,
	primary key (id_horario, id_aula)
);

create table funcionario(
    doc_funcionario int primary key,
    tipo_doc varchar(50) not null,
    nombre1 varchar(50) not null,
    nombre2 varchar(50),
    apellido1 varchar(50) not null,
    apellido2 varchar(50),
    sexo char(1),
    correo varchar(50) not null,
    telefono varchar(15) not null,
    fecha_contrato date not null
);

create table estudiante(
    doc_estudiante int primary key,
    tipo_doc varchar(50) not null,
    nombre1 varchar(50) not null,
    nombre2 varchar(50),
    apellido1 varchar(50) not null,
    apellido2 varchar(50),
    sexo char(1),
    correo_acudiente varchar(50) not null,
    telefono_acudiente varchar(15) not null
);

create table tutor(
    id_tutor int auto_increment primary key
);

create table registro_tutores(
    doc_funcionario int,
    id_tutor int,
    fecha_asignacion date not null,
    foreign key (doc_funcionario) references funcionario(doc_funcionario)
        on delete cascade
        on update cascade,
    foreign key (id_tutor) references tutor(id_tutor)
        on delete cascade
        on update cascade,
    primary key (doc_funcionario, id_tutor)
);


create table usuario(
    usuario varchar(50) primary key,
    doc_funcionario int unique,
    contraseña varchar(500) not null,
    rol varchar(50) not null,
    foreign key (doc_funcionario) references funcionario(doc_funcionario)
        on delete cascade
        on update cascade
);

DROP TABLE IF EXISTS usuario;

create table matricula(
    id_ied int,
    doc_estudiante int,
    fecha_inicio date not null,
    fecha_fin date not null,
    foreign key (doc_estudiante) references estudiante(doc_estudiante)
        on delete cascade
        on update cascade,
    foreign key (id_ied) references ied(id_ied)
        on delete cascade
        on update cascade,
    primary key (doc_estudiante, id_ied)
);

create table motivo(
    codigo int auto_increment primary key,
    descripcion varchar(100) not null
);

create table periodo(
    id_periodo int auto_increment primary key,
    fecha_inicio date not null,
    fecha_fin date not null
);

create table semana(
	numero_semana int auto_increment primary key,
    id_periodo int not null,
    fecha_inicio date not null,
    fecha_fin date not null,
    foreign key (id_periodo) references periodo(id_periodo)
        on delete cascade
        on update cascade
);

create table registro_clases(
    num_registro int auto_increment primary key,
    numero_semana int not null,
    id_aula int,
    codigo_motivo int,
    fecha date not null,
    dictada boolean not null,
    is_festivo boolean not null,
    fecha_reposicion date,
    foreign key (id_aula) references aula(id_aula)
        on delete cascade
        on update cascade,
    foreign key (codigo_motivo) references motivo(codigo)
        on delete cascade
        on update cascade,
	foreign key (numero_semana) references semana(numero_semana)
        on delete cascade
        on update cascade
);

create table asistencia(
    num_registro int,
    doc_estudiante int,
    asistio boolean not null,
    foreign key (num_registro) references registro_clases(num_registro)
        on delete cascade
        on update cascade,
    foreign key (doc_estudiante) references estudiante(doc_estudiante)
        on delete cascade
        on update cascade,
    primary key (num_registro, doc_estudiante)
);

create table componente(
    id_componente int auto_increment primary key,
    id_periodo int,
    nombre varchar(50) not null,
    porcentaje decimal(5,2) not null,
    foreign key (id_periodo) references periodo(id_periodo)
        on delete cascade
        on update cascade
);

create table nota(
    id_nota int auto_increment primary key,
    doc_estudiante int not null,
    definitiva decimal(4,2) not null,
    foreign key (doc_estudiante) references estudiante(doc_estudiante)
        on delete cascade
        on update cascade
);

create table detalle_nota(
    id_nota int not null,
    id_componente int not null,
    nota decimal(4,2) not null,
    foreign key (id_nota) references nota(id_nota)
        on delete cascade
        on update cascade,
    foreign key (id_componente) references componente(id_componente)
        on delete cascade
        on update cascade,
    primary key (id_nota, id_componente)
);

create table festivo(
	id_festivo int primary key,
    fecha date not null,
    descripcion varchar(50) not null
);
