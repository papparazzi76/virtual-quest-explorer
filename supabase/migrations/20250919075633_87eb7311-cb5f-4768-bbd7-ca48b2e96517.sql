-- Crear tabla de tours para las diferentes oficinas
CREATE TABLE public.tours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  descripcion TEXT,
  imagen_portada TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en la tabla tours
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan ver los tours
CREATE POLICY "Tours are viewable by everyone" 
ON public.tours 
FOR SELECT 
USING (activo = true);

-- Agregar columna tour_id a la tabla hotspots
ALTER TABLE public.hotspots 
ADD COLUMN tour_id UUID REFERENCES public.tours(id);

-- Insertar los tours de las cuatro oficinas
INSERT INTO public.tours (nombre, ciudad, descripcion, imagen_portada) VALUES
('Tour Virtual Oficina Valladolid', 'Valladolid', 'Descubre nuestra moderna oficina en Valladolid con tecnología de vanguardia', 'https://fvqbzjiwaftlsbbikuin.supabase.co/storage/v1/object/public/scene-images/20250316_170423_829.jpg'),
('Tour Virtual Oficina Burgos', 'Burgos', 'Explora nuestras instalaciones en el corazón histórico de Burgos', 'https://fvqbzjiwaftlsbbikuin.supabase.co/storage/v1/object/public/scene-images/20250316_171037_423.jpg'),
('Tour Virtual Oficina León', 'León', 'Conoce nuestro espacio de trabajo colaborativo en León', 'https://fvqbzjiwaftlsbbikuin.supabase.co/storage/v1/object/public/scene-images/20250316_171119_677.jpg'),
('Tour Virtual Oficina Palencia', 'Palencia', 'Visita nuestra oficina estratégicamente ubicada en Palencia', 'https://fvqbzjiwaftlsbbikuin.supabase.co/storage/v1/object/public/scene-images/20250316_171434_722.jpg');

-- Crear función para actualizar timestamps automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Crear trigger para la tabla tours
CREATE TRIGGER update_tours_updated_at
BEFORE UPDATE ON public.tours
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();