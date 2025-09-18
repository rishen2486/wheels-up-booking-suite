import { useState, useEffect } from "react";
import { ArrowRight, Star, Shield, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SearchBar, { SearchFilters } from "@/components/search/SearchBar";
import CarCard from "@/components/cars/CarCard";
import { BookingForm } from "@/components/BookingForm";
import Navbar from "@/components/layout/Navbar";
import { Link } from "react-router-dom";
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
  brand?: string;
  seats?: number;
  transmission?: string;
}

const Index = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch featured cars from Supabase
  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('available', true)
          .limit(3);

        if (error) {
          console.error('Error fetching cars:', error);
          toast({
            title: "Error loading cars",
            description: "Could not load featured cars. Please try again.",
            variant: "destructive",
          });
        } else {
          setFeaturedCars(data || []);
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

    fetchFeaturedCars();
  }, [toast]);

  const handleSearch = (filters: SearchFilters) => {
    // Navigate to Cars page with filters as query params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    window.location.href = `/cars?${params.toString()}`;
  };

  const handleBookNow = (car: Car) => {
    setSelectedCar(car);
    setIsBookingFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80')] bg-cover bg-center opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Premium Car Rental
            <span className="block bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
            Discover our premium fleet of vehicles and enjoy the freedom of the road. 
            From luxury sedans to spacious SUVs, find your perfect ride.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-5xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="premium" className="text-lg px-8 py-6" asChild>
              <Link to="/cars">
                Browse All Cars
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose CarsRus Rental?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience premium car rental with unmatched service and quality
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Star,
                title: "Premium Fleet",
                description: "Top-quality vehicles from leading brands, meticulously maintained for your comfort."
              },
              {
                icon: Shield,
                title: "Fully Insured",
                description: "Comprehensive insurance coverage and 24/7 roadside assistance for peace of mind."
              },
              {
                icon: Clock,
                title: "Instant Booking",
                description: "Book your perfect car in minutes with our streamlined reservation system."
              },
              {
                icon: Users,
                title: "Expert Support",
                description: "Professional customer service team ready to assist you every step of the way."
              }
            ].map((feature, index) => (
              <Card key={index} className="luxury-card text-center p-6">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Vehicles
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our handpicked selection of premium vehicles
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-lg">Loading featured cars...</p>
              </div>
            ) : featuredCars.length > 0 ? (
              featuredCars.map((car) => (
                <CarCard key={car.id} car={car} onBookNow={() => handleBookNow(car)} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No featured cars available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" className="px-8" asChild>
              <Link to="/cars">
                View All Cars
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 luxury-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of satisfied customers who trust CarsRus Rental for their transportation needs.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6" asChild>
            <Link to="/cars">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
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

export default Index;
