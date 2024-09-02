const request = require('supertest');
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;

describe('Sesiones API', () => {
  let sessionId;

 
  it('Debe iniciar sesión correctamente', async () => {
    const credentials = {
      username: 'testuser', 
      password: 'testpassword'
    };

    const res = await request(app).post('/api/auth/login').send(credentials);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    sessionId = res.body.token; 
  });

 
  it('Debe obtener la información de la sesión actual', async () => {
    const res = await request(app)
      .get('/api/auth/session')
      .set('Authorization', `Bearer ${sessionId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('username'); 
  });

 
  it('Debe cerrar sesión correctamente', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${sessionId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message').eql('Sesión cerrada con éxito.');
  });


  it('Debe devolver 401 al intentar obtener la sesión después de cerrar sesión', async () => {
    const res = await request(app)
      .get('/api/auth/session')
      .set('Authorization', `Bearer ${sessionId}`);
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message').eql('No autorizado.');
  });
});
