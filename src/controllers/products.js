const express = require('express');
const router = express.Router();
const ProductRepository = require('../repositories/ProductRepository');
const ProductDTO = require('../dto/ProductDTO');
const authorizeRoles = require('../middleware/authMiddleware');

const productRepo = new ProductRepository();

router.post('/', authorizeRoles('admin'), async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Cada uno de los campos es obligatorio' });
        }

        const product = await productRepo.create({ title, description, price, thumbnail, code, stock, category });
        const productDTO = new ProductDTO(product);
        res.status(201).json(productDTO);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;
        const sortOptions = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
        const filterOptions = query ? { category: query } : {};

        const { products, totalProducts } = await productRepo.getAll(filterOptions, sortOptions, limit, page);
        const totalPages = Math.ceil(totalProducts / limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        res.json({
            status: 'success',
            payload: products.map(product => new ProductDTO(product)),
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

router.put('/:pid', authorizeRoles('admin'), async (req, res) => {
    try {
        const pid = req.params.pid;
        const updatedProduct = req.body;
        const product = await productRepo.update(pid, updatedProduct);

        if (product) {
            res.json({ message: 'Producto actualizado correctamente', product: new ProductDTO(product) });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', authorizeRoles('admin'), async (req, res) => {
    try {
        const pid = req.params.pid;
        const result = await productRepo.delete(pid);

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
