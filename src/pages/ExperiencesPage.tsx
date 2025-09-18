import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ATTRACTIONS, type Attraction } from "@/data/attractions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";

const sorts = [
  { id: "pop", label: "Most popular" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top rated" },
  { id: "duration", label: "Shortest duration" },
];

interface StarsProps {
  value: number;
}

function Stars({ value = 0 }: StarsProps) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  
  return (
    <div className="flex items-center" aria-label={`${value} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            i < full
              ? "fill-yellow-400 text-yellow-400"
              : half && i === full
              ? "fill-yellow-300 text-yellow-300"
              : "fill-muted text-muted"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.62L10 0 7.19 6.62 0 7.24l5.46 4.73L3.82 19z" />
        </svg>
      ))}
      <span className="ml-2 text-xs text-muted-foreground">{value.toFixed(1)}</span>
    </div>
  );
}

interface ExperienceCardProps {
  item: Attraction;
}

function ExperienceCard({ item }: ExperienceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className="h-44 w-full object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-background/90 text-foreground">
          {item.category}
        </Badge>
      </div>
      <CardHeader className="space-y-3">
        <h3 className="text-base font-semibold leading-tight">{item.title}</h3>
        <div className="text-sm text-muted-foreground">
          {item.location} • ~{item.durationHours}h
        </div>
        <Stars value={item.rating} />
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <ul className="text-sm text-muted-foreground space-y-1">
          {item.highlights.slice(0, 3).map((highlight, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-primary mr-2">•</span>
              {highlight}
            </li>
          ))}
        </ul>
        <div className="flex items-end justify-between pt-2">
          <div>
            <div className="text-xs text-muted-foreground">From</div>
            <div className="text-lg font-bold">
              {item.currency} {item.price}
            </div>
          </div>
          <Button 
            variant="premium"
            size="sm"
            onClick={() => alert(`Booking ${item.title}`)}
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ExperiencesPageProps {
  title: string;
  allowedCategories: Attraction["category"][];
}

export default function ExperiencesPage({ title, allowedCategories }: ExperiencesPageProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("pop");
  const [maxPrice, setMaxPrice] = useState(200);

  const data = useMemo(() => {
    let list = ATTRACTIONS.filter((x) => allowedCategories.includes(x.category));

    // Search filter
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (x) =>
          x.title.toLowerCase().includes(q) ||
          x.location.toLowerCase().includes(q) ||
          x.highlights.some((h) => h.toLowerCase().includes(q))
      );
    }

    // Price filter
    list = list.filter((x) => x.price <= maxPrice);

    // Sort
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      case "duration":
        list.sort((a, b) => a.durationHours - b.durationHours);
        break;
      default:
        list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [query, sort, maxPrice, allowedCategories]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">
            Discover curated {title.toLowerCase()} available with your rental.
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="grid gap-4 md:grid-cols-3 md:items-center mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sorts.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Filter */}
        <div className="mb-8 flex items-center gap-4">
          <label htmlFor="price" className="text-sm text-muted-foreground">
            Max price:
          </label>
          <input
            id="price"
            type="range"
            min={10}
            max={200}
            step={1}
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
            className="flex-1 max-w-xs accent-primary"
          />
          <span className="text-sm font-medium min-w-[80px]">
            Up to € {maxPrice}
          </span>
        </div>

        {/* Results */}
        {data.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            <div className="text-lg font-medium mb-2">No results found</div>
            <p>Try adjusting your search criteria or clearing filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <ExperienceCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}