import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const concerts = pgTable("concerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  date: timestamp("date").notNull(),
  capacity: integer("capacity"),
  ticketUrl: text("ticket_url"),
  imageUrl: text("image_url"),
  status: text("status").notNull().default("available"), // available, few-left, sold-out
  source: text("source").notNull(), // ticketmaster, stubhub, etc.
  lastUpdated: timestamp("last_updated").notNull().default(sql`now()`),
  metadata: json("metadata"), // additional source-specific data
});

export const artists = pgTable("artists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  imageUrl: text("image_url"),
  trendingScore: integer("trending_score").default(0),
  upcomingShows: integer("upcoming_shows").default(0),
  lastUpdated: timestamp("last_updated").notNull().default(sql`now()`),
});

export const venues = pgTable("venues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  capacity: integer("capacity"),
  imageUrl: text("image_url"),
  upcomingShows: integer("upcoming_shows").default(0),
  lastUpdated: timestamp("last_updated").notNull().default(sql`now()`),
});

export const scrapeJobs = pgTable("scrape_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").notNull(),
  status: text("status").notNull(), // running, completed, failed
  startTime: timestamp("start_time").notNull().default(sql`now()`),
  endTime: timestamp("end_time"),
  concertsFound: integer("concerts_found").default(0),
  errorMessage: text("error_message"),
});

// Insert schemas
export const insertConcertSchema = createInsertSchema(concerts).omit({
  id: true,
  lastUpdated: true,
});

export const insertArtistSchema = createInsertSchema(artists).omit({
  id: true,
  lastUpdated: true,
});

export const insertVenueSchema = createInsertSchema(venues).omit({
  id: true,
  lastUpdated: true,
});

export const insertScrapeJobSchema = createInsertSchema(scrapeJobs).omit({
  id: true,
});

// Types
export type Concert = typeof concerts.$inferSelect;
export type InsertConcert = z.infer<typeof insertConcertSchema>;

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;

export type Venue = typeof venues.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;

export type ScrapeJob = typeof scrapeJobs.$inferSelect;
export type InsertScrapeJob = z.infer<typeof insertScrapeJobSchema>;

// Dashboard stats type
export type DashboardStats = {
  totalConcerts: number;
  activeArtists: number;
  cities: number;
  lastSync: string;
  syncStatus: string;
  scrapePerformance: number;
};
