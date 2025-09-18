-- Create cars table
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  price_per_day DECIMAL(10,2) NOT NULL,
  description TEXT,
  features TEXT[],
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'canceled', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create car_availability table
CREATE TABLE IF NOT EXISTS public.car_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  google_event_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_availability ENABLE ROW LEVEL SECURITY;

-- Cars policies (public read, authenticated users can manage)
CREATE POLICY "Cars are viewable by everyone" ON public.cars FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create cars" ON public.cars FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update cars" ON public.cars FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Bookings policies (users can manage their own or anonymous bookings)
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Car availability policies (public read for availability checks)
CREATE POLICY "Availability is viewable by everyone" ON public.car_availability FOR SELECT USING (true);
CREATE POLICY "Anyone can create availability records" ON public.car_availability FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update availability records" ON public.car_availability FOR UPDATE USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON public.cars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample cars
INSERT INTO public.cars (name, image_url, price_per_day, description, features) VALUES
('Tesla Model 3', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop', 99.00, 'Electric luxury sedan with autopilot', ARRAY['Electric', 'Autopilot', 'Premium Interior', 'Supercharging']),
('BMW 3 Series', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', 85.00, 'Premium German engineering', ARRAY['Leather Seats', 'Navigation', 'Bluetooth', 'All-Wheel Drive']),
('Audi Q7', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 120.00, 'Luxury SUV perfect for families', ARRAY['7 Seats', '4WD', 'Panoramic Roof', 'Premium Sound']),
('Mercedes C-Class', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', 95.00, 'Elegant and comfortable ride', ARRAY['Luxury Interior', 'Mercedes-Benz User Experience', 'LED Headlights', 'Climate Control']);