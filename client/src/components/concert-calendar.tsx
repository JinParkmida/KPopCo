import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Concert } from "@shared/schema";

interface ConcertCalendarProps {
  concerts: Concert[];
}

export default function ConcertCalendar({ concerts }: ConcertCalendarProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-400';
      case 'few-left':
        return 'text-yellow-400';
      case 'sold-out':
        return 'text-red-400';
      default:
        return 'text-gray-400';
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

  return (
    <Card className="bg-dark-secondary border-dark-tertiary">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Concert Calendar</h3>
        <div className="space-y-4">
          {concerts.length > 0 ? (
            concerts.slice(0, 5).map((concert) => {
              const dateInfo = formatDate(concert.date);
              return (
                <div
                  key={concert.id}
                  className="flex items-center space-x-4 p-3 bg-dark-tertiary rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-kpop-pink font-bold text-lg">{dateInfo.day}</div>
                    <div className="text-gray-400 text-xs">{dateInfo.month}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{concert.artist} - {concert.title}</div>
                    <div className="text-gray-400 text-sm">{concert.venue}, {concert.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">{dateInfo.time}</div>
                    <div className={`text-xs ${getStatusColor(concert.status)}`}>
                      {getStatusText(concert.status)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No upcoming concerts scheduled</p>
              <p className="text-gray-500 text-sm">Check back later for updates</p>
            </div>
          )}
        </div>
        {concerts.length > 5 && (
          <Button variant="ghost" className="w-full mt-4 text-kpop-pink hover:text-kpop-purple transition-colors">
            View Full Calendar <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
