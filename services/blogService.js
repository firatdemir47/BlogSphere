const blogRepo = require('../repositories/blogRepository');

const listAllBlogs = () => blogRepo.getAllBlogs();

const getBlog = async (id) => {
  const blog = await blogRepo.getBlogById(id);
  if (!blog) throw new Error('Blog bulunamadı');
  return blog;
};

const addBlog = (data) => blogRepo.createBlog(data);

const editBlog = async (id, data) => {
  const title = (data && typeof data.title === 'string') ? data.title.trim() : '';
  const content = (data && typeof data.content === 'string') ? data.content.trim() : '';
  const categoryId = data.categoryId;

  if (!title || !content) {
    throw new Error('Başlık ve içerik boş olamaz');
  }

  const updated = await blogRepo.updateBlog(id, { title, content, categoryId });
  if (!updated) throw new Error('Blog bulunamadı');
  return updated;
};

const removeBlog = async (id, authorId) => {
  // Blog'un yazarı mı kontrol et
  const blog = await blogRepo.getBlogById(id);
  if (!blog) throw new Error('Blog bulunamadı');
  
  if (blog.author_id !== authorId) {
    throw new Error('Bu blog\'u silme yetkiniz yok');
  }

  const deleted = await blogRepo.deleteBlog(id);
  return deleted;
};

// Kategoriye göre blog'ları getirme
const getBlogsByCategory = async (categoryId) => {
  return await blogRepo.getBlogsByCategory(categoryId);
};

// Yazara göre blog'ları getirme
const getBlogsByAuthor = async (authorId) => {
  return await blogRepo.getBlogsByAuthor(authorId);
};

// Blog arama
const searchBlogs = async (searchTerm) => {
  return await blogRepo.searchBlogs(searchTerm);
};

// View counter artırma
const incrementViewCount = async (blogId) => {
  const blog = await blogRepo.getBlogById(blogId);
  if (!blog) throw new Error('Blog bulunamadı');
  
  return await blogRepo.incrementViewCount(blogId);
};

// En popüler blog'ları getirme
const getPopularBlogs = async (limit = 10) => {
  return await blogRepo.getPopularBlogs(limit);
};

module.exports = { 
  listAllBlogs, 
  getBlog, 
  addBlog, 
  editBlog, 
  removeBlog,
  getBlogsByCategory,
  getBlogsByAuthor,
  searchBlogs,
  incrementViewCount,
  getPopularBlogs
};
