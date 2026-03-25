import request from 'supertest';
import {createApp} from  '../src/app.js';

const app = createApp();

describe('Health check - negative cases', ()=>{
    it('returns 404 for unknown routes', async()=>{
        const res =await request(app).get('/does-not-exist');

        expect(res.status).toBe(404);
    });
});