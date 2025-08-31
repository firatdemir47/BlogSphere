const categoryRepository = require('../repositories/categoryRepository');

class CategoryService {
    // Tüm kategorileri getirme
    async getAllCategories() {
        try {
            const categories = await categoryRepository.findAll();
            return categories;
        } catch (error) {
            throw new Error('Kategoriler getirilemedi: ' + error.message);
        }
    }

    // Kategorileri blog sayıları ile birlikte getirme
    async getCategoriesWithBlogCount() {
        try {
            const categories = await categoryRepository.findAllWithBlogCount();
            return categories;
        } catch (error) {
            throw new Error('Kategoriler getirilemedi: ' + error.message);
        }
    }

    // ID ile kategori getirme
    async getCategoryById(id) {
        try {
            const category = await categoryRepository.findById(id);
            if (!category) {
                throw new Error('Kategori bulunamadı');
            }
            return category;
        } catch (error) {
            throw new Error('Kategori getirilemedi: ' + error.message);
        }
    }

    // Yeni kategori oluşturma
    async createCategory(categoryData) {
        try {
            const { name, description, icon, color } = categoryData;

            // Kategori adı kontrolü
            if (!name || name.trim().length === 0) {
                throw new Error('Kategori adı gerekli');
            }

            // Aynı isimde kategori var mı kontrolü
            const existingCategory = await categoryRepository.findByName(name.trim());
            if (existingCategory) {
                throw new Error('Bu isimde bir kategori zaten mevcut');
            }

            const newCategory = await categoryRepository.createCategory({
                name: name.trim(),
                description: description || '',
                icon: icon || '📚',
                color: color || '#007bff'
            });

            return newCategory;
        } catch (error) {
            throw new Error('Kategori oluşturulamadı: ' + error.message);
        }
    }

    // Kategori güncelleme
    async updateCategory(id, updateData) {
        try {
            const { name, description, icon, color } = updateData;

            // Kategori var mı kontrolü
            const existingCategory = await categoryRepository.findById(id);
            if (!existingCategory) {
                throw new Error('Kategori bulunamadı');
            }

            // Kategori adı kontrolü
            if (!name || name.trim().length === 0) {
                throw new Error('Kategori adı gerekli');
            }

            // Aynı isimde başka kategori var mı kontrolü
            if (name.trim() !== existingCategory.name) {
                const duplicateCategory = await categoryRepository.findByName(name.trim());
                if (duplicateCategory) {
                    throw new Error('Bu isimde bir kategori zaten mevcut');
                }
            }

            const updatedCategory = await categoryRepository.updateCategory(id, {
                name: name.trim(),
                description: description || '',
                icon: icon || '📚',
                color: color || '#007bff'
            });

            return updatedCategory;
        } catch (error) {
            throw new Error('Kategori güncellenemedi: ' + error.message);
        }
    }

    // Kategori silme
    async deleteCategory(id) {
        try {
            // Kategori var mı kontrolü
            const existingCategory = await categoryRepository.findById(id);
            if (!existingCategory) {
                throw new Error('Kategori bulunamadı');
            }

            // Kategoriye ait blog var mı kontrolü
            const blogCount = await categoryRepository.getBlogCountByCategory(id);
            if (blogCount > 0) {
                throw new Error('Bu kategoriye ait blog\'lar bulunuyor. Önce blog\'ları silin.');
            }

            const deletedCategory = await categoryRepository.deleteCategory(id);
            return deletedCategory;
        } catch (error) {
            throw new Error('Kategori silinemedi: ' + error.message);
        }
    }

    // Kategoriye ait blog sayısını getirme
    async getBlogCountByCategory(categoryId) {
        try {
            const blogCount = await categoryRepository.getBlogCountByCategory(categoryId);
            return blogCount;
        } catch (error) {
            throw new Error('Blog sayısı getirilemedi: ' + error.message);
        }
    }
}

module.exports = new CategoryService();
