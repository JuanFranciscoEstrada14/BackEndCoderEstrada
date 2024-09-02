const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'documents';

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

const upload = multer({ storage });

module.exports = upload;
