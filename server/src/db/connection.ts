import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import "dotenv/config";

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}

// Create the connection
const connection = postgres(process.env.DATABASE_URL, {
    max: 10,
    // ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
});

// Create the database instance
export const db = drizzle(connection, { schema });

// Test the connection
export const testConnection = async () => {
    try {
        await connection`SELECT 1`;
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
};
