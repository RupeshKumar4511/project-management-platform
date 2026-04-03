import { createClient } from 'redis';
import {config} from 'dotenv';
config();

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
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