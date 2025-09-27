const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
class authcontroller {
  static async cadastrar(req, res) {
    const { nome, email, password } = req.body;

    try {
      const Hashpassword = await bcryptjs.hash(password, 10);

      const newauth = await prisma.auth.create({
        data: { nome, email, password: Hashpassword },
      });

      const token = jwt.sign(
        { id: newauth.id },
        process.env.SECRET_KEY,
        {
          expiresIn: "4h",
        }
      );

      return res.status(200).json({
        erro: false,
        token,
        msg: "Usuário cadastrado com sucesso!",
      });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(400).json({
          erro: true,
          msg: "Email já cadastrado!",
        });
      }

      return res
        .status(500)
        .json({ erro: true, msg: "Erro interno no servidor" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ erro: true, msg: "Email e password são obrigatórios!" });
      }
      const auth = await prisma.auth.findUnique({ where: { email } });
      if (!auth) {
        return res
          .status(401)
          .json({ erro: true, msg: "Usuário não encontrado!" });
      }
      const password_valid = await bcryptjs.compare(password, auth.password);
      if (!password_valid) {
        return res.status(401).json({ erro: true, msg: "Senha inválida!" });
      }
      const token = jwt.sign({ id: auth.id }, process.env.SECRET_KEY, {
        expiresIn: "4h",
      });
      
      return res.status(200).json({
        erro: false,
        token,
        msg: "Login realizado com sucesso!",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: true, msg: "Erro interno no servidor" });
    }
  }
  static async vereficarAutentificacao(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ erro: true, msg: "Acesso negado!" });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.usuarioId = decoded.id;
      next();
    } catch (error) {
      res.status(400).json({ erro: true, msg: "Token inválido!" });
    }
  }
}

module.exports = authcontroller;