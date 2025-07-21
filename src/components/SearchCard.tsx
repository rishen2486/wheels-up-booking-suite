import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function SearchCard() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!pickupLocation || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('search_requests')
        .insert({
          user_id: user?.id || null,
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation || pickupLocation,
          pickup_date: pickupDate,
          pickup_time: pickupTime,
          dropoff_date: dropoffDate,
          dropoff_time: dropoffTime
        });

      if (error) throw error;

      toast({
        title: "Search Saved",
        description: "Your search preferences have been saved successfully.",
      });

      // Clear form
      setPickupLocation('');
      setDropoffLocation('');
      setPickupDate('');
      setPickupTime('');
      setDropoffDate('');
      setDropoffTime('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save search preferences.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-elevated">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="pickup-location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Pickup Location *
            </Label>
            <Input
              id="pickup-location"
              placeholder="Enter pickup location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Pickup Date *
            </Label>
            <Input
              id="pickup-date"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup-time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pickup Time *
            </Label>
            <Input
              id="pickup-time"
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoff-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Drop-off Date *
            </Label>
            <Input
              id="dropoff-date"
              type="date"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoff-time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Drop-off Time *
            </Label>
            <Input
              id="dropoff-time"
              type="time"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="dropoff-location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Drop-off Location (Optional)
            </Label>
            <Input
              id="dropoff-location"
              placeholder="Same as pickup location"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={loading}
            className="w-full md:w-auto"
          >
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Searching...' : 'Search Cars'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}