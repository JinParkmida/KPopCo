import { realScraper } from './real-scraper';
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
      const results = await realScraper.scrapeRealData();

      // Update job status
      await storage.updateScrapeJob(job.id, {
        status: 'completed',
        endTime: new Date(),
        concertsFound: results.concerts.length,
        errorMessage: undefined,
      });

      console.log(`Real data scraping completed: ${results.concerts.length} concerts found from authentic sources`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Scraping job failed:', errorMessage);
      
      await storage.updateScrapeJob(job.id, {
        status: 'failed',
        endTime: new Date(),
        errorMessage,
      });
    } finally {
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
