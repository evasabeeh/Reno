import { Pool } from 'pg';

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // Increased timeout for pooler
};

const pool = new Pool(dbConfig);

export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    
    const createSchoolsTable = `
      CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        contact BIGINT NOT NULL,
        image TEXT,
        email_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await client.query(createSchoolsTable);
    console.log('Database and tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getConnection() {
  return await pool.connect();
}

export { pool };

initializeDatabase().catch(console.error);