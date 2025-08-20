const { body, validationResult } = require('express-validator');

const validateBlog = [
  body('title').notEmpty().withMessage('Başlık boş olamaz'),
  body('content').notEmpty().withMessage('İçerik boş olamaz'),
  body('author').notEmpty().withMessage('Yazar boş olamaz'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateBlog;
