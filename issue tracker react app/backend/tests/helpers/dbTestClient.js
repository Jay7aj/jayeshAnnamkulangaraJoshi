import { pool } from '../../src/config/db.js';

export async function getTestClient() {
  const client = await pool.connect();
  await client.query('BEGIN');
  return client;
}

export async function rollbackClient(client) {
  await client.query('ROLLBACK');
  client.release();
}
