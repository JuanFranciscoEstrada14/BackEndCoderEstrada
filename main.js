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

        const product = new Product(this.products.length + 1, title, description, price, img, code, stock);
        this.products.push(product);
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(item => item.id === id);
        if (!product) {
            console.log("No se encontró este producto");
        } else {
            console.log("Se encontró!", product);
        }
    }
}


const manager = new ProductManager('productos.json');

console.log(manager.getProducts());

manager.addProduct("Producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 25);

console.log(manager.getProducts());
