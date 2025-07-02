const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Load environment variables (optional for Railway)
try {
  require('dotenv').config();
} catch (error) {
  // dotenv not available or no .env file (normal on Railway)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function resetAdminPassword() {
  const username = process.argv[2] || 'admin';
  const newPassword = process.argv[3];
  
  if (!newPassword) {
    console.error('❌ Usage: node reset-password.js [username] <new-password>');
    console.error('❌ Example: node reset-password.js admin myNewPassword123');
    process.exit(1);
  }
  
  try {
    console.log('🔄 Resetting password for user:', username);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the password in database
    const result = await pool.query(
      'UPDATE admin_users SET password_hash = $1 WHERE username = $2 RETURNING id, username',
      [hashedPassword, username]
    );
    
    if (result.rows.length === 0) {
      console.error('❌ User not found:', username);
      process.exit(1);
    }
    
    console.log('✅ Password reset successfully for user:', username);
    console.log('📝 New password:', newPassword);
    console.log('⚠️  Please change this password after logging in!');
    
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
resetAdminPassword();
