import mysql, { Pool } from 'mysql2/promise';
import { config } from './config';
import { Connection } from 'mysql2';

export const pool: Pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
  charset: 'utf8mb4_unicode_ci',
  dateStrings: true,
});

pool.pool.on('connection', (conn) => {
  conn.query("SET time_zone = '+00:00'", (err) => {
    if (err) {
      console.error('[db] failed to set time_zone:', err);
    }
  });
});

export async function checkDbConnection(): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.query('SELECT 1');
  } finally {
    conn.release();
  }
}

export async function closeDb(): Promise<void> {
  await pool.end();
}