import request from 'supertest';
import bcrypt from 'bcrypt';
import { createApp } from '../src/app.js';
import {
  getTestClient,
  beginTransaction,
  rollbackTransaction,
  releaseClient
} from './helpers/dbTestClient.js';

let token;
let issueId;
let app;
let client;

async function createIssue() {
  const res = await request(app)
    .post('/api/issues')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Test issue',
      description: 'Created in Jest',
      priority: 'HIGH'
    });

    console.log("Issue Response:", res.body);

    if (res.body.data && res.body.data.id) {
        issueId = res.body.data.id;
    } else {
        console.error('Error creating issue:', res.body);  // Log the error for debugging
    }

  return res.body.data;
}

beforeAll(async () => {
  client = await getTestClient();
  app = createApp({ db: client });

});

afterAll(async () => {
  await releaseClient();
});

beforeEach(async () => {
  await beginTransaction();

  const hashedPassword = await bcrypt.hash('password123', 10);

  await client.query(`DELETE FROM users WHERE email = $1`, [
    'admin@test.com'
  ]);

  const {rows} = await client.query(
    `
    INSERT INTO users (email, password_hash, role, name)
    VALUES ($1, $2, $3, $4)
    `,
    ['admin@test.com', hashedPassword, 'ADMIN', 'Admin']
  );

  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@test.com',
      password: 'password123'
    });

  token = res.body.token;
  // await client.query('DELETE FROM issues');
  // await client.query('DELETE FROM users');
  // await client.query('TRUNCATE users CASCADE');
});

afterEach(async () => {
  await rollbackTransaction();
});

describe('Issues API', () => {
  test('GET /api/issues returns paginated list', async () => {
    const res = await request(app)
      .get('/api/issues')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/issues creates a new issue', async () => {
    const issue = await createIssue();
    expect(issue).toHaveProperty('id');
  });

  test('GET /api/issues/:id returns a single issue', async () => {
    await createIssue();

    const res = await request(app)
      .get(`/api/issues/${issueId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(issueId);
  });

  test('PATCH /api/issues/:id updates issue status', async () => {
    await createIssue();

    const res = await request(app)
      .patch(`/api/issues/${issueId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('IN_PROGRESS');
  });

  test('DELETE /api/issues/:id deletes the issue', async () => {
    await createIssue();

    const res = await request(app)
      .delete(`/api/issues/${issueId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  test('GET /api/issues without token returns 401', async () => {
    const res = await request(app).get('/api/issues');
    expect(res.status).toBe(401);
  });

  test('POST /api/issues with invalid payload returns 400', async () => {
    const res = await request(app)
      .post('/api/issues')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });

    expect(res.status).toBe(400);
  });

  test('GET /api/issues/:id returns 404 for non-existent issue', async () => {
    const res = await request(app)
      .get('/api/issues/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  test('Non-owner cannot delete issue', async () => {
    const issue = await createIssue();

    // Create another user
    const hashed = await bcrypt.hash('password123', 10);

    await client.query(`
      INSERT INTO users (email, password_hash, role, name)
      VALUES ($1, $2, $3, $4)
    `, ['user2@test.com', hashed, 'USER', 'User 2']);

    const login = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user2@test.com',
        password: 'password123'
      });

    const otherToken = login.body.token;

    const res = await request(app)
      .delete(`/api/issues/${issue.id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

});
