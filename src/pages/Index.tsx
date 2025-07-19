import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Star, Shield, Clock, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FeaturedCar {
  id: string;
  name: string;
  daily_rate: number;
  type: string;
  location: string;
  features: string[];
}

const Index = () => {
  const [featuredCars, setFeaturedCars] = useState<FeaturedCar[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      const { data } = await supabase
        .from('cars')
        .select('id, name, daily_rate, type, location, features')
        .eq('available', true)
        .limit(3);
      
      setFeaturedCars(data || []);
    } catch (error) {
      console.error('Error fetching featured cars:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Rent Your Perfect Car
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Choose from our premium fleet of vehicles and hit the road with confidence. 
            Book online in minutes and enjoy competitive rates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cars">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Browse All Cars
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {!user && (
              <Link to="/auth?mode=signup">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Sign Up Free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose RentCars?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make car rental simple, reliable, and affordable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Premium Fleet</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Choose from our carefully maintained fleet of modern vehicles from top brands
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Fully Insured</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  All rentals include comprehensive insurance coverage for your peace of mind
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Our customer support team is available around the clock to assist you
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Vehicles</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Popular choices from our premium fleet
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                    <Car className="h-16 w-16 text-primary" />
                    <Badge className="absolute top-4 right-4">{car.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2">{car.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {car.location}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {car.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-primary">
                      ${car.daily_rate}
                      <span className="text-sm font-normal text-muted-foreground">/day</span>
                    </div>
                    <Link to={`/book/${car.id}`}>
                      <Button>Book Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/cars">
              <Button size="lg" variant="outline">
                View All Cars
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                No hidden fees, no surprises. What you see is what you pay.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-success mr-3" />
                  <span>Free cancellation up to 24 hours</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-success mr-3" />
                  <span>No booking fees</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-success mr-3" />
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-success mr-3" />
                  <span>Fuel included in selected packages</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-64 h-64 bg-gradient-primary rounded-full">
                <Car className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of satisfied customers and book your perfect car today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cars">
              <Button size="lg">
                Start Booking
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {!user && (
              <Link to="/auth?mode=signup">
                <Button size="lg" variant="outline">
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
