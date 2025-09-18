export interface Attraction {
  id: string;
  title: string;
  location: string;
  category: "Outdoor" | "Cruise" | "Food & Drink" | "Sightseeing" | "Theme Park";
  durationHours: number;
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  thumbnail: string;
  highlights: string[];
}

export const ATTRACTIONS: Attraction[] = [
  {
    id: "1",
    title: "Scenic Mountain Hiking Tour",
    location: "Blue Ridge Mountains",
    category: "Outdoor",
    durationHours: 6,
    rating: 4.8,
    reviews: 245,
    price: 75,
    currency: "€",
    thumbnail: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
    highlights: [
      "Professional guide included",
      "All equipment provided",
      "Stunning panoramic views",
      "Small group experience"
    ]
  },
  {
    id: "2",
    title: "Sunset River Cruise",
    location: "Rhine Valley",
    category: "Cruise",
    durationHours: 3,
    rating: 4.6,
    reviews: 189,
    price: 45,
    currency: "€",
    thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    highlights: [
      "Live music onboard",
      "Complimentary drinks",
      "Historic castle views",
      "Photography opportunities"
    ]
  },
  {
    id: "3",
    title: "Local Wine & Food Tasting",
    location: "Tuscany Region",
    category: "Food & Drink",
    durationHours: 4,
    rating: 4.9,
    reviews: 312,
    price: 85,
    currency: "€",
    thumbnail: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=300&fit=crop",
    highlights: [
      "Expert sommelier guide",
      "5 wine varieties",
      "Traditional local cuisine",
      "Vineyard tour included"
    ]
  },
  {
    id: "4",
    title: "Historic Cathedral Tour",
    location: "Notre-Dame",
    category: "Sightseeing",
    durationHours: 2,
    rating: 4.7,
    reviews: 156,
    price: 25,
    currency: "€",
    thumbnail: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop",
    highlights: [
      "Skip-the-line access",
      "Audio guide included",
      "Architectural highlights",
      "Historical insights"
    ]
  },
  {
    id: "5",
    title: "Adventure Theme Park",
    location: "Europa Park",
    category: "Theme Park",
    durationHours: 8,
    rating: 4.5,
    reviews: 423,
    price: 55,
    currency: "€",
    thumbnail: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
    highlights: [
      "All-day access",
      "15+ thrilling rides",
      "Family-friendly zones",
      "On-site dining options"
    ]
  },
  {
    id: "6",
    title: "Coastal Kayaking Adventure",
    location: "Mediterranean Coast",
    category: "Outdoor",
    durationHours: 5,
    rating: 4.8,
    reviews: 178,
    price: 65,
    currency: "€",
    thumbnail: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop",
    highlights: [
      "Crystal clear waters",
      "Sea cave exploration",
      "Professional instruction",
      "Safety equipment included"
    ]
  },
  {
    id: "7",
    title: "Luxury Dinner Cruise",
    location: "Seine River",
    category: "Cruise",
    durationHours: 3,
    rating: 4.7,
    reviews: 267,
    price: 120,
    currency: "€",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    highlights: [
      "3-course gourmet meal",
      "Live entertainment",
      "City lights tour",
      "Premium service"
    ]
  },
  {
    id: "8",
    title: "Brewery & Beer Tasting",
    location: "Munich",
    category: "Food & Drink",
    durationHours: 3,
    rating: 4.6,
    reviews: 145,
    price: 40,
    currency: "€",
    thumbnail: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
    highlights: [
      "Traditional brewery tour",
      "6 beer varieties",
      "Local snacks included",
      "Brewing process explained"
    ]
  }
];