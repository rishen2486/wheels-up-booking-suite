import { useState } from "react";
import { Search, MapPin, Calendar, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
  initialFilters?: Partial<SearchFilters>;
}

export interface SearchFilters {
  country: string;
  location: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  carType: string;
}

const SearchBar = ({ onSearch, className, initialFilters }: SearchBarProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    country: initialFilters?.country || "Mauritius",
    location: initialFilters?.location || "",
    pickupDate: initialFilters?.pickupDate || "",
    pickupTime: initialFilters?.pickupTime || "",
    returnDate: initialFilters?.returnDate || "",
    returnTime: initialFilters?.returnTime || "",
    carType: initialFilters?.carType || "",
  });

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className={`search-glass p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 items-end">
        {/* Country */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Country
          </Label>
          <Select value={filters.country} onValueChange={(value) => updateFilter("country", value)}>
            <SelectTrigger className="bg-background/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mauritius">Mauritius</SelectItem>
              <SelectItem value="Rodrigues">Rodrigues</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Pickup Location
          </Label>
          <Input
            placeholder="City or Airport"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="bg-background/60"
          />
        </div>

        {/* Pickup Date & Time */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Pickup Date
          </Label>
          <Input
            type="date"
            value={filters.pickupDate}
            onChange={(e) => updateFilter("pickupDate", e.target.value)}
            className="bg-background/60"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Pickup Time
          </Label>
          <Input
            type="time"
            value={filters.pickupTime}
            onChange={(e) => updateFilter("pickupTime", e.target.value)}
            className="bg-background/60"
          />
        </div>

        {/* Return Date & Time */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Return Date
          </Label>
          <Input
            type="date"
            value={filters.returnDate}
            onChange={(e) => updateFilter("returnDate", e.target.value)}
            className="bg-background/60"
            min={filters.pickupDate || new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Return Time
          </Label>
          <Input
            type="time"
            value={filters.returnTime}
            onChange={(e) => updateFilter("returnTime", e.target.value)}
            className="bg-background/60"
          />
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          variant="premium"
          className="h-10"
          size="lg"
        >
          <Search className="h-4 w-4 mr-2" />
          Search Cars
        </Button>
      </div>
    </Card>
  );
};

export default SearchBar;