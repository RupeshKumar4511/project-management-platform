import {Pool} from 'pg';
import {config} from 'dotenv';
import {drizzle} from 'drizzle-orm/node-postgres';
import * as schema from '../models/workspace.model.js'
config()

const pool = new Pool({
    connectionString:process.env.PostgreSQL_URI
})

export const db = drizzle(pool,{schema});

export default pool;