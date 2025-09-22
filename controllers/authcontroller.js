//tratar da password do usuario gerando e verificando hashes
const bcryptjs = require("bcryptjs");

//gera tokens de acesso para usuarios autenticados
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

class AuthController {
  static async cadastrar(req, res) {
    const { nome, email, password } = req.body;

    const salt = bcryptjs.genSaltSync(8);
    const hashPassword = bcryptjs.hashSync(password);

    const usuario = await client.usuario.create({
      data: {
        nome,
        email,
        password: hashPassword,
        tipo: "cliente",
      },
    });
    const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });
    res.json({
      mensagem:"Cadastro efetuado com sucesso!", 
      erro:false, 
      token: token,
    });
  }
  
  static async login(req, res) {
    const { email, password } = req.body;

    const usuario = await client.usuario.findUnique({
      where: { email: email },
    });
    if (usuario == null) {
      res.json({
        mensagem: "Usuário não encontrado!",
        erro: true,
      });
      return;
    }

    const passwordCorreta = bcryptjs.compareSync(password, usuario.password);

    if (!passwordCorreta) {
      res.json({
        mensagem: "password Incorreta!",
        erro: true,
      });
      return;
    }
    const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

   

    res.json({
      mensagem: "Logado!",
      erro: false,
      token: token,
    });
  }
}

module.exports = AuthController;
