const IDao = require('./Idao.js');
const Cart = require('./models/Cart');

class CartDao extends IDao {
  async create(cart) {
    try {
      const newCart = new Cart(cart);
      return await newCart.save();
    } catch (error) {
      throw new Error('Error creating cart: ' + error.message);
    }
  }

  async getById(id) {
    try {
      return await Cart.findById(id);
    } catch (error) {
      throw new Error('Error finding cart by id: ' + error.message);
    }
  }

  async getAll() {
    try {
      return await Cart.find();
    } catch (error) {
      throw new Error('Error getting all carts: ' + error.message);
    }
  }

  async update(id, cart) {
    try {
      return await Cart.findByIdAndUpdate(id, cart, { new: true });
    } catch (error) {
      throw new Error('Error updating cart: ' + error.message);
    }
  }

  async delete(id) {
    try {
      return await Cart.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error deleting cart: ' + error.message);
    }
  }
}

module.exports = CartDao;
