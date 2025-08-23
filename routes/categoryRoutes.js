const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

// Public routes (authentication gerekmez)
router.get('/', categoryController.getAllCategories);
router.get('/with-blog-count', categoryController.getCategoriesWithBlogCount);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/blog-count', categoryController.getBlogCountByCategory);

// Protected routes (authentication gerekir)
router.post('/', authenticateToken, requireAdmin, categoryController.createCategory);
router.put('/:id', authenticateToken, requireAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateToken, requireAdmin, categoryController.deleteCategory);

module.exports = router;
