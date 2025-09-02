// Pagination middleware
const paginateResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
      // Toplam kayıt sayısını al
      const totalCount = await model.count();
      
      // Sayfalanmış verileri al
      const results = await model.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [['created_at', 'DESC']]
      });

      // Pagination bilgilerini hesapla
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      // Response nesnesini oluştur
      const paginationInfo = {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      };

      // Response'u req nesnesine ekle
      req.paginationInfo = paginationInfo;
      req.paginatedResults = results.rows;
      
      next();
    } catch (error) {
      console.error('Pagination hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Sayfalama işlemi başarısız'
      });
    }
  };
};

// Basit pagination helper
const createPaginationResponse = (data, page, limit, totalCount) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    success: true,
    data: data,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    }
  };
};

// URL query parametrelerini parse et
const parsePaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

module.exports = {
  paginateResults,
  createPaginationResponse,
  parsePaginationParams
};
