import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, User, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Car {
  id: string;
  name: string;
  image_url?: string;
  price_per_day: number;
  description: string;
}

interface BookingFormProps {
  car: Car;
  onClose: () => void;
}

export function BookingForm({ car, onClose }: BookingFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
  });

  const calculateTotalAmount = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays * car.price_per_day;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      const totalAmount = calculateTotalAmount();
      
      if (totalAmount <= 0) {
        toast({
          title: "Invalid dates",
          description: "Please select valid pickup and drop-off dates.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create booking
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user?.id || null,
          car_id: car.id,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone,
          start_date: formData.startDate,
          end_date: formData.endDate,
          pickup_location: formData.pickupLocation,
          dropoff_location: formData.dropoffLocation,
          total_amount: totalAmount,
          payment_status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Booking error:', error);
        toast({
          title: "Booking failed",
          description: "There was an error creating your booking. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Booking created!",
        description: "Redirecting to payment...",
      });

      // Redirect to booking page for payment
      navigate(`/booking/${booking.id}`);
      onClose();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = calculateTotalAmount();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Book {car.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="customerEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customerPhone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Pickup Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">Drop-off Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickupLocation" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Pickup Location
              </Label>
              <Input
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                placeholder="123 Main St, City, State"
                required
              />
            </div>
            <div>
              <Label htmlFor="dropoffLocation" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Drop-off Location
              </Label>
              <Input
                id="dropoffLocation"
                name="dropoffLocation"
                value={formData.dropoffLocation}
                onChange={handleInputChange}
                placeholder="456 Oak Ave, City, State"
                required
              />
            </div>
          </div>

          {/* Price Summary */}
          {totalAmount > 0 && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Daily Rate:</span>
                <span>${car.price_per_day}/day</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Duration:</span>
                <span>{Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>${totalAmount}</span>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating Booking...' : 'Create Booking'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}