-- Create storage bucket for 360-degree scene images
INSERT INTO storage.buckets (id, name, public)
VALUES ('scene-images', 'scene-images', true);

-- Create RLS policies for scene images bucket
CREATE POLICY "Scene images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'scene-images');

CREATE POLICY "Authenticated users can upload scene images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'scene-images' AND auth.role() = 'authenticated');