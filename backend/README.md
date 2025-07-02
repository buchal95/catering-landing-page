# Catering Backend API

Simple Node.js backend for lead management with admin authentication.

## Features

- ✅ Lead management with Czech status system
- ✅ Simple admin authentication
- ✅ Railway deployment ready with healthchecks
- ✅ PostgreSQL database integration
- ✅ CORS configured for frontend
- ✅ Session-based authentication

## Status Options

- `nutno zavolat` - Need to call
- `domlouvá se` - Negotiating  
- `domluveno` - Agreed
- `padlo to` - Fell through

## API Endpoints

### Public
- `GET /` - API info
- `GET /health` - Health check (for Railway)
- `POST /api/contact` - Submit contact form

### Admin (requires authentication)
- `POST /admin/login` - Admin login
- `POST /admin/logout` - Admin logout
- `GET /admin/me` - Check auth status
- `GET /admin` - Simple admin panel (HTML)
- `GET /api/leads` - Get all leads
- `PATCH /api/leads/:id` - Update lead status

## Environment Variables

```bash
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
SESSION_SECRET=your-secret-key
ADMIN_PASSWORD=your-admin-password
```

## Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL

# Initialize database
npm run init-db

# Start development server
npm run dev
```

## Railway Deployment

1. Create new Railway project
2. Add PostgreSQL database service
3. Deploy this backend
4. Set environment variables:
   - `FRONTEND_URL` - Your Vercel frontend URL
   - `SESSION_SECRET` - Random secret key
   - `ADMIN_PASSWORD` - Your admin password
5. Run database initialization (Railway will auto-set DATABASE_URL)

## Database Schema

### leads
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR) 
- phone (VARCHAR)
- event_type (VARCHAR)
- event_date (DATE)
- guest_count (INTEGER)
- message (TEXT)
- status (VARCHAR) - Czech status options
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### admin_users
- id (SERIAL PRIMARY KEY)
- username (VARCHAR)
- password_hash (VARCHAR)
- created_at (TIMESTAMP)

## Default Admin

- Username: `admin`
- Password: `admin123` (change in production!)

## Railway Health Check

The `/health` endpoint tests database connectivity and returns:
- Status 200: Healthy with database connection
- Status 500: Unhealthy with error details
