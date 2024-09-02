const express = require('express');
const router = express.Router();
const CartRepository = require('../repositories/CartRepository');
const Product = require('../dao/models/Product');
const User = require('../dao/models/User');
const cartRepo = new CartRepository();


exports.deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await cartRepo.removeProductFromCart(cid, pid);
        if (result) {
            res.json({ message: 'Producto eliminado del carrito' });
        } else {
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const updatedCart = await cartRepo.updateCart(cid, products);

        if (updatedCart) {
            res.json({ message: 'Carrito actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
};

exports.updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartRepo.updateProductQuantity(cid, pid, quantity);

        if (updatedCart) {
            res.json({ message: 'Cantidad del producto actualizada correctamente' });
        } else {
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto' });
    }
};

exports.deleteAllProductsFromCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await cartRepo.clearCart(cid);

        if (result) {
            res.json({ message: 'Todos los productos han sido eliminados del carrito' });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar los productos del carrito' });
    }
};

exports.purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartRepo.getCart(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const user = await User.findById(req.user._id);
        const purchaseResult = await cartRepo.purchaseCart(cid, user);

        res.json(purchaseResult);
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la compra' });
    }
};

module.exports = router;
