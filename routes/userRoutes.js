const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public routes (authentication gerekmez)
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verify-token', userController.verifyToken);

// Protected routes (authentication gerekir)
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);

module.exports = router;
