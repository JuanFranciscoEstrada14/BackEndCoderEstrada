const fs = require('fs').promises;

class Product {
    constructor(id, title, description, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
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

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (err) {
            console.error('Error al cargar los productos:', err);
            this.products = [];
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (err) {
            console.error('No se guardaron los productos:', err);
        }
    }

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Completar todos los datos es obligatorio");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error('El código ya está en uso.');
            return;
        }

        const newId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
        const product = new Product(newId, title, description, price, thumbnail, code, stock);
        this.products.push(product);
        await this.saveProducts();
    }

    async getProducts() {
        await this.loadProducts();
        return this.products;
    }

    async getProductById(id) {
        await this.loadProducts();
        const product = this.products.find(item => item.id === id);
        if (!product) {
            console.error('Producto no encontrado');
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        await this.loadProducts();
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            await this.saveProducts();
            console.log(`Producto con ID ${id} actualizado exitosamente.`);
        } else {
            console.error(`No se encontró ningún producto con ID ${id}.`);
        }
    }

    async deleteProduct(id) {
        await this.loadProducts();
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            await this.saveProducts();
            console.log(`Producto con ID ${id} eliminado exitosamente.`);
        } else {
            console.error(`No se encontró ningún producto con ID ${id}.`);
        }
    }
}

module.exports = ProductManager;
