import pkg from 'pg';
import { env } from './env.js';

const { Pool } = pkg;

export const pool = new Pool({
    connectionString: env.databaseUrl
});

export async function connectDB () {
    try {
        await pool.query('SELECT 1');
        console.log('PostgreSQL connected');
    } catch (err) {
        console.error('PostgreSQL connection error:', err);
        process.exit(1);
    }
};

pool.on('error', (err) => {
    console.error('PostgreSQL connection error', err);
});

export async function closeDB() {
    await pool.end();
}

export async function getTestClient(){
    const client = await pool.connect();
    return client;
}