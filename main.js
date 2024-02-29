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
    static ultId = 0;

    constructor () {
        this.products = []
    }

    addProduct(title, description, price, img, code, stock) {
        if(!title || !description || !price || !img || !code || !stock  ) {
            console.log ("Completar todos los datos es obligatorio");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error('Este código ya está en uso.');
            return;
        }

        const product = new Product(++ProductManager.ultId, title, description, price, img, code, stock);
        this.products.push(product);
    }

    getProducts() {
        return this.products;
    }

    getProductById (id) {
        const product = this.products.find(item => item.id === id);
        
        if(!product) {
            console.log("No se encontró este producto")
        } else {
            console.log("Se encontró!", product);
        }
    }
}

const manager = new ProductManager () ;

console.log(manager.getProducts());

manager.addProduct("Producto prueba" , "Este es un producto prueuba", 200, "sin imagen", "abc123" , 25);

console.log(manager.getProducts());

manager.getProductById(1);
manager.getProductById(33);
