
const jwt = require('jsonwebtoken');
const User = require('./user');

// Middleware para proteger rotas
exports.protect = async (req, res, next) => {
  let token;

  // Verificar se o token existe no header de autorização
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Formato: Bearer token
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar se o token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Não autorizado para acessar esta rota'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adicionar usuário ao request
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Não autorizado para acessar esta rota'
    });
  }
};