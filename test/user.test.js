const request = require('supertest');
const app = require('../app'); 
const { expect } = require('chai');

describe('User Routes', () => {
    it('should get all users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('should upload documents', async () => {
        const res = await request(app)
            .post('/api/users/user_id_to_test/documents') 
            .attach('documents', 'path_to_file') 
            .expect(200);
        expect(res.body.message).to.equal('Documentos subidos con éxito');
    });

    it('should promote user to premium', async () => {
        const res = await request(app).post('/api/users/user_id_to_test/premium'); 
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Usuario actualizado a premium con éxito');
    });
});
