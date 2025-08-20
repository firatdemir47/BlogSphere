const { body, validationResult } = require('express-validator');

const validateBlogUpdate = [
  body('title').trim().notEmpty().withMessage('Başlık boş olamaz'),
  body('content').trim().notEmpty().withMessage('İçerik boş olamaz'),
  body('author').trim().notEmpty().withMessage('Yazar boş olamaz'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateBlogUpdate;
    