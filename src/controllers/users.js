const express = require('express');
const router = express.Router();
const User = require('../dao/models/User');
const upload = require('../middleware/multer'); // Middleware de Multer

// Endpoint para subir documentos
router.post('/:uid/documents', upload.array('documents'), async (req, res) => {
  try {
    const userId = req.params.uid;
    const files = req.files;

    // Si no se subieron archivos
    if (!files.length) {
      return res.status(400).json({ message: 'No se han subido archivos' });
    }

    // Buscar usuario por ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar documentos del usuario
    const documents = files.map(file => ({
      name: file.originalname,
      reference: file.path
    }));
    user.documents = user.documents.concat(documents);

    await user.save();
    res.status(200).json({ message: 'Documentos subidos con éxito', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir documentos', error });
  }
});

// Endpoint para actualizar el usuario a premium
router.post('/:uid/premium', async (req, res) => {
  try {
    const userId = req.params.uid;

    // Buscar usuario por ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario ha cargado los documentos requeridos
    const requiredDocuments = [
      'Identificación',
      'Comprobante de domicilio',
      'Comprobante de estado de cuenta'
    ];

    const userDocuments = user.documents.map(doc => doc.name);
    const hasAllDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

    if (!hasAllDocuments) {
      return res.status(400).json({ message: 'El usuario no ha cargado todos los documentos requeridos' });
    }

    // Actualizar rol del usuario a premium
    user.role = 'premium';
    await user.save();

    res.status(200).json({ message: 'Usuario actualizado a premium con éxito', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario a premium', error });
  }
});

module.exports = router;
