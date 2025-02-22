
USE Mobilpos;

INSERT INTO dbo.cio_customers 
(nombre, apellidos, documento, telefono, email, direccion, ciudad, estado, tipo, fecha_creacion) 
VALUES 
('Juan', 'Pérez Gómez', '12345678', '3001234567', 'juan.perez@email.com', 'Calle 123 #45-67', 'Bogotá', 'Activo', 'Cliente', GETDATE()),
('María', 'López Rodríguez', '87654321', '3109876543', 'maria.lopez@email.com', 'Carrera 78 #90-12', 'Medellín', 'Activo', 'Cliente', GETDATE()),
('Carlos', 'González Silva', '23456789', '3205555555', 'carlos.gonzalez@email.com', 'Avenida 45 #23-56', 'Cali', 'Activo', 'Cliente', GETDATE()),
('Ana', 'Martínez Ruiz', '98765432', '3157777777', 'ana.martinez@email.com', 'Calle 67 #89-01', 'Barranquilla', 'Activo', 'Cliente', GETDATE()),
('Pedro', 'Ramírez Torres', '34567890', '3008888888', 'pedro.ramirez@email.com', 'Carrera 12 #34-56', 'Bucaramanga', 'Activo', 'Cliente', GETDATE());
