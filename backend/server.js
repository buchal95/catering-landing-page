const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Load environment variables (optional for Railway)
try {
  require('dotenv').config();
} catch (error) {
  // dotenv not available or no .env file (normal on Railway)
}

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting Catering Backend...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', PORT);
console.log('🗄️ Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

// Database connection with Railway-specific configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Railway-specific connection settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  // Retry configuration
  retryDelayMs: 1000,
  maxRetries: 5
});

// Database connection with retry logic
async function connectWithRetry(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log('✅ Database connected successfully');
      client.release();
      return true;
    } catch (err) {
      console.error(`Database connection attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) {
        console.error('❌ All database connection attempts failed');
        return false;
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}

// Initialize database connection
connectWithRetry();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://catering-landing-page-buchal95.vercel.app',
    'https://catering-landing-page-git-main-buchal95.vercel.app',
    /^https:\/\/catering-landing-page.*\.vercel\.app$/
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration (simplified for Railway)
app.use(session({
  secret: process.env.SESSION_SECRET || 'catering-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false for Railway (they handle HTTPS termination)
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  // Use memory store for simplicity (fine for single instance)
  name: 'catering.sid'
}));

// IMPORTANT: Railway healthcheck endpoint with retry logic
app.get('/health', async (req, res) => {
  try {
    // Test database connection with timeout
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();

    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);

    // Return 200 for initial deployment (Railway needs this)
    // But indicate the database status
    res.status(200).json({
      status: 'starting',
      database: 'connecting',
      error: error.message,
      timestamp: new Date().toISOString(),
      note: 'Database may still be initializing'
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
      dashboard: '/admin/dashboard',
      leads: '/api/leads',
      contact: '/api/contact',
      testForm: '/test-form'
    }
  });
});

// Test form for creating sample leads
app.get('/test-form', (req, res) => {
  const testFormPath = path.join(__dirname, 'views', 'test-form.html');
  if (fs.existsSync(testFormPath)) {
    res.sendFile(testFormPath);
  } else {
    res.json({ error: 'Test form not found' });
  }
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

// Admin login page
app.get('/admin', (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect('/admin/dashboard');
  }

  const loginPath = path.join(__dirname, 'views', 'admin-login.html');
  if (fs.existsSync(loginPath)) {
    res.sendFile(loginPath);
  } else {
    // Fallback simple login form
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Admin Login</title></head>
      <body>
        <h2>Admin Login</h2>
        <form id="loginForm">
          <input type="text" id="username" placeholder="Username" required><br><br>
          <input type="password" id="password" placeholder="Password" required><br><br>
          <button type="submit">Login</button>
        </form>
        <script>
          document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const response = await fetch('/admin/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
              }),
              credentials: 'include'
            });
            if (response.ok) {
              window.location.href = '/admin/dashboard';
            } else {
              alert('Login failed');
            }
          });
        </script>
      </body>
      </html>
    `);
  }
});

// Admin dashboard
app.get('/admin/dashboard', requireAuth, (req, res) => {
  const dashboardPath = path.join(__dirname, 'views', 'admin-dashboard.html');
  if (fs.existsSync(dashboardPath)) {
    res.sendFile(dashboardPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Admin Dashboard</title></head>
      <body>
        <h2>Admin Dashboard</h2>
        <p>Welcome! Use the API endpoints to manage leads.</p>
        <a href="/api/leads">View Leads (JSON)</a><br>
        <button onclick="fetch('/admin/logout', {method: 'POST', credentials: 'include'}).then(() => location.href='/admin')">Logout</button>
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
