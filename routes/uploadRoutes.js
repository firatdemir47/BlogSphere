const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { 
  upload, 
  uploadBlogImage, 
  uploadAvatar, 
  uploadMultipleImages 
} = require('../middlewares/uploadMiddleware');

// Blog resmi yükleme
router.post('/blog-image', 
  authenticateToken, 
  upload.single('image'), 
  uploadBlogImage,
  (req, res) => {
    res.json({
      success: true,
      message: 'Blog resmi başarıyla yüklendi',
      data: {
        imageUrl: req.imageUrl
      }
    });
  }
);

// Multer hata yakalama middleware'i
router.use((error, req, res, next) => {
  console.error('Upload error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Dosya boyutu çok büyük (maksimum 5MB)'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Çok fazla dosya seçildi (maksimum 5 dosya)'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Dosya yükleme hatası: ${error.message}`
    });
  }
  
  // Dosya tipi ve uzantı hataları
  if (error.message.includes('Geçersiz dosya tipi') || 
      error.message.includes('Geçersiz dosya uzantısı') ||
      error.message.includes('Dosya adı geçersiz')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  // Genel hata
  return res.status(500).json({
    success: false,
    message: 'Dosya yükleme sırasında beklenmeyen bir hata oluştu',
    error: error.message
  });
});

// Avatar yükleme
router.post('/avatar', 
  authenticateToken, 
  upload.single('avatar'), 
  uploadAvatar,
  (req, res) => {
    res.json({
      success: true,
      message: 'Avatar başarıyla yüklendi',
      data: {
        avatarUrl: req.avatarUrl
      }
    });
  }
);

// Çoklu resim yükleme
router.post('/multiple-images', 
  authenticateToken, 
  upload.array('images', 5), 
  uploadMultipleImages,
  (req, res) => {
    res.json({
      success: true,
      message: 'Resimler başarıyla yüklendi',
      data: {
        imageUrls: req.imageUrls
      }
    });
  }
);

// Resim bilgilerini getir
router.get('/image-info/:filename', (req, res) => {
  const { filename } = req.params;
  const fs = require('fs');
  const path = require('path');
  
  const imagePath = path.join(__dirname, '../uploads/blog-images', filename);
  
  if (fs.existsSync(imagePath)) {
    const stats = fs.statSync(imagePath);
    res.json({
      success: true,
      data: {
        filename,
        size: stats.size,
        created: stats.birthtime,
        url: `/uploads/blog-images/${filename}`
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Resim bulunamadı'
    });
  }
});

module.exports = router;



