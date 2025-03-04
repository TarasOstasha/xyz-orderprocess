module.exports.paginateTasks = (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    console.log(page, limit)
    req.pagination = {
      limit: Number(limit),
      offset: (page - 1) * limit,
    };
  
    next();
  };