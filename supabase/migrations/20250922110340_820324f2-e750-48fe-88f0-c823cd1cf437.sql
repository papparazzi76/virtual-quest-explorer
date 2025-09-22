-- Create daily_content table to manage daily POI content rotation
CREATE TABLE public.daily_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  poi_position INTEGER NOT NULL, -- Position 1-10 for the daily POIs
  poi_type TEXT NOT NULL CHECK (poi_type IN ('question', 'multimedia', 'google_review', 'product')),
  title TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL, -- Flexible content structure based on type
  points INTEGER DEFAULT 0,
  position_data JSONB NOT NULL, -- {yaw, pitch, scene, fixed_location}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tour_id, date, poi_position)
);

-- Enable RLS
ALTER TABLE public.daily_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Daily content is viewable by everyone" 
ON public.daily_content 
FOR SELECT 
USING (is_active = true);

-- Create daily_user_progress table to track user interactions
CREATE TABLE public.daily_user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  daily_content_id UUID NOT NULL REFERENCES public.daily_content(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  points_earned INTEGER DEFAULT 0,
  interaction_data JSONB, -- Store answers, time spent, etc.
  UNIQUE(user_id, daily_content_id)
);

-- Enable RLS
ALTER TABLE public.daily_user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user progress
CREATE POLICY "Users can view their own progress" 
ON public.daily_user_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.daily_user_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.daily_user_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_daily_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_content_updated_at
BEFORE UPDATE ON public.daily_content
FOR EACH ROW
EXECUTE FUNCTION public.update_daily_content_updated_at();

-- Insert sample daily content for each tour
INSERT INTO public.daily_content (tour_id, poi_position, poi_type, title, description, content, points, position_data) 
SELECT 
  t.id as tour_id,
  p.position,
  p.type,
  p.title,
  p.description,
  p.content::jsonb,
  p.points,
  p.position_data::jsonb
FROM public.tours t
CROSS JOIN (
  VALUES 
    -- Question POIs (positions 1-5)
    (1, 'question', 'Pregunta sobre seguridad', 'Conoce las normas de seguridad de la oficina', 
     '{"question": "¿Cuál es el protocolo de evacuación?", "options": ["Usar ascensor", "Usar escaleras", "Esperar ayuda", "Abrir ventanas"], "correct_answer": "Usar escaleras", "explanation": "En caso de emergencia, siempre usar las escaleras de evacuación."}',
     10, '{"yaw": 45, "pitch": -10, "scene": "recepcion", "fixed_location": "panel_seguridad"}'),
    (2, 'question', 'Pregunta sobre equipos', 'Identifica el equipo de trabajo', 
     '{"question": "¿Qué equipo se usa para presentaciones?", "options": ["Impresora", "Proyector", "Escáner", "Teléfono"], "correct_answer": "Proyector", "explanation": "El proyector es esencial para presentaciones efectivas."}',
     10, '{"yaw": 90, "pitch": 0, "scene": "sala_reuniones", "fixed_location": "mesa_presentaciones"}'),
    (3, 'question', 'Pregunta sobre oficina', 'Conoce tu espacio de trabajo', 
     '{"question": "¿Dónde se encuentra la impresora principal?", "options": ["Recepción", "Sala reuniones", "Oficina", "Cafetería"], "correct_answer": "Oficina", "explanation": "La impresora principal está en el área de oficina."}',
     10, '{"yaw": 180, "pitch": -5, "scene": "oficina", "fixed_location": "zona_impresora"}'),
    (4, 'question', 'Pregunta sobre recursos', 'Aprende sobre los recursos disponibles', 
     '{"question": "¿Qué recurso está disponible en la cafetería?", "options": ["WiFi", "Microondas", "Impresora", "Proyector"], "correct_answer": "Microondas", "explanation": "La cafetería cuenta con microondas para calentar alimentos."}',
     10, '{"yaw": 270, "pitch": -15, "scene": "cafeteria", "fixed_location": "area_cocina"}'),
    (5, 'question', 'Pregunta sobre normas', 'Conoce las normas de convivencia', 
     '{"question": "¿Cuál es el horario de silencio?", "options": ["9-11h", "14-16h", "Sin horario", "Todo el día"], "correct_answer": "14-16h", "explanation": "El horario de silencio es de 14 a 16h para concentración."}',
     10, '{"yaw": 315, "pitch": 5, "scene": "oficina", "fixed_location": "zona_trabajo"}'),
    
    -- Multimedia POIs (positions 6-8)
    (6, 'multimedia', 'Video corporativo', 'Conoce nuestra historia', 
     '{"type": "video", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ", "description": "Video institucional de la empresa"}',
     5, '{"yaw": 135, "pitch": 10, "scene": "recepcion", "fixed_location": "pantalla_principal"}'),
    (7, 'multimedia', 'Galería de fotos', 'Momentos especiales del equipo', 
     '{"type": "image_gallery", "images": ["https://via.placeholder.com/400x300?text=Equipo+1", "https://via.placeholder.com/400x300?text=Equipo+2"], "description": "Galería de momentos especiales"}',
     5, '{"yaw": 225, "pitch": 0, "scene": "cafeteria", "fixed_location": "mural_fotos"}'),
    (8, 'multimedia', 'Audio informativo', 'Escucha información importante', 
     '{"type": "audio", "url": "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", "description": "Información sobre los servicios"}',
     5, '{"yaw": 60, "pitch": -20, "scene": "oficina", "fixed_location": "punto_informacion"}'),
    
    -- Google Review POI (position 9)
    (9, 'google_review', 'Reseña en Google', 'Ayúdanos con tu opinión', 
     '{"google_review_url": "https://g.page/r/CRxJjKqQl8LKEBg/review", "message": "Tu opinión es importante para nosotros. ¡Déjanos una reseña!"}',
     15, '{"yaw": 0, "pitch": -10, "scene": "recepcion", "fixed_location": "mostrador_atencion"}'),
    
    -- Product POI (position 10)
    (10, 'product', 'Producto estrella', 'Descubre nuestro producto destacado', 
     '{"product_name": "Solución Digital Integral", "description": "Nuestro producto más innovador para la transformación digital", "benefits": ["Fácil implementación", "Soporte 24/7", "ROI garantizado"], "contact_info": "contacto@empresa.com"}',
     20, '{"yaw": 120, "pitch": 5, "scene": "sala_reuniones", "fixed_location": "expositor_productos"}')
) p(position, type, title, description, content, points, position_data)
WHERE t.activo = true;