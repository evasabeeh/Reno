#!/usr/bin/env node

// Schools Data Viewer
// Run with: node view-schools-data.js

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_HOST?.includes('supabase.co') ? {
    rejectUnauthorized: false
  } : false,
};

console.log('🏫 Schools Data Viewer\n');

const pool = new Pool(dbConfig);

async function viewSchoolsData() {
  let client;
  
  try {
    console.log('📡 Connecting to database...');
    client = await pool.connect();
    console.log('✅ Connected successfully!\n');

    // Get total count
    console.log('📊 Getting schools count...');
    const countResult = await client.query('SELECT COUNT(*) as total_schools FROM schools');
    const totalSchools = parseInt(countResult.rows[0].total_schools);
    
    console.log(`Total Schools: ${totalSchools}\n`);

    if (totalSchools === 0) {
      console.log('📝 No schools found in the database.');
      console.log('💡 Try adding some schools using your application at:');
      console.log('   http://localhost:3000/add-school');
      return;
    }

    // Get all schools data
    console.log('📋 Fetching all schools data...\n');
    const schoolsResult = await client.query(`
      SELECT 
        id,
        name,
        address,
        city,
        state,
        contact,
        email_id,
        image,
        created_at,
        updated_at
      FROM schools 
      ORDER BY created_at DESC
    `);

    // Display schools in a formatted way
    console.log('🏫 SCHOOLS DIRECTORY');
    console.log('='.repeat(80));

    schoolsResult.rows.forEach((school, index) => {
      console.log(`\n${index + 1}. ${school.name.toUpperCase()}`);
      console.log('─'.repeat(40));
      console.log(`📍 Address: ${school.address}`);
      console.log(`🏙️  City: ${school.city}, ${school.state}`);
      console.log(`📞 Contact: ${school.contact}`);
      console.log(`📧 Email: ${school.email_id}`);
      console.log(`🆔 ID: ${school.id}`);
      
      if (school.image) {
        console.log(`🖼️  Image: ${school.image}`);
      } else {
        console.log(`🖼️  Image: No image uploaded`);
      }
      
      const createdDate = new Date(school.created_at).toLocaleString();
      const updatedDate = new Date(school.updated_at).toLocaleString();
      console.log(`📅 Created: ${createdDate}`);
      console.log(`🔄 Updated: ${updatedDate}`);
    });

    console.log('\n' + '='.repeat(80));

    // Summary statistics
    console.log('\n📊 SUMMARY STATISTICS');
    console.log('─'.repeat(30));
    
    // Group by city
    const cityStats = await client.query(`
      SELECT city, COUNT(*) as count 
      FROM schools 
      GROUP BY city 
      ORDER BY count DESC
    `);
    
    console.log('\n🏙️ Schools by City:');
    cityStats.rows.forEach(row => {
      console.log(`  ${row.city}: ${row.count} school${row.count > 1 ? 's' : ''}`);
    });

    // Group by state
    const stateStats = await client.query(`
      SELECT state, COUNT(*) as count 
      FROM schools 
      GROUP BY state 
      ORDER BY count DESC
    `);
    
    console.log('\n🗺️ Schools by State:');
    stateStats.rows.forEach(row => {
      console.log(`  ${row.state}: ${row.count} school${row.count > 1 ? 's' : ''}`);
    });

    // Schools with/without images
    const imageStats = await client.query(`
      SELECT 
        COUNT(*) FILTER (WHERE image IS NOT NULL) as with_image,
        COUNT(*) FILTER (WHERE image IS NULL) as without_image
      FROM schools
    `);
    
    console.log('\n🖼️ Image Statistics:');
    console.log(`  With Images: ${imageStats.rows[0].with_image}`);
    console.log(`  Without Images: ${imageStats.rows[0].without_image}`);

    console.log('\n✨ Data retrieval completed successfully!');

  } catch (error) {
    console.error('❌ Failed to retrieve data:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your database connection');
    console.log('2. Ensure the schools table exists');
    console.log('3. Verify your .env.local configuration');
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Run the data viewer
viewSchoolsData();