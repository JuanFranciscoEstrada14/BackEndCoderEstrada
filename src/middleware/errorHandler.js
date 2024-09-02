const errorMessages = {
    'PRODUCT_CREATION_ERROR': 'Error al crear el producto',
    'PRODUCT_NOT_FOUND': 'Producto no encontrado',
    'CART_NOT_FOUND': 'Carrito no encontrado',
    'PRODUCT_ADDITION_ERROR': 'Error al agregar producto al carrito',
    'PRODUCT_REMOVAL_ERROR': 'Error al eliminar producto del carrito',
    'PRODUCT_UPDATE_ERROR': 'Error al actualizar producto',
    'CART_UPDATE_ERROR': 'Error al actualizar el carrito',
    'CART_PURCHASE_ERROR': 'Error al procesar la compra',
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const errorMessage = errorMessages[err.code] || 'Error interno del servidor';

    res.status(err.status || 500).json({
        status: 'error',
        message: errorMessage
    });
};

module.exports = errorHandler;
