exports.requireFields = (...fields) => (req, res, next) => {
    for (const field of fields) {
      const value = req.body[field];
  
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        const err = new Error(`${field} is required`);
        err.status = 400;
        return next(err);
      }
    }
    next();
  };