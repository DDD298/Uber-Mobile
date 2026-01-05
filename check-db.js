const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");

dotenv.config();

async function check() {
  const sql = neon(process.env.DATABASE_URL);
  const res = await sql`SELECT email, clerk_id FROM drivers`;
}
check().catch(console.error);
