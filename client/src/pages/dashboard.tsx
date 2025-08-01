import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import StatsCard from "@/components/stats-card";
import Filters from "@/components/filters";
import ConcertCard from "@/components/concert-card";
import ConcertCalendar from "@/components/concert-calendar";
import TrendingArtists from "@/components/trending-artists";
import VenueCard from "@/components/venue-card";
import DataSources from "@/components/data-sources";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Music, ArrowRight, Calendar, MapPin, BarChart3 } from "lucide-react";
import type { DashboardStats, Concert, Artist, Venue } from "@shared/schema";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
  });

  const { data: featuredConcerts, isLoading: concertsLoading } = useQuery<Concert[]>({
    queryKey: ["/api/concerts/featured"],
  });

  const { data: upcomingConcerts } = useQuery<Concert[]>({
    queryKey: ["/api/concerts/upcoming"],
  });

  const { data: trendingArtists } = useQuery<Artist[]>({
    queryKey: ["/api/artists/trending"],
  });

  const { data: featuredVenues } = useQuery<Venue[]>({
    queryKey: ["/api/venues/featured"],
  });

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 cyber-gradient opacity-10"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-20" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"}}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">K-Pop Concerts</span>
              <br />Across Europe
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Real-time aggregation of K-pop concerts across European venues. 
              Track your favorite artists, discover new shows, and never miss a beat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="kpop-gradient px-8 py-3 text-lg font-semibold hover:opacity-90 transition-opacity glow-effect">
                <Calendar className="mr-2 h-5 w-5" />
                Browse Concerts
              </Button>
              <Button variant="outline" className="border-gray-600 px-8 py-3 text-lg font-semibold hover:border-kpop-purple transition-colors">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 bg-dark-secondary" />
            ))
          ) : stats ? (
            <>
              <StatsCard
                title="Total Concerts"
                value={stats.totalConcerts.toLocaleString()}
                change="+12% this month"
                icon={<Music className="h-6 w-6" />}
                gradient="kpop-gradient"
                changeType="positive"
              />
              <StatsCard
                title="Active Artists"
                value={stats.activeArtists.toString()}
                change="7 trending"
                icon={<Music className="h-6 w-6" />}
                gradient="cyber-gradient"
                changeType="neutral"
              />
              <StatsCard
                title="Cities Covered"
                value={stats.cities.toString()}
                change="Across Europe"
                icon={<MapPin className="h-6 w-6" />}
                gradient="electric-gradient"
                changeType="neutral"
              />
              <StatsCard
                title="Last Sync"
                value={stats.lastSync}
                change={stats.syncStatus}
                icon={<BarChart3 className="h-6 w-6" />}
                gradient="bg-green-600"
                changeType="positive"
              />
            </>
          ) : (
            <div className="col-span-4 text-center text-gray-400">
              Failed to load dashboard stats
            </div>
          )}
        </div>

        {/* Filters */}
        <Filters />

        {/* Featured Concerts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Concerts</h2>
            <Button variant="ghost" className="text-kpop-pink hover:text-kpop-purple">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concertsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 bg-dark-secondary rounded-xl" />
              ))
            ) : featuredConcerts && featuredConcerts.length > 0 ? (
              featuredConcerts.map((concert) => (
                <ConcertCard key={concert.id} concert={concert} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No featured concerts available</p>
                <p className="text-gray-500 text-sm">Check back later or try refreshing the data</p>
              </div>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ConcertCalendar concerts={upcomingConcerts || []} />
          <TrendingArtists artists={trendingArtists || []} />
        </div>

        {/* Venue Spotlight */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Venues</h2>
            <Button variant="ghost" className="text-kpop-pink hover:text-kpop-purple">
              Explore All <MapPin className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVenues && featuredVenues.length > 0 ? (
              featuredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No featured venues available</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Sources & Analytics */}
        <DataSources />
      </div>

      {/* Footer */}
      <footer className="bg-dark-secondary border-t border-dark-tertiary mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 kpop-gradient rounded-full flex items-center justify-center">
                  <Music className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">K-Pop Europe</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Your ultimate destination for K-pop concert information across Europe. 
                Real-time data aggregation powered by advanced web scraping technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Browse Concerts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Artists</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Venues</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-tertiary mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 K-Pop Europe. Built with Playwright scraping technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
