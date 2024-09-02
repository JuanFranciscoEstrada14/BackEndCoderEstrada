require('dotenv').config(); 

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const config = require('./src/config/config'); 
const logger = require('./src/config/logger'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swaggerConfig');

const app = express();

require('./src/passport/config'); 
require('./src/passport/jwt');     

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const authRoutes = require('./src/controllers/auth');
const cartRoutes = require('./src/controllers/carts');
const productRoutes = require('./src/controllers/products');
const viewRoutes = require('./src/controllers/views');
const mockingRoutes = require('./src/controllers/mocking'); 
const loggerRoutes = require('./src/controllers/loggertest'); 
const userRoutes = require('./src/routes/users'); 
const adminRoutes = require('./src/routes/admin'); 

app.use('/api/auth', authRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/', viewRoutes);
app.use('/api', mockingRoutes); 
app.use('/api/loggerTest', loggerRoutes); 
app.use('/api/users', userRoutes); 
app.use('/admin', adminRoutes); 

app.use((err, req, res, next) => {
  logger.error('Error: ' + err.message); 
  console.error(err.stack); 
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('Conectado a MongoDB')) 
    .catch(err => logger.error('Error al conectar a MongoDB: ' + err.message)); 

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en el puerto ${PORT}`);
});
