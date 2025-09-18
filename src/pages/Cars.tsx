import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SearchBar, { SearchFilters } from "@/components/search/SearchBar";
import CarCard from "@/components/cars/CarCard";
import { BookingForm } from "@/components/BookingForm";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Car {
  id: string;
  name: string;
  image_url?: string;
  price_per_day: number;
  description: string;
  features?: string[];
  available: boolean;
}

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [sortBy, setSortBy] = useState("price");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([50, 150]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const categories = ["Economy", "Compact", "Midsize", "Luxury", "SUV", "Electric"];

  // Get initial filters from URL params
  const getFiltersFromURL = (): Partial<SearchFilters> => {
    const searchParams = new URLSearchParams(location.search);
    return {
      country: searchParams.get('country') || '',
      location: searchParams.get('location') || '',
      pickupDate: searchParams.get('pickupDate') || '',
      pickupTime: searchParams.get('pickupTime') || '',
      returnDate: searchParams.get('returnDate') || '',
      returnTime: searchParams.get('returnTime') || '',
      carType: searchParams.get('carType') || '',
    };
  };

  // Fetch cars from Supabase with filters
  const fetchCars = async (filters?: Partial<SearchFilters>) => {
    try {
      let query = supabase
        .from('cars')
        .select('*')
        .eq('available', true);

      // Apply filters if provided
      if (filters?.country) {
        // Note: We'll need to add country column to cars table
        // For now, we'll filter in the frontend
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching cars:', error);
        toast({
          title: "Error loading cars",
          description: "Could not load available cars. Please try again.",
          variant: "destructive",
        });
      } else {
        setCars(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading cars.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load with URL filters
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    if (Object.values(urlFilters).some(v => v)) {
      setSearchFilters(urlFilters as SearchFilters);
    }
    fetchCars(urlFilters);
  }, [location.search, toast]);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    fetchCars(filters);
  };

  const handleClearFilters = () => {
    setSearchFilters(null);
    setSelectedCategories([]);
    setPriceRange([50, 150]);
    navigate('/cars', { replace: true });
    fetchCars();
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleBookNow = (car: Car) => {
    setSelectedCar(car);
    setIsBookingFormOpen(true);
  };

  const filteredCars = cars.filter(car => {
    // Filter by price range
    if (car.price_per_day < priceRange[0] || car.price_per_day > priceRange[1]) {
      return false;
    }
    
    // Filter by search terms (if any)
    if (searchFilters) {
      const searchLower = searchFilters.location?.toLowerCase() || '';
      const carName = car.name.toLowerCase();
      const carDescription = (car.description || '').toLowerCase();
      
      if (searchLower && !carName.includes(searchLower) && !carDescription.includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price_per_day - b.price_per_day;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-lg">Loading available cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-luxury py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your Perfect Car
            </h1>
            <p className="text-xl text-white/90">
              Choose from our premium fleet of vehicles
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} initialFilters={getFiltersFromURL()} />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {sortedCars.length} cars found
              </span>
              <div className="border-l border-border pl-4 flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            {showFilters && (
              <div className="lg:col-span-1">
                <Card className="luxury-card p-6 sticky top-8">
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold mb-4 flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Label>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Price Range (per day)</Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={200}
                        min={25}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleClearFilters}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Car Grid */}
            <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {sortedCars.map((car) => (
                  <CarCard 
                    key={car.id} 
                    car={car} 
                    onBookNow={() => handleBookNow(car)}
                  />
                ))}
              </div>

              {sortedCars.length === 0 && (
                <Card className="luxury-card p-12 text-center">
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search criteria
                    </p>
                    <Button 
                      variant="outline"
                      onClick={handleClearFilters}
                    >
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Your Car</DialogTitle>
          </DialogHeader>
          {selectedCar && (
            <BookingForm 
              car={selectedCar} 
              onClose={() => setIsBookingFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cars;