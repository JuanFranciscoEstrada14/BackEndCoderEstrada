const express = require('express');
const router = express.Router();
const faker = require('faker'); 
const ProductDTO = require('../dto/ProductDTO');

const generateFakeProduct = () => ({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    thumbnail: faker.image.imageUrl(),
    code: faker.datatype.uuid(),
    stock: faker.datatype.number({ min: 0, max: 100 }),
    category: faker.commerce.department()
});

router.get('/mockingproducts', (req, res) => {
    try {
        const products = Array.from({ length: 100 }, generateFakeProduct);
        res.json({
            status: 'success',
            payload: products.map(product => new ProductDTO(product))
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar productos falsos' });
    }
});

module.exports = router;
