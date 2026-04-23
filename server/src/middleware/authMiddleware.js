const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  try {

    // 1. Проверяем заголовок
    const authHeader = req.headers.authorization;


    if (!authHeader) {
      return res.status(401).json({
        error: 'No authorization header'
      });
    }

    // 2. Проверяем формат Bearer token
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({
        error: 'Invalid token format'
      });
    }

    const scheme = parts[0];
    const token = parts[1];

    if (scheme !== 'Bearer') {
      return res.status(401).json({
        error: 'Authorization must be Bearer token'
      });
    }

    // 3. Проверяем JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    // 4. Кладём пользователя в req
    req.user = decoded;

    
    next();

  } catch (err) {
    

    return res.status(401).json({
      error: 'Invalid token'
    });
  }
};