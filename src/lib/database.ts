import { Pool } from 'pg';

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
};

const pool = new Pool(dbConfig);

export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS app_users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createOtpTable = `
      CREATE TABLE IF NOT EXISTS otp_verifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
        otp_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
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
        created_by INTEGER REFERENCES app_users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createUpdateFunction = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    const createUsersTrigger = `
      CREATE TRIGGER update_app_users_updated_at 
          BEFORE UPDATE ON app_users 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column()
    `;

    const createSchoolsTrigger = `
      CREATE TRIGGER update_schools_updated_at 
          BEFORE UPDATE ON schools 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column()
    `;
    
    await client.query(createUsersTable);
    await client.query(createOtpTable);
    await client.query(createSchoolsTable);
    await client.query(createUpdateFunction);
    
    try {
      await client.query(createUsersTrigger);
    } catch {
    }
    
    try {
      await client.query(createSchoolsTrigger);
    } catch {
    }

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
