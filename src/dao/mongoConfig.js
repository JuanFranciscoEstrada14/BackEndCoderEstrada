const mongoose = require('mongoose');

const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://juan14estrada:eltalar03@coder-ecommerce.nlkws.mongodb.net/tu_base_de_datos?retryWrites=true&w=majority');
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
};

module.exports = { connectToMongoDB };
