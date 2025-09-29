import { Pool } from 'pg';

// Parse DATABASE_URL to individual components to avoid IPv6 issues
const parseDatabaseUrl = (url: string) => {
  if (!url) return null;
  const parsed = new URL(url);
  return {
    user: parsed.username,
    password: parsed.password,
    host: parsed.hostname,
    port: parseInt(parsed.port) || 5432,
    database: parsed.pathname.slice(1), // Remove leading slash
  };
};

const dbParams = parseDatabaseUrl(process.env.DATABASE_URL || '');

const dbConfig = dbParams ? {
  user: dbParams.user,
  password: dbParams.password,
  host: dbParams.host,
  port: dbParams.port,
  database: dbParams.database,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
} : {
  // Fallback for missing DATABASE_URL
  ssl: false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
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