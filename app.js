// app.js

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const config = require('./src/config/config'); // Importa la configuración
const logger = require('./src/config/logger'); // Importa el logger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swaggerConfig'); // Importa la configuración de Swagger

const app = express();

// Inicializa Passport y las estrategias
require('./src/passport/config');  // Configuración de estrategias (Local, GitHub)
require('./src/passport/jwt');     // Configuración de estrategia JWT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura las sesiones
app.use(session({
  secret: config.sessionSecret, // Usa sessionSecret desde config.js
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: config.mongoUri }) // Usa mongoUri desde config.js
}));

app.use(passport.initialize());
app.use(passport.session());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Importa y usa las rutas
const authRoutes = require('./src/controllers/auth');
const cartRoutes = require('./src/controllers/carts');
const productRoutes = require('./src/controllers/products');
const viewRoutes = require('./src/controllers/views');
const mockingRoutes = require('./src/controllers/mocking'); // Importa las rutas de mocking
const loggerRoutes = require('./src/controllers/loggertest'); // Importa las rutas de loggerTest
const userRoutes = require('./src/routes/users'); // Importa las rutas de usuarios
const adminRoutes = require('./src/routes/admin'); // Importa las rutas de administración

app.use('/api/auth', authRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/', viewRoutes);
app.use('/api', mockingRoutes); // Usa las rutas de mocking
app.use('/api/loggerTest', loggerRoutes); // Usa las rutas de loggerTest
app.use('/api/users', userRoutes); // Usa las rutas de usuarios
app.use('/admin', adminRoutes); // Usa las rutas de administración

// Manejador de errores
app.use((err, req, res, next) => {
  logger.error('Error: ' + err.message); // Usa el logger para errores
  console.error(err.stack); // Opcional, para mantener el log en consola
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
});

// Conexión a MongoDB
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('Conectado a MongoDB')) // Usa el logger para informar la conexión
    .catch(err => logger.error('Error al conectar a MongoDB: ' + err.message)); // Usa el logger para errores de conexión

// Configura el puerto y el servidor
const PORT = config.port || 8080;
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en el puerto ${PORT}`); // Usa el logger para informar que el servidor está corriendo
});
