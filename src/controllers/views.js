const express = require('express');
const router = express.Router();
const Product = require('../dao/models/Product');
const Cart = require('../dao/models/Cart');
const { authenticateToken } = require('../middleware/authMiddleware');

// Vista de productos con paginación, filtrado y ordenamiento
exports.getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = '', query = '' } = req.query;
    const sortOptions = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
    const filterOptions = query ? { category: query } : {};

    const products = await Product.find(filterOptions)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const totalProducts = await Product.countDocuments(filterOptions);
    const totalPages = Math.ceil(totalProducts / limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    res.render('products', {
      products,
      totalPages,
      prevPage,
      nextPage,
      currentPage: page,
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: prevPage ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: nextPage ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Vista de carrito
exports.getCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).populate('products.product');

    if (cart) {
      res.render('cart', { cart });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// Vista de inicio
exports.getHome = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('home', { products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Vista de productos en tiempo real
exports.getRealTimeProducts = (req, res) => {
  res.render('realtimeProducts');
};

// Vista de login
exports.getLogin = (req, res) => {
  res.render('login');
};

// Vista de registro
exports.getRegister = (req, res) => {
  res.render('register');
};

module.exports = router;
