// src/repositories/ProductRepository.js
const ProductDao = require('../dao/ProductDao');
const productDao = new ProductDao();

class ProductRepository {
  async createProduct(productData) {
    try {
      return await productDao.create(productData);
    } catch (error) {
      throw new Error('Error creating product: ' + error.message);
    }
  }

  async getProducts(filter = {}, options = {}) {
    try {
      return await productDao.find(filter, options);
    } catch (error) {
      throw new Error('Error fetching products: ' + error.message);
    }
  }

  async updateProduct(productId, updateData) {
    try {
      return await productDao.update(productId, updateData);
    } catch (error) {
      throw new Error('Error updating product: ' + error.message);
    }
  }

  async deleteProduct(productId) {
    try {
      return await productDao.delete(productId);
    } catch (error) {
      throw new Error('Error deleting product: ' + error.message);
    }
  }
}

module.exports = ProductRepository;
