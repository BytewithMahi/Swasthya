import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is missing');
}

export const sql = neon(process.env.DATABASE_URL);

// Helper to initialize tables
export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value VARCHAR(255) NOT NULL
      );
    `;
    await sql`
      INSERT INTO settings (key, value)
      VALUES ('waitlist_locked', 'false')
      ON CONFLICT (key) DO NOTHING;
    `;
    await sql`
      INSERT INTO settings (key, value)
      VALUES ('maintenance_mode', 'false')
      ON CONFLICT (key) DO NOTHING;
    `;
    await sql`
      INSERT INTO settings (key, value)
      VALUES ('project_completion', '60')
      ON CONFLICT (key) DO NOTHING;
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS objectives (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS objective_comments (
        id SERIAL PRIMARY KEY,
        objective_id INTEGER REFERENCES objectives(id) ON DELETE CASCADE,
        username VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS admin_usernames (
        username VARCHAR(255) PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}
