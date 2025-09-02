const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Sadece resim dosyalarını kabul et
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları kabul edilir!'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maksimum 5 dosya
  }
});

// Resim optimizasyonu
const optimizeImage = async (inputPath, outputPath, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 80,
    format = 'jpeg'
  } = options;

  try {
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toFile(outputPath);
    
    // Temp dosyasını sil
    await fs.unlink(inputPath);
    
    return true;
  } catch (error) {
    console.error('Resim optimizasyonu hatası:', error);
    return false;
  }
};

// Blog resmi yükleme
const uploadBlogImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resim dosyası gerekli'
      });
    }

    const tempPath = req.file.path;
    const fileName = req.file.filename;
    const outputPath = path.join('uploads/blog-images', fileName);

    // Resmi optimize et
    const success = await optimizeImage(tempPath, outputPath, {
      width: 1200,
      height: 800,
      quality: 85
    });

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Resim işlenirken hata oluştu'
      });
    }

    // Dosya URL'ini req nesnesine ekle
    req.imageUrl = `/uploads/blog-images/${fileName}`;
    next();
  } catch (error) {
    console.error('Blog resmi yükleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Resim yüklenirken hata oluştu'
    });
  }
};

// Avatar yükleme
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Avatar dosyası gerekli'
      });
    }

    const tempPath = req.file.path;
    const fileName = req.file.filename;
    const outputPath = path.join('uploads/avatars', fileName);

    // Avatar'ı optimize et (kare format)
    const success = await optimizeImage(tempPath, outputPath, {
      width: 200,
      height: 200,
      quality: 90
    });

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Avatar işlenirken hata oluştu'
      });
    }

    req.avatarUrl = `/uploads/avatars/${fileName}`;
    next();
  } catch (error) {
    console.error('Avatar yükleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Avatar yüklenirken hata oluştu'
    });
  }
};

// Çoklu resim yükleme
const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'En az bir resim dosyası gerekli'
      });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const tempPath = file.path;
      const fileName = file.filename;
      const outputPath = path.join('uploads/blog-images', fileName);

      const success = await optimizeImage(tempPath, outputPath, {
        width: 1200,
        height: 800,
        quality: 85
      });

      if (success) {
        imageUrls.push(`/uploads/blog-images/${fileName}`);
      }
    }

    req.imageUrls = imageUrls;
    next();
  } catch (error) {
    console.error('Çoklu resim yükleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Resimler yüklenirken hata oluştu'
    });
  }
};

// Dosya silme
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Dosya silme hatası:', error);
    return false;
  }
};

module.exports = {
  upload,
  uploadBlogImage,
  uploadAvatar,
  uploadMultipleImages,
  deleteFile,
  optimizeImage
};



