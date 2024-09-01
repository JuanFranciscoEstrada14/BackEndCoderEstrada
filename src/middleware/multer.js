const multer = require('multer');
const path = require('path');

// Configuración de Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'documents'; // Carpeta por defecto

    // Determina la carpeta según el tipo de archivo
    if (file.fieldname === 'profile') {
      folder = 'profiles';
    } else if (file.fieldname === 'product') {
      folder = 'products';
    }

    cb(null, path.join(__dirname, '../../uploads', folder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuración de Multer
const upload = multer({ storage });

module.exports = upload;
