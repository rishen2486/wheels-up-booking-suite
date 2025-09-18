-- Create tours table
CREATE TABLE public.tours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  hours INTEGER,
  region TEXT,
  details TEXT,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attractions table
CREATE TABLE public.attractions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT,
  hours INTEGER,
  details TEXT,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attractions ENABLE ROW LEVEL SECURITY;

-- Tours policies
CREATE POLICY "Tours are viewable by everyone" 
ON public.tours 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create tours" 
ON public.tours 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update tours" 
ON public.tours 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Attractions policies
CREATE POLICY "Attractions are viewable by everyone" 
ON public.attractions 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create attractions" 
ON public.attractions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update attractions" 
ON public.attractions 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Add triggers for updated_at
CREATE TRIGGER update_tours_updated_at
BEFORE UPDATE ON public.tours
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attractions_updated_at
BEFORE UPDATE ON public.attractions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add user_id to cars table if it doesn't exist
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add superuser column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS superuser BOOLEAN DEFAULT false;