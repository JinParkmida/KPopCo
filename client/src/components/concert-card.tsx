import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ExternalLink } from "lucide-react";
import type { Concert } from "@shared/schema";

interface ConcertCardProps {
  concert: Concert;
}

export default function ConcertCard({ concert }: ConcertCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-600';
      case 'few-left':
        return 'bg-yellow-600';
      case 'sold-out':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'few-left':
        return 'Few Left';
      case 'sold-out':
        return 'Sold Out';
      default:
        return 'Unknown';
    }
  };

  const getArtistGradient = (artist: string) => {
    const gradients = [
      'kpop-gradient',
      'cyber-gradient',
      'electric-gradient',
    ];
    // Simple hash to assign consistent gradient based on artist name
    const hash = artist.toLowerCase().charCodeAt(0) % gradients.length;
    return gradients[hash];
  };

  return (
    <Card className="bg-dark-secondary border-dark-tertiary rounded-xl overflow-hidden card-hover">
      <img
        src={concert.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
        alt={`${concert.artist} Concert`}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className={`${getArtistGradient(concert.artist)} text-white px-3 py-1 text-sm font-medium`}>
            {concert.artist}
          </Badge>
          <span className="text-gray-400 text-sm">{formatDate(concert.date)}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">{concert.title}</h3>
        <p className="text-gray-400 mb-4">{concert.venue}, {concert.city}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              {concert.capacity ? `${concert.capacity.toLocaleString()} capacity` : 'Capacity TBA'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(concert.status)} text-white`}>
              {getStatusText(concert.status)}
            </span>
            {concert.ticketUrl && (
              <Button
                size="sm"
                className="bg-kpop-pink text-white hover:bg-opacity-90 transition-opacity"
                onClick={() => window.open(concert.ticketUrl || '', '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Tickets
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
