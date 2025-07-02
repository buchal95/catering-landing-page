const { initializeDatabase } = require('./init-db');
const { autoFixTyna } = require('./auto-fix-tyna');

async function start() {
  console.log('🚀 Starting Catering Backend...');

  try {
    // Initialize database first
    console.log('📊 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully');

    // Auto-fix Tyna password if needed
    await autoFixTyna();

    // Start the server
    console.log('🌐 Starting Express server...');
    require('./server');

  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

start();
