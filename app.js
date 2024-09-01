const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
require('dotenv').config();

// Inicializa Passport y las estrategias
require('./src/passport/config');  // Configuración de estrategias (Local, GitHub)
require('./src/passport/jwt');     // Configuración de estrategia JWT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura las sesiones
app.use(session({
    secret: process.env.SESSION_SECRET, // Usa SESSION_SECRET de .env
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Importa y usa las rutas
const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);

// Resto de la configuración del servidor...
// Configura el puerto y el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
