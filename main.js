const fs = require('fs');

class Product {
    constructor(id, title, description, price, img, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.img = img;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (err) {
            console.error('Error al cargar los productos:', err);
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (err) {
            console.error('No se guardaron los productos:', err);
        }
    }

    addProduct(title, description, price, img, code, stock) {
        if (!title || !description || !price || !img || !code || !stock) {
            console.error("Completar todos los datos es obligatorio");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error('El código ya está en uso.');
            return;
        }

        const newId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
        const product = new Product(newId, title, description, price, img, code, stock);
        this.products.push(product);
        this.saveProducts();
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct };
            this.saveProducts();
            console.log(`Producto con ID ${id} actualizado exitosamente.`);
        } else {
            console.error(`No se encontró ningún producto con ID ${id}.`);
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            console.log(`Producto con ID ${id} eliminado exitosamente.`);
        } else {
            console.error(`No se encontró ningún producto con ID ${id}.`);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(item => item.id === id);
    }
}

module.exports = ProductManager;


const manager = new ProductManager('productos.json');

console.log(manager.getProducts());

manager.addProduct("Producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 25);

console.log(manager.getProducts());


manager.updateProduct(1, {
    title: "Producto actualizado",
    description: "Descripción actualizada",
    price: 300,
    img: "imagen_actualizada",
    code: "xyz789",
    stock: 30
});


manager.deleteProduct(1);
