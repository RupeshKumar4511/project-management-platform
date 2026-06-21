import { createClient } from 'redis';
import {config} from 'dotenv';
config();

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    },
    reconnectStrategy: (retries) => {
            if (retries > 10) return new Error('Max retries reached');
            return Math.min(retries * 100, 3000); // Retry with backoff
    }
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client Connected!'));

try {
    await client.connect();
} catch (error) {
    console.error(error)
}

export default client;