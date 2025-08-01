import { Card } from "@/components/ui/card";
import type { Venue } from "@shared/schema";

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const getVenueImage = (venueName: string) => {
    const images = {
      'o2 arena': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300',
      'accorhotels arena': 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300',
      'ziggo dome': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300',
      default: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300'
    };
    
    const key = venueName.toLowerCase();
    return images[key as keyof typeof images] || images.default;
  };

  return (
    <Card className="bg-dark-secondary border-dark-tertiary rounded-xl overflow-hidden card-hover">
      <img
        src={venue.imageUrl || getVenueImage(venue.name)}
        alt={venue.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold mb-1 text-white">{venue.name}</h3>
        <p className="text-gray-400 text-sm mb-2">{venue.city}, {venue.country}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">
            {venue.capacity ? `${venue.capacity.toLocaleString()} capacity` : 'Capacity TBA'}
          </span>
          <span className="text-kpop-pink">
            {venue.upcomingShows || 0} shows
          </span>
        </div>
      </div>
    </Card>
  );
}
