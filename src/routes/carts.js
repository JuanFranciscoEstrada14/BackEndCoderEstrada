const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        cart.products = cart.products.filter(product => product.id.toString() !== pid);
        await cart.save();
        res.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        cart.products = products;
        await cart.save();
        res.json({ message: 'Carrito actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

// Actualizar solo la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        const productIndex = cart.products.findIndex(p => p.id.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.json({ message: 'Cantidad del producto actualizada correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto' });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        cart.products = [];
        await cart.save();
        res.json({ message: 'Todos los productos han sido eliminados del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar los productos del carrito' });
    }
});

module.exports = router;
