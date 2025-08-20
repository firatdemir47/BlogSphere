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
  const author = (data && typeof data.author === 'string') ? data.author.trim() : '';

  if (!title || !content || !author) {
    throw new Error('Başlık, içerik ve yazar boş olamaz');
  }

  const updated = await blogRepo.updateBlog(id, { title, content, author });
  if (!updated) throw new Error('Blog bulunamadı');
  return updated;
};

const removeBlog = async (id) => {
  const deleted = await blogRepo.deleteBlog(id);
  if (!deleted) throw new Error('Blog bulunamadı');
  return deleted;
};

module.exports = { listAllBlogs, getBlog, addBlog, editBlog, removeBlog };
