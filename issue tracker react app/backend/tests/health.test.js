import request from 'supertest';
import {createApp} from '../src/app.js';

const app = createApp();

describe('Health check', () => {
    test('GET /health returns ok', async () => {
        const res = await request(app).get('/health');

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});
