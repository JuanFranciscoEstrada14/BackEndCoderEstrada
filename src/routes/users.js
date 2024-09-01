// src/routes/users.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); // Ajusta según tu estructura

// Ruta para actualizar a usuario a premium
router.put('/premium/:uid', UserController.promoteToPremium);

// Ruta para subir documentos
router.post('/:uid/documents', UserController.uploadDocuments);

module.exports = router;
