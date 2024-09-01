const jwt = require('jsonwebtoken');
const User = require('../dao/models/User');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware para verificar el token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.redirect('/login');
    }
    req.user = decoded;
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