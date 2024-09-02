// src/routes/users.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); // Asegúrate de que la ruta sea correcta
const upload = require('../middleware/multer'); // Middleware de Multer

// Ruta para obtener todos los usuarios (nombre, correo, rol)
router.get('/', UserController.getAllUsers);

// Ruta para limpiar usuarios inactivos
router.delete('/', UserController.deleteInactiveUsers);

// Ruta para subir documentos
router.post('/:uid/documents', upload.array('documents'), UserController.uploadDocuments);

// Ruta para actualizar a usuario a premium
router.post('/:uid/premium', UserController.promoteToPremium);

module.exports = router;
