import pg from 'pg';
import promise from 'bluebird';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Options for pg.Pool
const options = { 
    promiseLib: promise,
    query: (e) => {
        console.log('Query:', e.query);
    }
};

// Connection string from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set.');
    process.exit(1);
}

// Create a new pool instance
const pool = new pg.Pool({
    connectionString: connectionString,
    ...options,
});

// Error handling for the pool
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Test connection
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('DB Connection Success!');
        client.release();
    } catch (err) {
        console.error('Database connection error:', err);
    }
}

testConnection();

export default pool;
