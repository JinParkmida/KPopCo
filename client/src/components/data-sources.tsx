import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Check, AlertTriangle, Settings } from "lucide-react";
import type { ScrapeJob } from "@shared/schema";

interface ScrapeStatus {
  isRunning: boolean;
  hasSchedule: boolean;
  recentJobs: ScrapeJob[];
}

export default function DataSources() {
  const { data: scrapeStatus } = useQuery<ScrapeStatus>({
    queryKey: ["/api/scrape/status"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const sources = [
    { name: 'Ticketmaster', status: 'active', lastSync: '1 min ago' },
    { name: 'StubHub', status: 'rate-limited', lastSync: 'Rate limited' },
    { name: 'Eventbrite', status: 'rate-limited', lastSync: 'Rate limited' },
    { name: 'SeatGeek', status: 'active', lastSync: '30 sec ago' },
    { name: 'Soompi', status: 'active', lastSync: '45 sec ago' },
    { name: 'Reddit K-pop', status: 'active', lastSync: '1 min ago' },
    { name: 'AllKPop', status: 'active', lastSync: '2 min ago' },
    { name: 'Soompi Shop', status: 'active', lastSync: '1 min ago' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Check className="h-4 w-4 text-white" />;
      case 'rate-limited':
        return <AlertTriangle className="h-4 w-4 text-white" />;
      default:
        return <Check className="h-4 w-4 text-white" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'rate-limited':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const calculatePerformance = (jobs: ScrapeJob[]) => {
    if (!jobs || jobs.length === 0) return 0;
    const completed = jobs.filter(job => job.status === 'completed').length;
    return Math.round((completed / jobs.length) * 100 * 10) / 10;
  };

  const performance = scrapeStatus ? calculatePerformance(scrapeStatus.recentJobs) : 0;

  return (
    <Card className="bg-dark-secondary border-dark-tertiary">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Data Sources & Analytics</h3>
          <Button className="kpop-gradient px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
            <Settings className="mr-2 h-4 w-4" />
            Configure Sources
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
          {sources.map((source) => (
            <div key={source.name} className="text-center p-4 bg-dark-tertiary rounded-lg">
              <div className={`w-8 h-8 ${getStatusColor(source.status)} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                {getStatusIcon(source.status)}
              </div>
              <div className="font-medium text-sm text-white">{source.name}</div>
              <div className="text-gray-400 text-xs">Last sync: {source.lastSync}</div>
            </div>
          ))}
        </div>
        
        <div className="bg-dark-tertiary rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Scraping Performance</span>
            <span className="text-sm text-green-400">{performance}% Success Rate</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="kpop-gradient h-2 rounded-full transition-all duration-300" 
              style={{ width: `${performance}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>24h avg</span>
            <span>
              {scrapeStatus?.recentJobs.reduce((sum, job) => sum + (job.concertsFound || 0), 0) || 0} concerts processed
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
