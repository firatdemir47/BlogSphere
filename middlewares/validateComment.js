const { body, validationResult } = require('express-validator');

const validateComment = [
  body('user_name').trim().notEmpty().withMessage('Kullanıcı adı boş olamaz'),
  body('content').trim().notEmpty().withMessage('Yorum içeriği boş olamaz'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateComment;


