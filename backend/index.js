import dotenv from 'dotenv';
dotenv.config()
import app from './app.js';
import pool from './config/db.js';
import client from './config/client.js'
const PORT = process.env.PORT || 3000;



(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
})();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
