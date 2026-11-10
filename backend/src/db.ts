import mysql, { Pool } from 'mysql2/promise';
import { config } from './config';

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