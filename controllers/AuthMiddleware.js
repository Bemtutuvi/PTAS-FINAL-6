const jwt = require("jsonwebtoken");

class AuthMiddleware {
  static autenticar(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ erro: true, msg: "Acesso negado!" });
    }

    try {
      const decoded = jwt.verify(token, process.env.PASSWORD_TOKEN);
      req.usuarioId = decoded.id;
      next();
    } catch (error) {
      res.status(400).json({ erro: true, msg: "Token inválido!" });
    }
  }
}

module.exports = AuthMiddleware;
