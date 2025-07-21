-- Add user role types for agents and customers
UPDATE profiles SET role = 'customer' WHERE role = 'user';

-- Create a table for search/booking requests
CREATE TABLE public.search_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  dropoff_date DATE NOT NULL,
  dropoff_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.search_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for search requests
CREATE POLICY "Users can create search requests" 
ON public.search_requests 
FOR INSERT 
WITH CHECK (true); -- Allow both authenticated and anonymous users

CREATE POLICY "Users can view their own search requests" 
ON public.search_requests 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Agents can view all search requests" 
ON public.search_requests 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'agent'
));

-- Add trigger for search requests timestamps
CREATE TRIGGER update_search_requests_updated_at
BEFORE UPDATE ON public.search_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();