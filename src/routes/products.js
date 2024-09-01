const express = require('express');
const router = express.Router();
const Product = require('../dao/models/Product');

// Crear un producto
router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Cada uno de los campos es obligatorio' });
        }

        const product = new Product({ title, description, price, thumbnail, code, stock, category, status: true });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// Obtener todos los productos con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
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

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage: prevPage !== null,
            hasNextPage: nextPage !== null,
            prevLink: prevPage ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: nextPage ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const updatedProduct = req.body;
        const product = await Product.findByIdAndUpdate(pid, updatedProduct, { new: true });

        if (product) {
            res.json({ message: 'Producto actualizado correctamente', product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const result = await Product.findByIdAndDelete(pid);

        if (result) {
            res.json({ message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
