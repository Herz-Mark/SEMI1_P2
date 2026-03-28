CREATE DATABASE taskflow_db;

-- 1. Tabla de Usuarios
CREATE TABLE users (
    uid INT IDENTITY(1,1) PRIMARY KEY, 
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image_url VARCHAR(500)
);

-- 2. Tabla de Tareas
CREATE TABLE tasks (
    task_id INT IDENTITY(1,1) PRIMARY KEY,
    uid INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    creation_date DATETIME DEFAULT GETDATE(), 
    status VARCHAR(20) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'completada')), 
    
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

-- 3. Tabla de Archivos
CREATE TABLE files (
    file_id INT IDENTITY(1,1) PRIMARY KEY,
    uid INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    creation_date DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);