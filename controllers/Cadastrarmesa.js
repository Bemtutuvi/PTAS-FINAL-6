const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class Cadastro_de_Mesa {
  static async cadastrar(req, res) {
    try {
      const { numero_de_Mesa, quantidade_de_Acentos } = req.body;

      if (!numero_de_Mesa || !quantidade_de_Acentos) {
        return res.status(400).json({
          erro: true,
          msg: "Número da mesa e quantidade de acentos são obrigatórios!"
        });
      }

      const novaMesa = await prisma.mesa.create({
        data: {
          numeroMesa: parseInt(numero_de_Mesa),
          quantidadeAcentos: parseInt(quantidade_de_Acentos)
        }
      });

      return res.status(200).json({
        erro: false,
        msg: "Mesa cadastrada com sucesso!",
        mesa: novaMesa
      });

    } catch (error) {
      console.error("ERRO NO CADASTRO =", error);

      return res.status(500).json({
        erro: true,
        msg: "Erro interno no servidor"
      });
    }
  }
}

module.exports = Cadastro_de_Mesa;
