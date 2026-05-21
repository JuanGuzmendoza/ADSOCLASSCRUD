-- =======================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS Y TABLAS
-- Proyecto: CRUD de Facturas Pagadas a Empresas
-- Estructura: MySQL
-- =======================================================

-- 1. Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS sistema_facturas 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Seleccionar la base de datos para su uso
USE sistema_facturas;

-- 3. Crear la tabla 'facturas'
CREATE TABLE IF NOT EXISTS facturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_factura VARCHAR(50) NOT NULL UNIQUE,
    empresa VARCHAR(100) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago DATE NOT NULL,
    descripcion TEXT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Insertar registros de prueba iniciales (opcional pero recomendado para verificar funcionamiento)
INSERT INTO facturas (numero_factura, empresa, monto, fecha_pago, descripcion) VALUES
('FAC-1001', 'Microsoft Colombia S.A.S.', 1540.50, '2026-05-10', 'Pago de suscripción mensual de Azure Cloud y cuentas Office 365.'),
('FAC-1002', 'Amazon Web Services (AWS)', 2890.00, '2026-05-14', 'Costo de alojamiento de servidores de producción de la compañía.'),
('FAC-1003', 'Google LLC', 420.75, '2026-05-15', 'Servicios de Google Workspace e integraciones de mapas en el backend.'),
('FAC-1004', 'Oracle de Colombia', 5600.00, '2026-05-18', 'Licenciamiento de bases de datos empresariales y soporte técnico.'),
('FAC-1005', 'Adobe Systems Inc', 315.00, '2026-05-19', 'Licencias del equipo de diseño gráfico y desarrollo web.');
