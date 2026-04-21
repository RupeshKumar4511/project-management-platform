import {defineConfig} from  'drizzle-kit';
import {config} from 'dotenv'
config()
export default defineConfig({
    out:"./drizzle",
    schema:'./models/*.js', 
    dialect:"postgresql", 
    dbCredentials:{
        url:process.env.PostgreSQL_URI  
    }
}) 
