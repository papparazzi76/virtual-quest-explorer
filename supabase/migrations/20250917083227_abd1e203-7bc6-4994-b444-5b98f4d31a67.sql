-- Crear tabla de usuarios (perfiles extendidos)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS en users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para users
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Tabla de hotspots
CREATE TABLE public.hotspots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene TEXT NOT NULL,
  yaw NUMERIC NOT NULL,
  pitch NUMERIC NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('info', 'quiz', 'coleccionable')),
  titulo TEXT NOT NULL,
  contenido TEXT,
  puntos INTEGER DEFAULT 0,
  media JSONB,
  opciones JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS en hotspots (públicos para lectura)
ALTER TABLE public.hotspots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hotspots" 
ON public.hotspots 
FOR SELECT 
USING (true);

-- Tabla de puntuaciones
CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  hotspot_id UUID REFERENCES public.hotspots(id) ON DELETE CASCADE,
  puntos INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, hotspot_id)
);

-- Habilitar RLS en scores
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scores" 
ON public.scores 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores" 
ON public.scores 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Vista del leaderboard (pública)
CREATE VIEW public.leaderboard AS
SELECT
  u.id as user_id,
  u.username,
  COALESCE(SUM(s.puntos), 0) as total_puntos,
  RANK() OVER (ORDER BY COALESCE(SUM(s.puntos), 0) DESC) as posicion
FROM public.users u
LEFT JOIN public.scores s ON u.id = s.user_id
GROUP BY u.id, u.username
ORDER BY total_puntos DESC;

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'username', 'Usuario' || substr(NEW.id::text, 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insertar algunos hotspots de ejemplo
INSERT INTO public.hotspots (scene, yaw, pitch, tipo, titulo, contenido, puntos) VALUES
('recepcion', 0, 0, 'info', 'Bienvenida', 'Descubre información sobre nuestra oficina', 10),
('recepcion', 90, -10, 'quiz', 'Quiz de Navidad', '¿Cuántos renos tiene Santa?', 25),
('oficina', 180, 0, 'coleccionable', 'Estrella Dorada', 'Has encontrado una estrella especial', 50);