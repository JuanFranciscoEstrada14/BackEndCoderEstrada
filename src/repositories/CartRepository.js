const CartDao = require('../dao/CartDao');
const ProductDao = require('../dao/ProductDao');
const TicketRepository = require('./TicketRepository');

class CartRepository {
  constructor() {
    this.cartDao = new CartDao();
    this.productDao = new ProductDao();
    this.ticketRepo = new TicketRepository();
  }

  async removeProduct(cid, pid) {
    try {
      return await this.cartDao.removeProduct(cid, pid);
    } catch (error) {
      throw new Error('Error removing product from cart: ' + error.message);
    }
  }

  async updateCart(cid, products) {
    try {
      return await this.cartDao.update(cid, { products });
    } catch (error) {
      throw new Error('Error updating cart: ' + error.message);
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await this.cartDao.getById(cid);
      if (!cart) return null;
      const productIndex = cart.products.findIndex(p => p.id.toString() === pid);
      if (productIndex === -1) return null;
      cart.products[productIndex].quantity = quantity;
      return await this.cartDao.update(cid, { products: cart.products });
    } catch (error) {
      throw new Error('Error updating product quantity: ' + error.message);
    }
  }

  async clearCart(cid) {
    try {
      return await this.cartDao.update(cid, { products: [] });
    } catch (error) {
      throw new Error('Error clearing cart: ' + error.message);
    }
  }

  async getCart(cid) {
    try {
      return await this.cartDao.getById(cid);
    } catch (error) {
      throw new Error('Error getting cart: ' + error.message);
    }
  }

  async purchaseCart(cid) {
    try {
      const cart = await this.cartDao.getById(cid);
      if (!cart) return { error: 'Cart not found' };

      let purchasedProducts = [];
      let unavailableProducts = [];

      for (const item of cart.products) {
        const product = await this.productDao.getById(item.id);
        if (product && product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
          purchasedProducts.push(item);
        } else {
          unavailableProducts.push(item.id);
        }
      }

      const ticketData = {
        code: this.generateTicketCode(),
        amount: purchasedProducts.reduce((acc, p) => acc + p.quantity * p.price, 0),
        purchaser: cart.purchaser
      };

      const ticket = await this.ticketRepo.createTicket(ticketData);
      await this.clearCart(cid);

      return {
        ticket,
        unavailableProducts
      };
    } catch (error) {
      throw new Error('Error processing cart purchase: ' + error.message);
    }
  }

  generateTicketCode() {
    return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}

module.exports = CartRepository;
