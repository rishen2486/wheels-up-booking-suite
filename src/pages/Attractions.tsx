import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Camera, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchCard from '@/components/SearchCard';

export default function Attractions() {
  const attractions = [
    {
      id: 1,
      name: "Historic Downtown District",
      category: "Cultural",
      distance: "5 minutes drive",
      rating: 4.6,
      description: "Charming historic district with museums, galleries, and local restaurants.",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop",
      highlights: ["Museums", "Art Galleries", "Local Dining"]
    },
    {
      id: 2,
      name: "Sunset Beach",
      category: "Nature",
      distance: "15 minutes drive",
      rating: 4.8,
      description: "Beautiful sandy beach perfect for swimming, sunbathing, and sunset viewing.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop",
      highlights: ["Swimming", "Beach Sports", "Sunset Views"]
    },
    {
      id: 3,
      name: "Mountain Viewpoint",
      category: "Adventure",
      distance: "45 minutes drive",
      rating: 4.9,
      description: "Breathtaking mountain viewpoint accessible by scenic mountain roads.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      highlights: ["Hiking Trails", "Photography", "Scenic Drive"]
    },
    {
      id: 4,
      name: "Shopping Center Plaza",
      category: "Shopping",
      distance: "10 minutes drive",
      rating: 4.4,
      description: "Modern shopping center with international brands and dining options.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
      highlights: ["Shopping", "Restaurants", "Entertainment"]
    },
    {
      id: 5,
      name: "Wine Country Tours",
      category: "Leisure",
      distance: "30 minutes drive",
      rating: 4.7,
      description: "Rolling vineyards and award-winning wineries in the countryside.",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500&h=300&fit=crop",
      highlights: ["Wine Tasting", "Vineyard Tours", "Countryside Views"]
    },
    {
      id: 6,
      name: "Adventure Park",
      category: "Family",
      distance: "20 minutes drive",
      rating: 4.5,
      description: "Family-friendly adventure park with activities for all ages.",
      image: "https://images.unsplash.com/photo-1594736797933-d0ce6de55ba6?w=500&h=300&fit=crop",
      highlights: ["Zip Lines", "Rock Climbing", "Kids Activities"]
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Cultural: "bg-blue-100 text-blue-800",
      Nature: "bg-green-100 text-green-800",
      Adventure: "bg-orange-100 text-orange-800",
      Shopping: "bg-purple-100 text-purple-800",
      Leisure: "bg-red-100 text-red-800",
      Family: "bg-yellow-100 text-yellow-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Popular Attractions Online</h1>
          <p className="text-xl text-white/90">Browse destinations and plan your trip through our website</p>
        </div>
      </div>

      {/* Search Card */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10 mb-8">
        <SearchCard />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((attraction) => (
            <Card key={attraction.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={attraction.image} 
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(attraction.category)}>
                      {attraction.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{attraction.name}</CardTitle>
                <p className="text-muted-foreground mb-4">{attraction.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {attraction.distance}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-2 fill-primary text-primary" />
                    {attraction.rating} rating
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {attraction.highlights.map((highlight, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>

                <Button asChild className="w-full">
                  <Link to="/cars">Rent Car to Visit</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}