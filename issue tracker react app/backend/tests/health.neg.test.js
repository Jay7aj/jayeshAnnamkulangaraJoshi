import request from 'supertest';
import app from  '../src/app.js';

describe('Health check - negative cases', ()=>{
    it('returns 404 for unknown routes', async()=>{
        const res =await request(app).get('/does-not-exist');

        expect(res.status).toBe(404);
    });
});