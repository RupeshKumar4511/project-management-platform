import {Pool} from 'pg';
import {config} from 'dotenv';
import {drizzle} from 'drizzle-orm/node-postgres';
import {schema} from '../models/schema.js'
config()

const pool = new Pool({
    connectionString:process.env.PostgreSQL_URI,
    ssl: {
        rejectUnauthorized: false  // required for Neon
    },
    connectionTimeoutMillis: 30000,  // wait 30s for a connection
    idleTimeoutMillis: 60000,
})

export const db = drizzle(pool,{schema});

export default pool;