const request = require('supertest');
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;

describe('Carritos API', () => {
  let cartId;


  it('Debe obtener los productos en el carrito', async () => {
    const res = await request(app).get('/api/carts');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });


  it('Debe agregar un producto al carrito', async () => {
    const newCartItem = {
      productId: '60d0fe4f5311236168a109ca', 
      quantity: 2
    };

    const res = await request(app).post('/api/carts').send(newCartItem);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message').eql('Producto añadido al carrito con éxito.');
    cartId = res.body.cartId; 
  });


  it('Debe eliminar un producto del carrito', async () => {
    const res = await request(app).delete(`/api/carts/${cartId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message').eql('Producto eliminado del carrito con éxito.');
  });


  it('Debe devolver un array vacío al intentar obtener un carrito vacío', async () => {
    const res = await request(app).get('/api/carts');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.is.empty;
  });
});
