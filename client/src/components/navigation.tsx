import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Search, RefreshCw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Navigation() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/scrape/start"),
    onSuccess: () => {
      toast({
        title: "Sync Started",
        description: "Data synchronization has been initiated",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/concerts"] });
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Failed to start data synchronization",
        variant: "destructive",
      });
    },
  });

  const handleSync = () => {
    syncMutation.mutate();
  };

  return (
    <nav className="bg-dark-secondary border-b border-dark-tertiary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 kpop-gradient rounded-full flex items-center justify-center">
                <Music className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">K-Pop Europe</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-white hover:text-kpop-pink transition-colors">Dashboard</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Concerts</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Artists</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Venues</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Analytics</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search concerts, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-tertiary text-white px-4 py-2 rounded-lg w-64 focus:ring-2 focus:ring-kpop-purple border-none"
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button
              onClick={handleSync}
              disabled={syncMutation.isPending}
              className="kpop-gradient px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
              {syncMutation.isPending ? 'Syncing...' : 'Sync Data'}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
