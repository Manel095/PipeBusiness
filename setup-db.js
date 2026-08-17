const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres:6LJgB7z7ENEsDMC6@db.pmmsefylizyjebthgnav.supabase.co:5432/postgres';

async function setupDatabase() {
  console.log('Connecting to Supabase...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected!');

    const sql = fs.readFileSync('supabase/migrations/20260817000000_schema.sql', 'utf8');

    console.log('Executing schema migration...');
    await client.query(sql);

    console.log('Successfully created all tables and RLS policies!');
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await client.end();
  }
}

setupDatabase();
