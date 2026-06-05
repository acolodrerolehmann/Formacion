-- Schema para VoyageR — Agencia de Viajes
-- Este fichero se ejecuta automáticamente al inicializar PostgreSQL

CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    destination VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    departure_date DATE NOT NULL,
    duration_days INTEGER NOT NULL,
    available_seats INTEGER NOT NULL DEFAULT 20,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Datos seed: viajes de ejemplo
INSERT INTO trips (title, description, destination, price, departure_date, duration_days, available_seats, image_url) VALUES
('Explorando Tokio', 'Sumérgete en la cultura japonesa: templos ancestrales, tecnología futurista y la mejor gastronomía del mundo.', 'Tokio, Japón', 2899.99, '2025-03-15', 10, 16, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'),
('Atardecer en Santorini', 'Casas blancas, cúpulas azules y los atardeceres más espectaculares del Mediterráneo.', 'Santorini, Grecia', 1599.00, '2025-06-01', 7, 20, 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800'),
('Machu Picchu y el Valle Sagrado', 'Camina por el Inca Trail hasta la ciudadela perdida de los Incas. Una experiencia única.', 'Cusco, Perú', 3200.00, '2025-05-10', 12, 12, 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800'),
('Safari en Kenia', 'Observa los Big Five en su hábitat natural. Masai Mara, Amboseli y Tsavo en un solo viaje.', 'Nairobi, Kenia', 4100.00, '2025-07-20', 9, 8, 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800'),
('Auroras Boreales en Islandia', 'Cascadas, géiseres, glaciares y auroras boreales. La isla de hielo y fuego te espera.', 'Reikiavik, Islandia', 2750.00, '2025-11-05', 8, 14, 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800'),
('Nueva York: La Ciudad que Nunca Duerme', 'Broadway, Central Park, Estatua de la Libertad y la mejor pizza del mundo.', 'Nueva York, USA', 1899.99, '2025-04-18', 6, 24, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800'),
('Relax en Bali', 'Templos, arrozales, playas paradisíacas y spas. El destino perfecto para desconectar.', 'Bali, Indonesia', 2100.00, '2025-09-12', 11, 18, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'),
('Patagonia Salvaje', 'Torres del Paine, Perito Moreno y los paisajes más impresionantes del fin del mundo.', 'El Calafate, Argentina', 3500.00, '2025-12-01', 14, 10, 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800'),
('Marrakech y el Desierto', 'Zocos, riads, el Atlas y una noche bajo las estrellas en el Sahara.', 'Marrakech, Marruecos', 1350.00, '2025-10-08', 7, 22, 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800'),
('Fiordos Noruegos', 'Navega entre acantilados vertiginosos y pueblos vikingos en los fiordos más espectaculares de Europa.', 'Bergen, Noruega', 2650.00, '2025-08-03', 9, 15, 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800');
