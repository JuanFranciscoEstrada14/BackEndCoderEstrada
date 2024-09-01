const request = require('supertest');
const app = require('../app'); // Ruta ajustada según la ubicación de tu app.js
const chai = require('chai');
const expect = chai.expect;

describe('Sesiones API', () => {
  let sessionId;

  // Test para iniciar sesión
  it('Debe iniciar sesión correctamente', async () => {
    const credentials = {
      username: 'testuser', // Reemplaza con un nombre de usuario válido
      password: 'testpassword' // Reemplaza con una contraseña válida
    };

    const res = await request(app).post('/api/auth/login').send(credentials);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token'); // Asume que la respuesta incluye un token
    sessionId = res.body.token; // Guardar el token para pruebas posteriores
  });

  // Test para obtener la información de la sesión actual
  it('Debe obtener la información de la sesión actual', async () => {
    const res = await request(app)
      .get('/api/auth/session')
      .set('Authorization', `Bearer ${sessionId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('username'); // Ajusta según la respuesta esperada
  });

  // Test para cerrar sesión
  it('Debe cerrar sesión correctamente', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${sessionId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message').eql('Sesión cerrada con éxito.');
  });

  // Test para intentar obtener la información de la sesión después de cerrar sesión
  it('Debe devolver 401 al intentar obtener la sesión después de cerrar sesión', async () => {
    const res = await request(app)
      .get('/api/auth/session')
      .set('Authorization', `Bearer ${sessionId}`);
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message').eql('No autorizado.');
  });
});
