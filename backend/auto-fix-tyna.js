const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Load environment variables
try {
  require('dotenv').config();
} catch (error) {
  // dotenv not available or no .env file (normal on Railway)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function autoFixTyna() {
  // Only run if TYNA_PASSWORD environment variable is set
  const tynaPassword = process.env.TYNA_PASSWORD;
  
  if (!tynaPassword) {
    console.log('ℹ️  TYNA_PASSWORD not set, skipping auto-fix');
    return;
  }
  
  try {
    console.log('🔄 Auto-fixing Tyna password...');
    
    // Hash the password properly
    const hashedPassword = await bcrypt.hash(tynaPassword, 10);
    
    // First, try to update existing user
    const updateResult = await pool.query(
      'UPDATE admin_users SET password_hash = $1 WHERE username = $2 RETURNING id',
      [hashedPassword, 'tyna']
    );
    
    if (updateResult.rows.length > 0) {
      console.log('✅ Tyna password updated successfully');
    } else {
      // User doesn't exist, create it
      await pool.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        ['tyna', hashedPassword]
      );
      console.log('✅ Tyna user created successfully');
    }
    
    console.log('📝 Username: tyna');
    console.log('📝 Password: [from TYNA_PASSWORD env var]');
    
    // Remove the environment variable so this doesn't run again
    console.log('🔄 Auto-fix complete. You can remove TYNA_PASSWORD env var now.');
    
  } catch (error) {
    console.error('❌ Auto-fix error:', error);
  }
}

module.exports = { autoFixTyna };
