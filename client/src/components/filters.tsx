import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterOptions {
  artists: string[];
  cities: string[];
  venueSizes: { value: string; label: string }[];
}

export default function Filters() {
  const [filters, setFilters] = useState({
    artist: "",
    city: "",
    dateFrom: "",
    venueSize: "",
  });

  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ["/api/filter-options"],
  });

  const handleFilterChange = (key: string, value: string) => {
    // Convert "all" to empty string for API compatibility
    const filterValue = value === "all" ? "" : value;
    setFilters(prev => ({ ...prev, [key]: filterValue }));
    // TODO: Implement actual filtering logic that updates the concerts list
    console.log('Filters updated:', { ...filters, [key]: filterValue });
  };

  return (
    <Card className="bg-dark-secondary border-dark-tertiary mb-8">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Filter Concerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label className="block text-sm text-gray-400 mb-2">Artist</Label>
            <Select value={filters.artist} onValueChange={(value) => handleFilterChange("artist", value)}>
              <SelectTrigger className="w-full bg-dark-tertiary text-white border-none focus:ring-2 focus:ring-kpop-purple">
                <SelectValue placeholder="All Artists" />
              </SelectTrigger>
              <SelectContent className="bg-dark-tertiary border-dark-tertiary">
                <SelectItem value="all">All Artists</SelectItem>
                {filterOptions?.artists.map((artist) => (
                  <SelectItem key={artist} value={artist}>
                    {artist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm text-gray-400 mb-2">City</Label>
            <Select value={filters.city} onValueChange={(value) => handleFilterChange("city", value)}>
              <SelectTrigger className="w-full bg-dark-tertiary text-white border-none focus:ring-2 focus:ring-kpop-purple">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent className="bg-dark-tertiary border-dark-tertiary">
                <SelectItem value="all">All Cities</SelectItem>
                {filterOptions?.cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm text-gray-400 mb-2">Date Range</Label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="w-full bg-dark-tertiary text-white border-none focus:ring-2 focus:ring-kpop-purple"
            />
          </div>
          
          <div>
            <Label className="block text-sm text-gray-400 mb-2">Venue Size</Label>
            <Select value={filters.venueSize} onValueChange={(value) => handleFilterChange("venueSize", value)}>
              <SelectTrigger className="w-full bg-dark-tertiary text-white border-none focus:ring-2 focus:ring-kpop-purple">
                <SelectValue placeholder="All Sizes" />
              </SelectTrigger>
              <SelectContent className="bg-dark-tertiary border-dark-tertiary">
                <SelectItem value="all">All Sizes</SelectItem>
                {filterOptions?.venueSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
