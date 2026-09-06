module.exports.paginateTasks = (req, res, next) => {
    const { page = 1, limit = 25 } = req.query;
    req.pagination = {
      limit: Number(limit),
      offset: (page - 1) * limit,
    };
  
    next();
  };