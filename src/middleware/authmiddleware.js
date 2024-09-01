// src/middleware/authMiddleware.js

// Middleware para verificar el rol de usuario
function authorizeRoles(roles = []) {
  // Si roles es una cadena, conviértela en una matriz
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'No estás autenticado' });
    }

    // Verificar si el rol del usuario está en la lista de roles permitidos
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'No tienes permisos para acceder a este recurso' });
    }

    // Si el rol está permitido, continúa con la siguiente función de middleware
    next();
  };
}

module.exports = authorizeRoles;
