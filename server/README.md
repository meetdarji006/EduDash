# EduDash Express API

A modern Express.js API with Drizzle ORM and PostgreSQL for educational dashboard management.

## Features

- 🚀 Express.js server with TypeScript
- 🗄️ PostgreSQL database with Drizzle ORM
- 🔒 Security middleware (Helmet, CORS)
- 📊 Request logging with Morgan
- 🏗️ Database migrations and schema management
- 🎯 Type-safe database operations

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/edudash

   # Server
   PORT=3000
   NODE_ENV=development

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Database Setup:**
   ```bash
   # Generate migrations
   npm run db:generate

   # Apply migrations to database
   npm run db:migrate

   # Or push schema directly (for development)
   npm run db:push
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply migrations to database
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - API information

## Database Schema

The application includes the following tables:

- **users** - User accounts and authentication
- **courses** - Educational courses
- **enrollments** - User course enrollments
- **lessons** - Course lessons and content

## Project Structure

```
src/
├── controllers/     # Route controllers
├── db/            # Database configuration and schema
├── middleware/    # Express middleware
├── routes/        # API routes
└── index.ts       # Main application entry point
```

## Development

The project uses TypeScript with strict type checking. All database operations are type-safe using Drizzle ORM.

## License

ISC
