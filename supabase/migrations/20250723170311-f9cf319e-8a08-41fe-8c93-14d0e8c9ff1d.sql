-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create agentsinfo table for agent-specific data
CREATE TABLE public.agentsinfo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  license_number TEXT,
  business_address TEXT,
  phone TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agentsinfo ENABLE ROW LEVEL SECURITY;

-- Create policies for agentsinfo
CREATE POLICY "Agents can view their own info" 
ON public.agentsinfo 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Agents can update their own info" 
ON public.agentsinfo 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Agents can insert their own info" 
ON public.agentsinfo 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all agent info" 
ON public.agentsinfo 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Add trigger for agentsinfo timestamps
CREATE TRIGGER update_agentsinfo_updated_at
BEFORE UPDATE ON public.agentsinfo
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update profiles table to have better role handling
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer';

-- Add trigger to create agent info when agent role is selected
CREATE OR REPLACE FUNCTION public.handle_agent_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- If the role is 'agent', create an entry in agentsinfo
  IF NEW.role = 'agent' THEN
    INSERT INTO public.agentsinfo (user_id, created_at, updated_at)
    VALUES (NEW.user_id, now(), now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_agent_profile_created
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_agent_signup();