const tagRepository = require('../repositories/tagRepository');

class TagService {
    // Tüm etiketleri getir
    async getAllTags() {
        try {
            const tags = await tagRepository.getAllTags();
            return tags;
        } catch (error) {
            throw error;
        }
    }

    // ID ile etiket getir
    async getTagById(id) {
        try {
            const tag = await tagRepository.getTagById(id);
            if (!tag) {
                throw new Error('Etiket bulunamadı');
            }
            return tag;
        } catch (error) {
            throw error;
        }
    }

    // İsim ile etiket getir
    async getTagByName(name) {
        try {
            const tag = await tagRepository.getTagByName(name);
            return tag;
        } catch (error) {
            throw error;
        }
    }

    // Yeni etiket oluştur
    async createTag(tagData) {
        try {
            // Etiket adı kontrolü
            if (!tagData.name || tagData.name.trim().length === 0) {
                throw new Error('Etiket adı gerekli');
            }

            // Etiket adı zaten var mı kontrol et
            const existingTag = await this.getTagByName(tagData.name.trim());
            if (existingTag) {
                throw new Error('Bu etiket adı zaten kullanılıyor');
            }

            const tag = await tagRepository.createTag({
                name: tagData.name.trim(),
                description: tagData.description || null,
                color: tagData.color || '#007bff'
            });

            return tag;
        } catch (error) {
            throw error;
        }
    }

    // Etiket güncelle
    async updateTag(id, updateData) {
        try {
            // Etiket var mı kontrol et
            const existingTag = await this.getTagById(id);
            if (!existingTag) {
                throw new Error('Etiket bulunamadı');
            }

            // Yeni isim başka bir etikette kullanılıyor mu kontrol et
            if (updateData.name && updateData.name !== existingTag.name) {
                const nameExists = await this.getTagByName(updateData.name.trim());
                if (nameExists) {
                    throw new Error('Bu etiket adı zaten kullanılıyor');
                }
            }

            const tag = await tagRepository.updateTag(id, {
                name: updateData.name || existingTag.name,
                description: updateData.description || existingTag.description,
                color: updateData.color || existingTag.color
            });

            return tag;
        } catch (error) {
            throw error;
        }
    }

    // Etiket sil
    async deleteTag(id) {
        try {
            const tag = await tagRepository.deleteTag(id);
            if (!tag) {
                throw new Error('Etiket bulunamadı');
            }
            return tag;
        } catch (error) {
            throw error;
        }
    }

    // Blog'a etiket ekle
    async addTagToBlog(blogId, tagId) {
        try {
            // Etiket var mı kontrol et
            await this.getTagById(tagId);
            
            const result = await tagRepository.addTagToBlog(blogId, tagId);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Blog'dan etiket kaldır
    async removeTagFromBlog(blogId, tagId) {
        try {
            const result = await tagRepository.removeTagFromBlog(blogId, tagId);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Blog'un etiketlerini getir
    async getBlogTags(blogId) {
        try {
            const tags = await tagRepository.getBlogTags(blogId);
            return tags;
        } catch (error) {
            throw error;
        }
    }

    // Etiket'e göre blog'ları getir
    async getBlogsByTag(tagId, page = 1, limit = 20) {
        try {
            const offset = (page - 1) * limit;
            const blogs = await tagRepository.getBlogsByTag(tagId, limit, offset);
            return blogs;
        } catch (error) {
            throw error;
        }
    }

    // Popüler etiketleri getir
    async getPopularTags(limit = 10) {
        try {
            const tags = await tagRepository.getPopularTags(limit);
            return tags;
        } catch (error) {
            throw error;
        }
    }

    // Blog'a birden fazla etiket ekle
    async addTagsToBlog(blogId, tagNames) {
        try {
            const results = [];
            
            for (const tagName of tagNames) {
                let tag = await this.getTagByName(tagName.trim());
                
                // Etiket yoksa oluştur
                if (!tag) {
                    tag = await this.createTag({ name: tagName.trim() });
                }
                
                // Blog'a ekle
                await this.addTagToBlog(blogId, tag.id);
                results.push(tag);
            }
            
            return results;
        } catch (error) {
            throw error;
        }
    }

    // Blog'un tüm etiketlerini güncelle
    async updateBlogTags(blogId, tagNames) {
        try {
            // Mevcut etiketleri kaldır
            const currentTags = await this.getBlogTags(blogId);
            for (const tag of currentTags) {
                await this.removeTagFromBlog(blogId, tag.id);
            }
            
            // Yeni etiketleri ekle
            if (tagNames && tagNames.length > 0) {
                await this.addTagsToBlog(blogId, tagNames);
            }
            
            return await this.getBlogTags(blogId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TagService();
