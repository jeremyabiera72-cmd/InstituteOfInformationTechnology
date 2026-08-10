import pg from 'pg';

const client = new pg.Client({
  host: '/home/yumi/Documents/cs-student-hub/db_data',
  port: 5433,
  user: 'postgres',
  password: 'postgres',
  database: 'cs_student_hub',
});

async function main() {
  try {
    await client.connect();
    console.log('Successfully connected to the database via UNIX socket!');
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await client.end();
  }
}

main();
