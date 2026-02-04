import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/config/db.js';
import bcrypt from 'bcrypt';

let token;

beforeAll(async () => {
  // clean test user if exists
    await pool.query(
        'DELETE FROM users WHERE email = $1',
        ['admin@test.com']
    );

    const hashedPassword = await bcrypt.hash('password123', 10);

    await pool.query(
        `
        INSERT INTO users (email, password_hash, role, name)
        VALUES ($1, $2, $3, $4)
        `,
        ['admin@test.com', hashedPassword, 'ADMIN', 'ADMIN']
    );

    const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'admin@test.com',
            password: 'password123',
        });

    token = res.body.token;
});

describe('Issues API', () => {
    it('GET /api/issues returns 200 when authenticated', async () => {
        const res = await request(app)
            .get('/api/issues')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data.data)).toBe(true);
        expect(res.body.data.meta).toBeDefined();

    });

    let issueId;
    it('POST /api/issues creates a new issue', async () => {
        const res = await request(app)
            .post('/api/issues')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test issue',
                description: 'Issue created during Jest test',
                priority: 'HIGH'
            });

        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty('id');

        issueId = res.body.data.id;
        console.log('TEST issueId:', issueId);
    });

    it('GET /api/issues/:id returns a single issue', async () => {
        const res = await request(app)
            .get(`/api/issues/${issueId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(issueId);
        expect(res.body.data.title).toBe('Test issue');
    });

    it('PATCH /api/issues/:id updates issue status', async () => {
        const res = await request(app)
            .patch(`/api/issues/${issueId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: 'IN_PROGRESS'
            });

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('DELETE /api/issues/:id deletes the issue', async () => {
        const res = await request(app)
            .delete(`/api/issues/${issueId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

    //negative case

    it('GET /api/issues without token returns 401', async () => {
        const res = await request(app)
            .get('/api/issues');

        expect(res.status).toBe(401);
    });

    it('POST /api/issues with invalid payload returns 400', async () => {
        const res = await request(app)
            .post('/api/issues')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: '' // invalid
            });

        expect(res.status).toBe(400);
    });

    it('GET /api/issues/:id returns 404 for non-existent issue', async () => {
        const nonExistentId = '00000000-0000-0000-0000-000000000000';
        const res = await request(app)
            .get(`/api/issues/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
    });
});



afterAll(async () => {
    await pool.end();
});