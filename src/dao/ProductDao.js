const IDao = require('./Idao.js');
const Product = require('./models/Product');

class ProductDao extends IDao {
  async create(product) {
    try {
      const newProduct = new Product(product);
      return await newProduct.save();
    } catch (error) {
      throw new Error('Error creating product: ' + error.message);
    }
  }

  async getById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error('Error finding product by id: ' + error.message);
    }
  }

  async getAll() {
    try {
      return await Product.find();
    } catch (error) {
      throw new Error('Error getting all products: ' + error.message);
    }
  }

  async update(id, product) {
    try {
      return await Product.findByIdAndUpdate(id, product, { new: true });
    } catch (error) {
      throw new Error('Error updating product: ' + error.message);
    }
  }

  async delete(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error deleting product: ' + error.message);
    }
  }
}

module.exports = ProductDao;
