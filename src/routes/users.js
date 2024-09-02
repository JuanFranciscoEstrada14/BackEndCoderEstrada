const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); 
const upload = require('../middleware/multer');

router.get('/', UserController.getAllUsers);
router.delete('/', UserController.deleteInactiveUsers);
router.post('/:uid/documents', upload.array('documents'), UserController.uploadDocuments);
router.post('/:uid/premium', UserController.promoteToPremium);

module.exports = router;
