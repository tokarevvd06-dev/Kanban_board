exports.requireFields = (...fields) => (req, res, next) => {
    for (const field of fields) {
      if (!req.body[field]) {
        const err = new Error(`${field} is required`);
        err.status = 400;
        return next(err);
      }
    }
    next();
  };