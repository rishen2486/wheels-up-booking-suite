import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Users, Fuel, Settings, MapPin, Search, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import SearchCard from '@/components/SearchCard';

interface CarType {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  daily_rate: number;
  description: string;
  features: string[];
  image_urls: string[];
  location: string;
  available: boolean;
  transmission: string;
  fuel_type: string;
  seats: number;
}

export default function Cars() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchTerm, typeFilter, locationFilter, dateRange]);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('available', true)
        .order('name');

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cars.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCars = () => {
    let filtered = cars;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(car => car.type === typeFilter);
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(car => car.location === locationFilter);
    }

    // Date availability filter
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(car => {
        // For demo purposes, we'll assume all cars are available
        // In a real app, you'd check against existing bookings
        return true;
      });
    }

    setFilteredCars(filtered);
  };

  const handleBookNow = (carId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book a car.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    navigate(`/booking/${carId}`);
  };

  const getUniqueLocations = () => {
    return [...new Set(cars.map(car => car.location))];
  };

  const getCarTypes = () => {
    return [...new Set(cars.map(car => car.type))];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Find Your Perfect Car Online</h1>
          <p className="text-xl text-white/90">Choose from our wide selection of vehicles - book online instantly</p>
        </div>
      </div>

      {/* Search Card */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10 mb-8">
        <SearchCard />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Car type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {getCarTypes().map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {getUniqueLocations().map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
              placeholder="Select dates"
            />
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0 relative">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                  {car.image_urls && car.image_urls.length > 0 ? (
                    <img 
                      src={car.image_urls[0]} 
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Car className="h-16 w-16 text-primary" />
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">{car.type}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{car.name}</CardTitle>
                <p className="text-muted-foreground mb-4">{car.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {car.seats} seats
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Settings className="h-4 w-4 mr-2" />
                    {car.transmission}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Fuel className="h-4 w-4 mr-2" />
                    {car.fuel_type}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {car.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {car.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{car.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0 flex justify-between items-center">
                <div className="text-2xl font-bold text-primary">
                  ${car.daily_rate}
                  <span className="text-sm font-normal text-muted-foreground">/day</span>
                </div>
                <Button onClick={() => handleBookNow(car.id)}>
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No cars found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
}