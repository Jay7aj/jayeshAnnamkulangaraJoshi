import supertest from 'supertest';
import bcrypt from 'bcrypt';
import { createApp } from '../src/app.js';
import {
  getTestClient,
  beginTransaction,
  rollbackTransaction,
  releaseClient
} from './helpers/dbTestClient.js';

let app;
let request;
let client;

beforeAll(async () => {
  client = await getTestClient();
  app = createApp({ db: client });
  request = supertest(app);
});

afterAll(async () => {
  await releaseClient();
});

beforeEach(async () => {
  await beginTransaction();
  await client.query('TRUNCATE users RESTART IDENTITY CASCADE');
});

afterEach(async () => {
  await rollbackTransaction();
});

describe('Auth API', () => {
  test('POST /api/auth/register registers a new user', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'user@test.com',
        password: 'password123'
      });


    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('user@test.com');
  });

  test('POST /api/auth/register fails for duplicate email', async () => {
    const hashed = await bcrypt.hash('password123', 10);

    await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)`,
      ['Existing', 'dup@test.com', hashed]
    );

    const res = await request
      .post('/api/auth/register')
      .send({
        name: 'Another',
        email: 'dup@test.com',
        password: 'password123'
      });

    expect(res.status).toBe(400);
  });

  test('POST /api/auth/login returns token for valid credentials', async () => {
    const hashed = await bcrypt.hash('password123', 10);

    await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)`,
      ['Login User', 'login@test.com', hashed]
    );

    const res = await request
      .post('/api/auth/login')
      .send({
        email: 'login@test.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login fails for wrong password', async () => {
    const hashed = await bcrypt.hash('password123', 10);

    await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)`,
      ['Wrong Pass', 'wrong@test.com', hashed]
    );

    const res = await request
      .post('/api/auth/login')
      .send({
        email: 'wrong@test.com',
        password: 'badpassword'
      });

    expect(res.status).toBe(401);
  });

  test('POST /api/auth/login fails for unknown email', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({
        email: 'missing@test.com',
        password: 'password123'
      });

    expect(res.status).toBe(401);
  });
});
