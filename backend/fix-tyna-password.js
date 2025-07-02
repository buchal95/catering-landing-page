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

async function fixTynaPassword() {
  const newPassword = process.argv[2] || 'tyna123'; // Default password
  
  try {
    console.log('🔄 Fixing password for user: tyna');
    
    // Hash the password properly
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update tyna's password with proper hash
    const result = await pool.query(
      'UPDATE admin_users SET password_hash = $1 WHERE username = $2 RETURNING id, username',
      [hashedPassword, 'tyna']
    );
    
    if (result.rows.length === 0) {
      console.error('❌ User "tyna" not found in database');
      console.log('🔄 Creating user "tyna"...');
      
      // Create tyna user if doesn't exist
      await pool.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        ['tyna', hashedPassword]
      );
      
      console.log('✅ User "tyna" created successfully');
    } else {
      console.log('✅ Password updated successfully for user: tyna');
    }
    
    console.log('📝 Username: tyna');
    console.log('📝 Password:', newPassword);
    console.log('🔐 Password is now properly hashed in database');
    
  } catch (error) {
    console.error('❌ Error fixing password:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
fixTynaPassword();
