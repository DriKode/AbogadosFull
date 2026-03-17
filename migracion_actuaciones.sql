-- Migración para añadir los nuevos campos a la tabla actuaciones

ALTER TABLE actuaciones 
ADD COLUMN IF NOT EXISTS nurej TEXT,
ADD COLUMN IF NOT EXISTS juzgado TEXT,
ADD COLUMN IF NOT EXISTS fecha_inicio_demanda DATE,
ADD COLUMN IF NOT EXISTS demandante TEXT,
ADD COLUMN IF NOT EXISTS demandado TEXT;
