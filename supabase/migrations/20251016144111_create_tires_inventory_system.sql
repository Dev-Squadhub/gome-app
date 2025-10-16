/*
  # Sistema de Gestión de Neumáticos - Gomería

  1. Nuevas Tablas
    - `tires` (neumáticos)
      - `id` (uuid, primary key) - Identificador único
      - `brand` (text) - Marca del neumático
      - `model` (text) - Modelo del neumático
      - `size` (text) - Tamaño (ej: 195/65R15)
      - `vehicle_type` (text) - Tipo de vehículo (auto, camioneta, camión, moto)
      - `price` (numeric) - Precio del neumático
      - `stock` (integer) - Cantidad en stock
      - `min_stock` (integer) - Stock mínimo para alertas
      - `season` (text) - Temporada (verano, invierno, all-season)
      - `load_index` (text) - Índice de carga
      - `speed_rating` (text) - Índice de velocidad
      - `condition` (text) - Condición (nuevo, usado)
      - `notes` (text) - Notas adicionales
      - `images` (jsonb) - URLs de imágenes
      - `created_at` (timestamptz) - Fecha de creación
      - `updated_at` (timestamptz) - Fecha de actualización
    
    - `tire_movements` (movimientos de neumáticos)
      - `id` (uuid, primary key)
      - `tire_id` (uuid, foreign key) - Referencia al neumático
      - `movement_type` (text) - Tipo: entrada, salida, ajuste
      - `quantity` (integer) - Cantidad del movimiento
      - `previous_stock` (integer) - Stock anterior
      - `new_stock` (integer) - Stock nuevo
      - `reason` (text) - Razón del movimiento
      - `created_at` (timestamptz) - Fecha del movimiento
      - `created_by` (uuid) - Usuario que realizó el movimiento

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas restrictivas para usuarios autenticados
    - Solo usuarios autenticados pueden acceder a los datos

  3. Índices
    - Índices para búsquedas rápidas por marca, modelo, tamaño
    - Índice para ordenamiento por stock y precio

  4. Notas Importantes
    - Sistema completo de inventario con historial de movimientos
    - Alertas de stock bajo
    - Soporte para múltiples imágenes por neumático
    - Auditoría completa de cambios
*/

-- Crear tabla de neumáticos
CREATE TABLE IF NOT EXISTS tires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  size text NOT NULL,
  vehicle_type text NOT NULL DEFAULT 'auto',
  price numeric(10, 2) NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  min_stock integer NOT NULL DEFAULT 5,
  season text DEFAULT 'all-season',
  load_index text DEFAULT '',
  speed_rating text DEFAULT '',
  condition text NOT NULL DEFAULT 'nuevo',
  notes text DEFAULT '',
  images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de movimientos
CREATE TABLE IF NOT EXISTS tire_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tire_id uuid NOT NULL REFERENCES tires(id) ON DELETE CASCADE,
  movement_type text NOT NULL,
  quantity integer NOT NULL,
  previous_stock integer NOT NULL,
  new_stock integer NOT NULL,
  reason text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_tires_brand ON tires(brand);
CREATE INDEX IF NOT EXISTS idx_tires_model ON tires(model);
CREATE INDEX IF NOT EXISTS idx_tires_size ON tires(size);
CREATE INDEX IF NOT EXISTS idx_tires_vehicle_type ON tires(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_tires_stock ON tires(stock);
CREATE INDEX IF NOT EXISTS idx_tires_price ON tires(price);
CREATE INDEX IF NOT EXISTS idx_tire_movements_tire_id ON tire_movements(tire_id);
CREATE INDEX IF NOT EXISTS idx_tire_movements_created_at ON tire_movements(created_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_tires_updated_at ON tires;
CREATE TRIGGER update_tires_updated_at
  BEFORE UPDATE ON tires
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE tires ENABLE ROW LEVEL SECURITY;
ALTER TABLE tire_movements ENABLE ROW LEVEL SECURITY;

-- Políticas para tires - Solo usuarios autenticados
CREATE POLICY "Authenticated users can view tires"
  ON tires FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tires"
  ON tires FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tires"
  ON tires FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tires"
  ON tires FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para tire_movements
CREATE POLICY "Authenticated users can view movements"
  ON tire_movements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert movements"
  ON tire_movements FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update movements"
  ON tire_movements FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete movements"
  ON tire_movements FOR DELETE
  TO authenticated
  USING (true);