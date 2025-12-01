const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

class LoginController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ erro: true, msg: "Email e senha são obrigatórios!" });
      }

      const usuario = await prisma.usuario.findUnique({ where: { email } });

      if (!usuario) {
        return res.status(401).json({ erro: true, msg: "Usuário não encontrado!" });
      }

      const senhaValida = await bcryptjs.compare(password, usuario.password);
      if (!senhaValida) {
        return res.status(401).json({ erro: true, msg: "Senha inválida!" });
      }

      const token = jwt.sign({ id: usuario.id }, process.env.PASSWORD_TOKEN, { expiresIn: "1h" });

      return res.status(200).json({ erro: false, token, msg: "Login realizado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ erro: true, msg: "Erro interno no servidor" });
    }
  }
}

module.exports = LoginController;
