const tagService = require('../services/tagService');

// Tüm etiketleri getir
const getAllTags = async (req, res) => {
    try {
        const tags = await tagService.getAllTags();

        res.status(200).json({
            success: true,
            data: tags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Etiketler alınırken hata oluştu',
            error: error.message
        });
    }
};

// ID ile etiket getir
const getTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await tagService.getTagById(id);

        res.status(200).json({
            success: true,
            data: tag
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Etiket bulunamadı',
            error: error.message
        });
    }
};

// Yeni etiket oluştur
const createTag = async (req, res) => {
    try {
        const { name, description, color } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Etiket adı gerekli'
            });
        }

        const tag = await tagService.createTag({ name, description, color });

        res.status(201).json({
            success: true,
            message: 'Etiket başarıyla oluşturuldu',
            data: tag
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Etiket oluşturulurken hata oluştu',
            error: error.message
        });
    }
};

// Etiket güncelle
const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const tag = await tagService.updateTag(id, updateData);

        res.status(200).json({
            success: true,
            message: 'Etiket başarıyla güncellendi',
            data: tag
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Etiket güncellenirken hata oluştu',
            error: error.message
        });
    }
};

// Etiket sil
const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await tagService.deleteTag(id);

        res.status(200).json({
            success: true,
            message: 'Etiket başarıyla silindi',
            data: tag
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Etiket silinirken hata oluştu',
            error: error.message
        });
    }
};

// Blog'un etiketlerini getir
const getBlogTags = async (req, res) => {
    try {
        const { blogId } = req.params;
        const tags = await tagService.getBlogTags(blogId);

        res.status(200).json({
            success: true,
            data: tags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Blog etiketleri alınırken hata oluştu',
            error: error.message
        });
    }
};

// Etiket'e göre blog'ları getir
const getBlogsByTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const blogs = await tagService.getBlogsByTag(tagId, parseInt(page), parseInt(limit));

        res.status(200).json({
            success: true,
            data: blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Etiket blog\'ları alınırken hata oluştu',
            error: error.message
        });
    }
};

// Popüler etiketleri getir
const getPopularTags = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const tags = await tagService.getPopularTags(parseInt(limit));

        res.status(200).json({
            success: true,
            data: tags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Popüler etiketler alınırken hata oluştu',
            error: error.message
        });
    }
};

// Blog'a etiket ekle
const addTagToBlog = async (req, res) => {
    try {
        const { blogId, tagId } = req.params;
        const result = await tagService.addTagToBlog(blogId, tagId);

        res.status(200).json({
            success: true,
            message: 'Etiket blog\'a eklendi',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Etiket blog\'a eklenirken hata oluştu',
            error: error.message
        });
    }
};

// Blog'dan etiket kaldır
const removeTagFromBlog = async (req, res) => {
    try {
        const { blogId, tagId } = req.params;
        const result = await tagService.removeTagFromBlog(blogId, tagId);

        res.status(200).json({
            success: true,
            message: 'Etiket blog\'dan kaldırıldı',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Etiket blog\'dan kaldırılırken hata oluştu',
            error: error.message
        });
    }
};

// Blog'un tüm etiketlerini güncelle
const updateBlogTags = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { tags } = req.body;

        const updatedTags = await tagService.updateBlogTags(blogId, tags);

        res.status(200).json({
            success: true,
            message: 'Blog etiketleri güncellendi',
            data: updatedTags
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Blog etiketleri güncellenirken hata oluştu',
            error: error.message
        });
    }
};

module.exports = {
    getAllTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag,
    getBlogTags,
    getBlogsByTag,
    getPopularTags,
    addTagToBlog,
    removeTagFromBlog,
    updateBlogTags
};
