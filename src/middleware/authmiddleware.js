// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware para verificar el token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, SECRET_KEY, async (err, user) => {
        if (err) {
            return res.redirect('/login');
        }

        // Agrega el usuario al request para acceso en las rutas
        req.user = user;

        // Verificar si el usuario existe en la base de datos
        const existingUser = await User.findById(user.id);
        if (!existingUser) {
            return res.redirect('/login');
        }

        next();
    });
};

// Middleware para verificar roles
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ status: 'error', message: 'Acceso denegado' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRole };
