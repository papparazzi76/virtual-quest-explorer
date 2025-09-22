-- Enable RLS on all tables that don't have it enabled
ALTER TABLE public.multimedia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oficinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pois ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_poi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Create basic policies for tables that need them
-- Most of these are read-only for public access since they contain office/tour data

-- Multimedia - public read access
CREATE POLICY "Multimedia is viewable by everyone" 
ON public.multimedia 
FOR SELECT 
USING (true);

-- Oficinas - public read access
CREATE POLICY "Oficinas are viewable by everyone" 
ON public.oficinas 
FOR SELECT 
USING (true);

-- POIs - public read access for active POIs
CREATE POLICY "Active POIs are viewable by everyone" 
ON public.pois 
FOR SELECT 
USING (activo = true);

-- Preguntas - public read access
CREATE POLICY "Preguntas are viewable by everyone" 
ON public.preguntas 
FOR SELECT 
USING (true);

-- Productos - public read access
CREATE POLICY "Productos are viewable by everyone" 
ON public.productos 
FOR SELECT 
USING (true);

-- Usuario_poi - users can only see their own progress
CREATE POLICY "Users can view their own poi progress" 
ON public.usuario_poi 
FOR SELECT 
USING (usuario_id = (auth.uid()::text)::integer);

CREATE POLICY "Users can insert their own poi progress" 
ON public.usuario_poi 
FOR INSERT 
WITH CHECK (usuario_id = (auth.uid()::text)::integer);

CREATE POLICY "Users can update their own poi progress" 
ON public.usuario_poi 
FOR UPDATE 
USING (usuario_id = (auth.uid()::text)::integer);

-- Usuarios - users can only see and update their own data
CREATE POLICY "Users can view their own usuario data" 
ON public.usuarios 
FOR SELECT 
USING (id = (auth.uid()::text)::integer);

CREATE POLICY "Users can update their own usuario data" 
ON public.usuarios 
FOR UPDATE 
USING (id = (auth.uid()::text)::integer);