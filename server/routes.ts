import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { scheduler } from "./services/scheduler";
import { realScraper } from "./services/real-scraper";
import { insertConcertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Concerts
  app.get("/api/concerts", async (req, res) => {
    try {
      const { artist, city, dateFrom, dateTo, venueSize } = req.query;
      
      const filters: any = {};
      if (artist) filters.artist = String(artist);
      if (city) filters.city = String(city);
      if (dateFrom) filters.dateFrom = new Date(String(dateFrom));
      if (dateTo) filters.dateTo = new Date(String(dateTo));
      if (venueSize) filters.venueSize = String(venueSize);

      const concerts = await storage.getConcerts(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(concerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch concerts" });
    }
  });

  // Featured concerts (limited number for dashboard)
  app.get("/api/concerts/featured", async (req, res) => {
    try {
      const allConcerts = await storage.getConcerts();
      // Get featured concerts - future dates, sorted by date, limited to 6
      const featured = allConcerts
        .filter(c => new Date(c.date) > new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 6);
      res.json(featured);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured concerts" });
    }
  });

  // Upcoming concerts for calendar
  app.get("/api/concerts/upcoming", async (req, res) => {
    try {
      const allConcerts = await storage.getConcerts();
      // Get upcoming concerts for calendar view
      const upcoming = allConcerts
        .filter(c => new Date(c.date) > new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 10);
      res.json(upcoming);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming concerts" });
    }
  });

  app.get("/api/concerts/:id", async (req, res) => {
    try {
      const concert = await storage.getConcert(req.params.id);
      if (!concert) {
        return res.status(404).json({ message: "Concert not found" });
      }
      res.json(concert);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch concert" });
    }
  });

  app.post("/api/concerts", async (req, res) => {
    try {
      const validatedData = insertConcertSchema.parse(req.body);
      const concert = await storage.createConcert(validatedData);
      res.status(201).json(concert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid concert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create concert" });
    }
  });

  // Artists
  app.get("/api/artists", async (req, res) => {
    try {
      const artists = await storage.getArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artists" });
    }
  });

  app.get("/api/artists/trending", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(String(req.query.limit)) : 10;
      const trending = await storage.getTrendingArtists(limit);
      res.json(trending);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending artists" });
    }
  });

  // Venues
  app.get("/api/venues", async (req, res) => {
    try {
      const venues = await storage.getVenues();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venues" });
    }
  });

  app.get("/api/venues/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(String(req.query.limit)) : 6;
      const featured = await storage.getFeaturedVenues(limit);
      res.json(featured);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured venues" });
    }
  });

  // Scraping
  app.post("/api/scrape/start", async (req, res) => {
    try {
      scheduler.runScraping(); // Don't await - run in background
      res.json({ message: "Scraping job started" });
    } catch (error) {
      res.status(500).json({ message: "Failed to start scraping" });
    }
  });

  // Real data scraping endpoint
  app.post("/api/scrape-real", async (req, res) => {
    try {
      const result = await realScraper.scrapeRealData();
      res.json({ 
        message: "Real K-pop concert data scraped successfully from authentic sources",
        concertsAdded: result.concerts.length,
        artistsAdded: result.artists.length,
        venuesAdded: result.venues.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to scrape real data" });
    }
  });

  app.get("/api/scrape/status", async (req, res) => {
    try {
      const status = scheduler.getStatus();
      const recentJobs = await storage.getScrapeJobs(5);
      res.json({ ...status, recentJobs });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scraping status" });
    }
  });

  app.get("/api/scrape/jobs", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(String(req.query.limit)) : 10;
      const jobs = await storage.getScrapeJobs(limit);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scrape jobs" });
    }
  });

  // Filter options
  app.get("/api/filter-options", async (req, res) => {
    try {
      const concerts = await storage.getConcerts();
      const artists = await storage.getArtists();
      
      const uniqueCities = Array.from(new Set(concerts.map(c => c.city))).sort();
      const artistNames = artists.map(a => a.name).sort();
      
      res.json({
        artists: artistNames,
        cities: uniqueCities,
        venueSizes: [
          { value: 'arena', label: 'Arena (20K+)' },
          { value: 'stadium', label: 'Stadium (50K+)' },
          { value: 'theater', label: 'Theater (5K-20K)' },
          { value: 'club', label: 'Club (1K-5K)' }
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch filter options" });
    }
  });

  const httpServer = createServer(app);

  // Start the scraping scheduler
  scheduler.start(30); // Run every 30 minutes

  return httpServer;
}
