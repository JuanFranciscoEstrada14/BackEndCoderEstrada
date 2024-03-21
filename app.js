const express = require('express');
const ProductManager = require('./Main');

const app = express();
const port = 8080; 


const manager = new ProductManager('productos.json');

app.use(express.json());


app.get('/api/products', (req, res) => {
    let products = manager.getProducts();
    const limit = req.query.limit;
    
    if (limit) {
        products = products.slice(0, parseInt(limit));
    }
    
    res.json(products);
});


app.get('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = manager.getProductById(pid);
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});


app.post('/api/products', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const product = {
        id: manager.getProducts().length + 1,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };
    manager.addProduct(product);
    res.status(201).json(product);
});


app.put('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const updatedProduct = req.body;
    manager.updateProduct(pid, updatedProduct);
    res.json({ message: 'Producto actualizado correctamente' });
});


app.delete('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    manager.deleteProduct(pid);
    res.json({ message: 'Producto eliminado correctamente' });
});


app.post('/api/carts', (req, res) => {
    const cartId = Math.floor(Math.random() * 100000); // 
    const cart = {
        id: cartId,
        products: []
    };
    res.status(201).json(cart);
});


app.get('/api/carts/:cid', (req, res) => {
    const cid = parseInt(req.params.cid);

    res.json({ message: `Productos del carrito ${cid}` });
});


app.post('/api/carts/:cid/product/:pid', (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity) || 1; 
    res.json({ message: `Producto ${pid} agregado al carrito ${cid} con cantidad ${quantity}` });
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
