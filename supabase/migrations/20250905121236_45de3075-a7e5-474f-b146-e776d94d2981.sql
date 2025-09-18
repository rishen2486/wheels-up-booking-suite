-- Add missing columns to cars table for detailed car management
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS brand text,
ADD COLUMN IF NOT EXISTS seats integer,
ADD COLUMN IF NOT EXISTS transmission text CHECK (transmission IN ('manual', 'automatic')),
ADD COLUMN IF NOT EXISTS large_bags integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS small_bags integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS mileage text,
ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}';

-- Create storage bucket for car photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-photos', 'car-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for car-photos storage bucket
CREATE POLICY "Car photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'car-photos');

CREATE POLICY "Authenticated users can upload car photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'car-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update car photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'car-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete car photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'car-photos' AND auth.uid() IS NOT NULL);