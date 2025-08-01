import { scraper } from './scraper';
import { storage } from '../storage';

class ScrapingScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  start(intervalMinutes: number = 30): void {
    if (this.intervalId) {
      console.log('Scheduler is already running');
      return;
    }

    console.log(`Starting scraping scheduler with ${intervalMinutes} minute intervals`);
    
    // Run immediately
    this.runScraping();
    
    // Then run on interval
    this.intervalId = setInterval(() => {
      this.runScraping();
    }, intervalMinutes * 60 * 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Scraping scheduler stopped');
    }
  }

  async runScraping(): Promise<void> {
    if (this.isRunning) {
      console.log('Scraping already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('Starting scheduled scraping job...');

    const startTime = new Date();
    const job = await storage.createScrapeJob({
      source: 'all',
      status: 'running',
      startTime,
      concertsFound: 0,
    });

    try {
      await scraper.initialize();
      const results = await scraper.scrapeAllSources();
      
      // Store the scraped data
      const concerts = await storage.bulkCreateConcerts(results.concerts);
      
      // Create/update artists and venues
      for (const artist of results.artists) {
        const existing = await storage.getArtistByName(artist.name);
        if (!existing) {
          await storage.createArtist(artist);
        }
      }

      for (const venue of results.venues) {
        const existing = await storage.getVenueByName(venue.name, venue.city);
        if (!existing) {
          await storage.createVenue(venue);
        }
      }

      // Update stats
      await storage.bulkUpdateArtistStats();
      await storage.bulkUpdateVenueStats();

      // Update job status
      await storage.updateScrapeJob(job.id, {
        status: 'completed',
        endTime: new Date(),
        concertsFound: concerts.length,
        errorMessage: results.errors.length > 0 ? results.errors.join('; ') : undefined,
      });

      console.log(`Scraping completed: ${concerts.length} concerts found`);
      if (results.errors.length > 0) {
        console.log(`Errors encountered: ${results.errors.length}`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Scraping job failed:', errorMessage);
      
      await storage.updateScrapeJob(job.id, {
        status: 'failed',
        endTime: new Date(),
        errorMessage,
      });
    } finally {
      await scraper.close();
      this.isRunning = false;
    }
  }

  getStatus(): { isRunning: boolean; hasSchedule: boolean } {
    return {
      isRunning: this.isRunning,
      hasSchedule: this.intervalId !== null,
    };
  }
}

export const scheduler = new ScrapingScheduler();
