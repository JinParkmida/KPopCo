# K-Pop Europe Concert Tracker

## Overview

This is a full-stack web application that aggregates and displays K-Pop concert information across Europe. The system automatically scrapes concert data from multiple sources and provides a modern dashboard interface for users to browse upcoming shows. Built with a React frontend and Express backend, it features real-time data synchronization, filtering capabilities, and a responsive dark-themed UI optimized for K-Pop concert discovery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Theme**: Custom dark theme with K-Pop inspired color palette (purple, pink, blue gradients)

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured endpoints for concerts, artists, venues, and statistics
- **Data Layer**: In-memory storage with interface-based design for easy database integration
- **Logging**: Custom request logging middleware for API monitoring

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured but using in-memory storage currently)
- **Schema**: Well-defined schemas for concerts, artists, venues, and scrape jobs
- **Migrations**: Drizzle-kit for database schema management

### Web Scraping System
- **Engine**: Playwright for browser automation and data extraction
- **Scheduler**: Custom scheduling system for automated scraping jobs (30-minute intervals)
- **Sources**: Multiple concert platforms and K-pop news sites:
  - **Ticketing Platforms**: Ticketmaster, StubHub, Eventbrite, SeatGeek
  - **K-pop News Sources**: Soompi, Reddit r/kpop, AllKPop, Soompi Shop
- **Focus**: European cities and popular K-Pop artists across 8+ sources
- **Error Handling**: Comprehensive error tracking and job status monitoring
- **Sample Data**: Pre-populated with demonstration concerts from major K-pop acts

### UI Component System
- **Design System**: shadcn/ui components with Radix UI primitives
- **Responsiveness**: Mobile-first responsive design
- **Accessibility**: ARIA-compliant components with keyboard navigation
- **Theming**: CSS variables for consistent color management and dark mode support

## External Dependencies

### Database & ORM
- **@neondatabase/serverless**: Neon database serverless driver for PostgreSQL
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: CLI tool for database migrations and schema management

### Web Scraping
- **playwright**: Browser automation for concert data scraping
- **connect-pg-simple**: PostgreSQL session store (configured for future use)

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **vite**: Fast build tool and development server
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

### Form & Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Validation resolvers for forms
- **zod**: Schema validation library
- **drizzle-zod**: Zod integration for Drizzle schemas

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **nanoid**: Unique ID generation