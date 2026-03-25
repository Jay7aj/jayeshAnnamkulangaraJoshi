import { pool } from '../../src/config/db.js';

let client = null;

export async function getTestClient() {
  if (!client) {
    client = await pool.connect();
  }
  return client;
}

export async function beginTransaction() {
  const client = await getTestClient();
  await client.query('BEGIN');
}

export async function rollbackTransaction() {
  const client = await getTestClient();
  await client.query('ROLLBACK');
}

export async function releaseClient() {
  if (client) {
    client.release();
    client = null;
  }
  await pool.end();
}
