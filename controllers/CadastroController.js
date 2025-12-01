const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

class CadastroController {
  static async cadastrar(req, res) {
    try {
      const { nome, email, password } = req.body;

      if (!nome || !email || !password) {
        return res.status(400).json({ erro: true, msg: "Nome, email e senha são obrigatórios para cadastro!" });
      }

      const senhaHash = await bcryptjs.hash(password, 10);

      const novoUsuario = await prisma.usuario.create({
        data: { nome, email, password: senhaHash },
      });
      
      const token = jwt.sign({ id: novoUsuario.id }, process.env.PASSWORD_TOKEN, { expiresIn: "4h" });

      return res.status(200).json({ erro: false, token, msg: "Usuário foi cadastrado com sucesso!" });
    } catch (error) {
      console.error("ERRO NO CADASTRO =", error);

      if (error.code === "P2002") {
        return res.status(400).json({ erro: true, msg: "Email já está cadastrado!" });
      }

      return res.status(500).json({ erro: true, msg: "Erro interno no servidor" });
    }
  } 
}

module.exports = CadastroController;
