
USE Mobilpos;

INSERT INTO dbo.cio_customers 
(nombre, apellido, id_tipo_documento, numero_documento, razon_social, telefono, email, direccion, id_ciudad, estado, fecha_creacion, fecha_actualizacion, master_detail) 
VALUES 
('Juan', 'Pérez Gómez', 1, '12345678', 'Juan Pérez Gómez', '3001234567', 'juan.perez@email.com', 'Calle 123 #45-67', 1, 1, GETDATE(), NULL, 'M'),
('María', 'López Rodríguez', 1, '87654321', 'María López Rodríguez', '3109876543', 'maria.lopez@email.com', 'Carrera 78 #90-12', 2, 1, GETDATE(), NULL, 'M'),
('Carlos', 'González Silva', 1, '23456789', 'Carlos González Silva', '3205555555', 'carlos.gonzalez@email.com', 'Avenida 45 #23-56', 3, 1, GETDATE(), NULL, 'M'),
('Ana', 'Martínez Ruiz', 1, '98765432', 'Ana Martínez Ruiz', '3157777777', 'ana.martinez@email.com', 'Calle 67 #89-01', 4, 1, GETDATE(), NULL, 'M'),
('Pedro', 'Ramírez Torres', 1, '34567890', 'Pedro Ramírez Torres', '3008888888', 'pedro.ramirez@email.com', 'Carrera 12 #34-56', 5, 1, GETDATE(), NULL, 'M');
