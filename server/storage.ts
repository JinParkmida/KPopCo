import { type Concert, type InsertConcert, type Artist, type InsertArtist, type Venue, type InsertVenue, type ScrapeJob, type InsertScrapeJob, type DashboardStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Concerts
  getConcerts(filters?: {
    artist?: string;
    city?: string;
    dateFrom?: Date;
    dateTo?: Date;
    venueSize?: string;
  }): Promise<Concert[]>;
  getConcert(id: string): Promise<Concert | undefined>;
  createConcert(concert: InsertConcert): Promise<Concert>;
  updateConcert(id: string, concert: Partial<InsertConcert>): Promise<Concert | undefined>;
  deleteConcert(id: string): Promise<boolean>;
  
  // Artists
  getArtists(): Promise<Artist[]>;
  getArtist(id: string): Promise<Artist | undefined>;
  getArtistByName(name: string): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  updateArtist(id: string, artist: Partial<InsertArtist>): Promise<Artist | undefined>;
  getTrendingArtists(limit?: number): Promise<Artist[]>;
  
  // Venues
  getVenues(): Promise<Venue[]>;
  getVenue(id: string): Promise<Venue | undefined>;
  getVenueByName(name: string, city: string): Promise<Venue | undefined>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: string, venue: Partial<InsertVenue>): Promise<Venue | undefined>;
  getFeaturedVenues(limit?: number): Promise<Venue[]>;
  
  // Scrape Jobs
  getScrapeJobs(limit?: number): Promise<ScrapeJob[]>;
  createScrapeJob(job: InsertScrapeJob): Promise<ScrapeJob>;
  updateScrapeJob(id: string, job: Partial<InsertScrapeJob>): Promise<ScrapeJob | undefined>;
  
  // Dashboard
  getDashboardStats(): Promise<DashboardStats>;
  
  // Bulk operations
  bulkCreateConcerts(concerts: InsertConcert[]): Promise<Concert[]>;
  bulkUpdateArtistStats(): Promise<void>;
  bulkUpdateVenueStats(): Promise<void>;
}

export class MemStorage implements IStorage {
  private concerts: Map<string, Concert>;
  private artists: Map<string, Artist>;
  private venues: Map<string, Venue>;
  private scrapeJobs: Map<string, ScrapeJob>;

  constructor() {
    this.concerts = new Map();
    this.artists = new Map();
    this.venues = new Map();
    this.scrapeJobs = new Map();
  }

  // Concerts
  async getConcerts(filters?: {
    artist?: string;
    city?: string;
    dateFrom?: Date;
    dateTo?: Date;
    venueSize?: string;
  }): Promise<Concert[]> {
    let concerts = Array.from(this.concerts.values());
    
    if (filters) {
      if (filters.artist) {
        concerts = concerts.filter(c => c.artist.toLowerCase().includes(filters.artist!.toLowerCase()));
      }
      if (filters.city) {
        concerts = concerts.filter(c => c.city.toLowerCase().includes(filters.city!.toLowerCase()));
      }
      if (filters.dateFrom) {
        concerts = concerts.filter(c => new Date(c.date) >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        concerts = concerts.filter(c => new Date(c.date) <= filters.dateTo!);
      }
      if (filters.venueSize) {
        const sizeFilters: Record<string, (capacity: number) => boolean> = {
          'arena': (cap) => cap >= 20000,
          'stadium': (cap) => cap >= 50000,
          'theater': (cap) => cap >= 5000 && cap < 20000,
          'club': (cap) => cap >= 1000 && cap < 5000,
        };
        const filterFn = sizeFilters[filters.venueSize.toLowerCase()];
        if (filterFn) {
          concerts = concerts.filter(c => c.capacity && filterFn(c.capacity));
        }
      }
    }
    
    return concerts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getConcert(id: string): Promise<Concert | undefined> {
    return this.concerts.get(id);
  }

  async createConcert(insertConcert: InsertConcert): Promise<Concert> {
    const id = randomUUID();
    const concert: Concert = {
      ...insertConcert,
      id,
      lastUpdated: new Date(),
      metadata: insertConcert.metadata || null,
    };
    this.concerts.set(id, concert);
    return concert;
  }

  async updateConcert(id: string, concert: Partial<InsertConcert>): Promise<Concert | undefined> {
    const existing = this.concerts.get(id);
    if (!existing) return undefined;
    
    const updated: Concert = {
      ...existing,
      ...concert,
      lastUpdated: new Date(),
    };
    this.concerts.set(id, updated);
    return updated;
  }

  async deleteConcert(id: string): Promise<boolean> {
    return this.concerts.delete(id);
  }

  // Artists
  async getArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async getArtist(id: string): Promise<Artist | undefined> {
    return this.artists.get(id);
  }

  async getArtistByName(name: string): Promise<Artist | undefined> {
    return Array.from(this.artists.values()).find(a => a.name.toLowerCase() === name.toLowerCase());
  }

  async createArtist(insertArtist: InsertArtist): Promise<Artist> {
    const id = randomUUID();
    const artist: Artist = {
      ...insertArtist,
      id,
      lastUpdated: new Date(),
      imageUrl: insertArtist.imageUrl || null,
      trendingScore: insertArtist.trendingScore || null,
      upcomingShows: insertArtist.upcomingShows || null,
    };
    this.artists.set(id, artist);
    return artist;
  }

  async updateArtist(id: string, artist: Partial<InsertArtist>): Promise<Artist | undefined> {
    const existing = this.artists.get(id);
    if (!existing) return undefined;
    
    const updated: Artist = {
      ...existing,
      ...artist,
      lastUpdated: new Date(),
    };
    this.artists.set(id, updated);
    return updated;
  }

  async getTrendingArtists(limit: number = 10): Promise<Artist[]> {
    return Array.from(this.artists.values())
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      .slice(0, limit);
  }

  // Venues
  async getVenues(): Promise<Venue[]> {
    return Array.from(this.venues.values());
  }

  async getVenue(id: string): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async getVenueByName(name: string, city: string): Promise<Venue | undefined> {
    return Array.from(this.venues.values()).find(v => 
      v.name.toLowerCase() === name.toLowerCase() && 
      v.city.toLowerCase() === city.toLowerCase()
    );
  }

  async createVenue(insertVenue: InsertVenue): Promise<Venue> {
    const id = randomUUID();
    const venue: Venue = {
      ...insertVenue,
      id,
      lastUpdated: new Date(),
      capacity: insertVenue.capacity || null,
      imageUrl: insertVenue.imageUrl || null,
      upcomingShows: insertVenue.upcomingShows || null,
    };
    this.venues.set(id, venue);
    return venue;
  }

  async updateVenue(id: string, venue: Partial<InsertVenue>): Promise<Venue | undefined> {
    const existing = this.venues.get(id);
    if (!existing) return undefined;
    
    const updated: Venue = {
      ...existing,
      ...venue,
      lastUpdated: new Date(),
    };
    this.venues.set(id, updated);
    return updated;
  }

  async getFeaturedVenues(limit: number = 6): Promise<Venue[]> {
    return Array.from(this.venues.values())
      .sort((a, b) => (b.upcomingShows || 0) - (a.upcomingShows || 0))
      .slice(0, limit);
  }

  // Scrape Jobs
  async getScrapeJobs(limit: number = 10): Promise<ScrapeJob[]> {
    return Array.from(this.scrapeJobs.values())
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, limit);
  }

  async createScrapeJob(insertJob: InsertScrapeJob): Promise<ScrapeJob> {
    const id = randomUUID();
    const job: ScrapeJob = {
      ...insertJob,
      id,
      startTime: insertJob.startTime || new Date(),
      endTime: insertJob.endTime || null,
      concertsFound: insertJob.concertsFound || null,
      errorMessage: insertJob.errorMessage || null,
    };
    this.scrapeJobs.set(id, job);
    return job;
  }

  async updateScrapeJob(id: string, job: Partial<InsertScrapeJob>): Promise<ScrapeJob | undefined> {
    const existing = this.scrapeJobs.get(id);
    if (!existing) return undefined;
    
    const updated: ScrapeJob = {
      ...existing,
      ...job,
    };
    this.scrapeJobs.set(id, updated);
    return updated;
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const concerts = Array.from(this.concerts.values());
    const artists = Array.from(this.artists.values());
    const venues = Array.from(this.venues.values());
    const jobs = Array.from(this.scrapeJobs.values());
    
    const uniqueCities = new Set(concerts.map(c => c.city)).size;
    const lastJob = jobs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];
    
    const successfulJobs = jobs.filter(j => j.status === 'completed').length;
    const totalJobs = jobs.length;
    const scrapePerformance = totalJobs > 0 ? (successfulJobs / totalJobs) * 100 : 0;
    
    return {
      totalConcerts: concerts.length,
      activeArtists: artists.length,
      cities: uniqueCities,
      lastSync: lastJob ? this.formatTimeAgo(lastJob.startTime) : 'Never',
      syncStatus: lastJob?.status === 'completed' ? 'All sources active' : 'Issues detected',
      scrapePerformance: Math.round(scrapePerformance * 10) / 10,
    };
  }

  private formatTimeAgo(date: Date | string): string {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now.getTime() - target.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  }

  // Bulk operations
  async bulkCreateConcerts(concerts: InsertConcert[]): Promise<Concert[]> {
    const created: Concert[] = [];
    for (const concert of concerts) {
      created.push(await this.createConcert(concert));
    }
    return created;
  }

  async bulkUpdateArtistStats(): Promise<void> {
    const concerts = Array.from(this.concerts.values());
    const artistStats = new Map<string, { count: number; trend: number }>();
    
    // Calculate upcoming shows for each artist
    concerts.forEach(concert => {
      const existing = artistStats.get(concert.artist) || { count: 0, trend: 0 };
      existing.count++;
      // Simple trending calculation based on recent concerts
      if (new Date(concert.date) > new Date()) {
        existing.trend += 1;
      }
      artistStats.set(concert.artist, existing);
    });
    
    // Update artist records
    for (const artistEntry of Array.from(artistStats.entries())) {
      const [artistName, stats] = artistEntry;
      const artist = await this.getArtistByName(artistName);
      if (artist) {
        await this.updateArtist(artist.id, {
          upcomingShows: stats.count,
          trendingScore: stats.trend * 10, // Simple scoring
        });
      }
    }
  }

  async bulkUpdateVenueStats(): Promise<void> {
    const concerts = Array.from(this.concerts.values());
    const venueStats = new Map<string, number>();
    
    // Calculate upcoming shows for each venue
    concerts.forEach(concert => {
      const venueKey = `${concert.venue}|${concert.city}`;
      const existing = venueStats.get(venueKey) || 0;
      if (new Date(concert.date) > new Date()) {
        venueStats.set(venueKey, existing + 1);
      }
    });
    
    // Update venue records
    for (const venueEntry of Array.from(venueStats.entries())) {
      const [venueKey, count] = venueEntry;
      const [venueName, city] = venueKey.split('|');
      const venue = await this.getVenueByName(venueName, city);
      if (venue) {
        await this.updateVenue(venue.id, {
          upcomingShows: count,
        });
      }
    }
  }
}

export const storage = new MemStorage();
