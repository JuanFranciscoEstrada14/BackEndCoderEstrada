function authorizeRoles(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'No estás autenticado' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'No tienes permisos para acceder a este recurso' });
    }
    next();
  };
}

module.exports = authorizeRoles;
