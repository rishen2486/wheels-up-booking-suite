import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchCard from '@/components/SearchCard';

export default function Tour() {
  const tours = [
    {
      id: 1,
      name: "City Heritage Tour",
      duration: "4 hours",
      capacity: "Up to 8 people",
      rating: 4.8,
      description: "Explore the historic landmarks and cultural sites of the city with our guided tour.",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6b?w=500&h=300&fit=crop",
      price: 75
    },
    {
      id: 2,
      name: "Coastal Drive Experience",
      duration: "6 hours",
      capacity: "Up to 6 people",
      rating: 4.9,
      description: "Scenic coastal drive with stunning ocean views and beach stops.",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop",
      price: 120
    },
    {
      id: 3,
      name: "Mountain Adventure",
      duration: "8 hours",
      capacity: "Up to 4 people",
      rating: 4.7,
      description: "Off-road mountain adventure with breathtaking panoramic views.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      price: 180
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Online Guided Car Tours</h1>
          <p className="text-xl text-white/90">Book amazing destinations and driving experiences through our platform</p>
        </div>
      </div>

      {/* Search Card */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10 mb-8">
        <SearchCard />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{tour.name}</CardTitle>
                <p className="text-muted-foreground mb-4">{tour.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {tour.duration}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {tour.capacity}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-2 fill-primary text-primary" />
                    {tour.rating} rating
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-primary">
                    ${tour.price}
                    <span className="text-sm font-normal text-muted-foreground">/tour</span>
                  </div>
                  <Button asChild>
                    <Link to="/cars">Book Tour</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}