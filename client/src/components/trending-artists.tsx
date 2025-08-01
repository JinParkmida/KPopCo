import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { Artist } from "@shared/schema";

interface TrendingArtistsProps {
  artists: Artist[];
}

export default function TrendingArtists({ artists }: TrendingArtistsProps) {
  const getTrendingPercentage = (score: number | null) => {
    if (!score) return '+0%';
    return `+${Math.min(Math.round(score / 10), 50)}%`;
  };

  return (
    <Card className="bg-dark-secondary border-dark-tertiary">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Trending Artists</h3>
        <div className="space-y-4">
          {artists.length > 0 ? (
            artists.slice(0, 6).map((artist) => (
              <div key={artist.id} className="flex items-center space-x-4">
                <img
                  src={artist.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                  alt={artist.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-white">{artist.name}</div>
                  <div className="text-gray-400 text-sm">
                    {artist.upcomingShows || 0} upcoming shows
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-sm flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>{getTrendingPercentage(artist.trendingScore)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No trending artists data available</p>
              <p className="text-gray-500 text-sm">Data will appear after sync completes</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
