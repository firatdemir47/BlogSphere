const { body, validationResult } = require('express-validator');

const validateBlog = [
  body('title').trim().notEmpty().withMessage('Başlık boş olamaz'),
  body('content').trim().notEmpty().withMessage('İçerik boş olamaz'),
  body('categoryId').notEmpty().withMessage('Kategori ID gerekli').isInt().withMessage('Geçerli bir kategori ID girin'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation hataları:', errors.array());
      return res.status(400).json({ 
        success: false,
        error: errors.array()[0].msg 
      });
    }
    next();
  },
];

module.exports = validateBlog;
