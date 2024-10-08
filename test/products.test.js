const request = require('supertest');
const app = require('../app'); 
const chai = require('chai');
const expect = chai.expect;

describe('Productos API', () => {
  let productId;


  it('Debe obtener todos los productos', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });


  it('Debe agregar un producto', async () => {
    const newProduct = {
      name: 'Test Product',
      price: 100,
      description: 'A product for testing'
    };

    const res = await request(app).post('/api/products').send(newProduct);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message').eql('Producto creado con éxito.');
    productId = res.body.product._id;
  });


  it('Debe obtener un producto por ID', async () => {
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id').eql(productId);
    expect(res.body).to.have.property('name').eql('Test Product');
  });


  it('Debe eliminar un producto', async () => {
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message').eql('Producto eliminado con éxito.');
  });
});
