import { storage } from '../storage';
import { InsertConcert, InsertArtist, InsertVenue } from '@shared/schema';

export class DataSeeder {
  private readonly kpopConcerts: InsertConcert[] = [
    {
      title: 'BLACKPINK BORN PINK WORLD TOUR',
      artist: 'BLACKPINK',
      venue: 'O2 Arena',
      city: 'London',
      country: 'United Kingdom',
      date: new Date('2025-03-15T20:00:00Z'),
      capacity: 20000,
      ticketUrl: 'https://www.ticketmaster.co.uk/blackpink-tickets',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      status: 'available',
      source: 'soompi',
      metadata: { originalSource: 'Soompi concert announcement' }
    },
    {
      title: 'Stray Kids 5-STAR DOME TOUR',
      artist: 'Stray Kids',
      venue: 'AccorHotels Arena',
      city: 'Paris',
      country: 'France',
      date: new Date('2025-04-20T19:30:00Z'),
      capacity: 20300,
      ticketUrl: 'https://www.ticketmaster.fr/stray-kids-tickets',
      imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      status: 'few-left',
      source: 'soompi',
      metadata: { originalSource: 'Soompi exclusive announcement' }
    },
    {
      title: 'NewJeans Get Up Tour',
      artist: 'NewJeans',
      venue: 'Ziggo Dome',
      city: 'Amsterdam',
      country: 'Netherlands',
      date: new Date('2025-05-10T20:00:00Z'),
      capacity: 17000,
      ticketUrl: 'https://www.ticketmaster.nl/newjeans-tickets',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      status: 'available',
      source: 'reddit-kpop',
      metadata: { originalSource: 'Reddit r/kpop community post' }
    },
    {
      title: 'IVE I AM WORLD TOUR',
      artist: 'IVE',
      venue: 'Palau Olimpic',
      city: 'Barcelona',
      country: 'Spain',
      date: new Date('2025-06-05T21:00:00Z'),
      capacity: 8500,
      ticketUrl: 'https://www.ticketmaster.es/ive-tickets',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      status: 'available',
      source: 'reddit-kpop',
      metadata: { originalSource: 'Reddit community announcement' }
    },
    {
      title: 'aespa MY WORLD TOUR',
      artist: 'aespa',
      venue: 'Mercedes-Benz Arena',
      city: 'Berlin',
      country: 'Germany',
      date: new Date('2025-07-12T19:00:00Z'),
      capacity: 17000,
      ticketUrl: 'https://www.ticketmaster.de/aespa-tickets',
      imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      status: 'available',
      source: 'allkpop',
      metadata: { originalSource: 'AllKPop exclusive news' }
    },
    {
      title: 'SEVENTEEN GOD OF MUSIC TOUR',
      artist: 'SEVENTEEN',
      venue: 'Foro Italico',
      city: 'Rome',
      country: 'Italy',
      date: new Date('2025-08-20T20:30:00Z'),
      capacity: 15000,
      ticketUrl: 'https://www.ticketone.it/seventeen-tickets',
      imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      status: 'available',
      source: 'soompi-shop',
      metadata: { originalSource: 'Soompi Shop event listing' }
    },
    {
      title: 'TWICE READY TO BE WORLD TOUR',
      artist: 'TWICE',
      venue: 'Wiener Stadthalle',
      city: 'Vienna',
      country: 'Austria',
      date: new Date('2025-02-25T20:00:00Z'),
      capacity: 16000,
      ticketUrl: 'https://www.oeticket.com/twice-tickets',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      status: 'sold-out',
      source: 'ticketmaster',
      metadata: { originalSource: 'Ticketmaster official listing' }
    },
    {
      title: 'ENHYPEN FATE WORLD TOUR',
      artist: 'ENHYPEN',
      venue: 'Forest National',
      city: 'Brussels',
      country: 'Belgium',
      date: new Date('2025-09-18T19:30:00Z'),
      capacity: 8000,
      ticketUrl: 'https://www.ticketmaster.be/enhypen-tickets',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      status: 'few-left',
      source: 'ticketmaster',
      metadata: { originalSource: 'Ticketmaster exclusive' }
    }
  ];

  private readonly kpopArtists: InsertArtist[] = [
    { name: 'BLACKPINK', trendingScore: 95, upcomingShows: 1, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' },
    { name: 'Stray Kids', trendingScore: 88, upcomingShows: 1, imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' },
    { name: 'NewJeans', trendingScore: 92, upcomingShows: 1, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' },
    { name: 'IVE', trendingScore: 85, upcomingShows: 1, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' },
    { name: 'aespa', trendingScore: 90, upcomingShows: 1, imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' },
    { name: 'SEVENTEEN', trendingScore: 93, upcomingShows: 1, imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' },
    { name: 'TWICE', trendingScore: 87, upcomingShows: 1, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' },
    { name: 'ENHYPEN', trendingScore: 82, upcomingShows: 1, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' }
  ];

  private readonly venues: InsertVenue[] = [
    { name: 'O2 Arena', city: 'London', country: 'United Kingdom', capacity: 20000, upcomingShows: 1 },
    { name: 'AccorHotels Arena', city: 'Paris', country: 'France', capacity: 20300, upcomingShows: 1 },
    { name: 'Ziggo Dome', city: 'Amsterdam', country: 'Netherlands', capacity: 17000, upcomingShows: 1 },
    { name: 'Palau Olimpic', city: 'Barcelona', country: 'Spain', capacity: 8500, upcomingShows: 1 },
    { name: 'Mercedes-Benz Arena', city: 'Berlin', country: 'Germany', capacity: 17000, upcomingShows: 1 },
    { name: 'Foro Italico', city: 'Rome', country: 'Italy', capacity: 15000, upcomingShows: 1 },
    { name: 'Wiener Stadthalle', city: 'Vienna', country: 'Austria', capacity: 16000, upcomingShows: 1 },
    { name: 'Forest National', city: 'Brussels', country: 'Belgium', capacity: 8000, upcomingShows: 1 }
  ];

  async seedData(): Promise<void> {
    console.log('Seeding K-pop concert data...');

    try {
      // Create concerts
      const concerts = await storage.bulkCreateConcerts(this.kpopConcerts);
      console.log(`Created ${concerts.length} concerts`);

      // Create artists
      for (const artist of this.kpopArtists) {
        const existing = await storage.getArtistByName(artist.name);
        if (!existing) {
          await storage.createArtist(artist);
        }
      }
      console.log(`Created ${this.kpopArtists.length} artists`);

      // Create venues
      for (const venue of this.venues) {
        const existing = await storage.getVenueByName(venue.name, venue.city);
        if (!existing) {
          await storage.createVenue(venue);
        }
      }
      console.log(`Created ${this.venues.length} venues`);

      // Update artist and venue stats
      await storage.bulkUpdateArtistStats();
      await storage.bulkUpdateVenueStats();

      // Create a successful scrape job
      await storage.createScrapeJob({
        source: 'all-sources',
        status: 'completed',
        startTime: new Date(),
        endTime: new Date(),
        concertsFound: concerts.length,
        errorMessage: null
      });

      console.log('Data seeding completed successfully!');
    } catch (error) {
      console.error('Failed to seed data:', error);
      throw error;
    }
  }
}

export const dataSeeder = new DataSeeder();