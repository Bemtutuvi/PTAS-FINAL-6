const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ReservarMesa {
  static async cadastrar(req, res) {
    try {
      const { reservadopara, datareserva, numeromesa } = req.body;

      if (!reservadopara || !datareserva || !numeromesa) {
        return res.status(400).json({ erro: true, msg: "Preencha todos os campos!" });
      }

      const reserva = await prisma.reserva.create({
        data: {
          reservadopara,
          datareserva,
          numeromesa: parseInt(numeromesa), 
        },
      });

      return res.status(201).json({ erro: false, msg: "Mesa reservada!", reserva });
    } catch (error) {
      console.error("ERRO NA RESERVA =", error);
      return res.status(500).json({ erro: true, msg: "Erro interno!" });
    }

  }
}

module.exports = ReservarMesa;
