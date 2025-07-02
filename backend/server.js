const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'catering-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// IMPORTANT: Railway healthcheck endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const result = await pool.query('SELECT 1');
    res.status(200).json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint for Railway
app.get('/', (req, res) => {
  res.json({ 
    message: 'Catering Backend API', 
    status: 'running',
    endpoints: {
      health: '/health',
      admin: '/admin',
      leads: '/api/leads',
      contact: '/api/contact'
    }
  });
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Admin login
app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Get admin user from database
    const result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.isAuthenticated = true;
    req.session.adminId = admin.id;
    
    res.json({ message: 'Login successful', admin: { id: admin.id, username: admin.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin logout
app.post('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Check auth status
app.get('/admin/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username FROM admin_users WHERE id = $1', [req.session.adminId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ admin: result.rows[0] });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all leads (admin only)
app.get('/api/leads', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, phone, event_type, event_date, guest_count, message, status, created_at, updated_at 
      FROM leads 
      ORDER BY created_at DESC
    `);
    res.json({ leads: result.rows });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update lead status (admin only)
app.patch('/api/leads/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['nutno zavolat', 'domlouvá se', 'domluveno', 'padlo to'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE leads SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ lead: result.rows[0] });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact form submission (public)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, eventType, eventDate, guestCount, message } = req.body;
    
    // Basic validation
    if (!name || !email || !phone || !eventType || !eventDate || !guestCount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(`
      INSERT INTO leads (name, email, phone, event_type, event_date, guest_count, message, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at
    `, [name, email, phone, eventType, eventDate, parseInt(guestCount), message || '', 'nutno zavolat']);

    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      leadId: result.rows[0].id,
      createdAt: result.rows[0].created_at
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simple admin panel HTML (for development/testing)
app.get('/admin', (req, res) => {
  if (!req.session.isAuthenticated) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Admin Login</title></head>
      <body>
        <h2>Admin Login</h2>
        <form action="/admin/login" method="post">
          <input type="text" name="username" placeholder="Username" required><br><br>
          <input type="password" name="password" placeholder="Password" required><br><br>
          <button type="submit">Login</button>
        </form>
      </body>
      </html>
    `);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Admin Panel</title></head>
      <body>
        <h2>Admin Panel</h2>
        <p>Welcome! Use the API endpoints to manage leads.</p>
        <a href="/api/leads">View Leads (JSON)</a><br>
        <form action="/admin/logout" method="post">
          <button type="submit">Logout</button>
        </form>
      </body>
      </html>
    `);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👨‍💼 Admin panel: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});
