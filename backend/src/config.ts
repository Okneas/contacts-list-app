import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

function optionalInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const num = Number(raw);
  if (!Number.isInteger(num) || num <= 0) {
    throw new Error(`Env variable ${name} must be a positive integer`);
  }
  return num;
}

export const config = {
  port: optionalInt('PORT', 3001),
  db: {
    host: required('DB_HOST'),
    port: optionalInt('DB_PORT', 3306),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),
  },
} as const;