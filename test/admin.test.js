const request = require('supertest');
const app = require('../app'); 
const { expect } = require('chai');

describe('Admin Routes', () => {
    it('should get all users for admin', async () => {
        const res = await request(app).get('/api/admin/users');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('should delete a user', async () => {
        const userId = 'user_id_to_test';
        const res = await request(app).post(`/api/admin/users/${userId}/delete`);
        expect(res.status).to.equal(302); 
    });

    it('should update user role', async () => {
        const userId = 'user_id_to_test'; 
        const res = await request(app).post(`/api/admin/users/${userId}/role`).send({ role: 'premium' });
        expect(res.status).to.equal(302);
    });
});
