const categoryService = require('../services/categoryService');

class CategoryController {
    // Tüm kategorileri getirme
    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            
            res.status(200).json({
                success: true,
                data: categories
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Kategorileri blog sayıları ile birlikte getirme
    async getCategoriesWithBlogCount(req, res) {
        try {
            const categories = await categoryService.getCategoriesWithBlogCount();
            
            res.status(200).json({
                success: true,
                data: categories
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ID ile kategori getirme
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await categoryService.getCategoryById(id);
            
            res.status(200).json({
                success: true,
                data: category
            });

        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // Yeni kategori oluşturma
    async createCategory(req, res) {
        try {
            const { name, description, icon, color } = req.body;

            // Gerekli alanları kontrol et
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Kategori adı gerekli'
                });
            }

            const newCategory = await categoryService.createCategory({
                name,
                description,
                icon: icon || '📚',
                color: color || '#007bff'
            });

            res.status(201).json({
                success: true,
                message: 'Kategori başarıyla oluşturuldu',
                data: newCategory
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Kategori güncelleme
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { name, description, icon, color } = req.body;

            // Gerekli alanları kontrol et
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Kategori adı gerekli'
                });
            }

            const updatedCategory = await categoryService.updateCategory(id, {
                name,
                description,
                icon: icon || '📚',
                color: color || '#007bff'
            });

            res.status(200).json({
                success: true,
                message: 'Kategori başarıyla güncellendi',
                data: updatedCategory
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Kategori silme
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const deletedCategory = await categoryService.deleteCategory(id);

            res.status(200).json({
                success: true,
                message: 'Kategori başarıyla silindi',
                data: deletedCategory
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Kategoriye ait blog sayısını getirme
    async getBlogCountByCategory(req, res) {
        try {
            const { id } = req.params;
            const blogCount = await categoryService.getBlogCountByCategory(id);

            res.status(200).json({
                success: true,
                data: { categoryId: id, blogCount }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CategoryController();
