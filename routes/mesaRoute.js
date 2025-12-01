const express = require("express");
const path = require("path");

const Reserva_de_Mesa = require("../controllers/ReservaMesa");
const Cadastro_de_Mesa = require("../controllers/Cadastrarmesa");

const router = express.Router(); 

// cadastro de mesa
router.get("/cadastro_mesa", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/cadastrarMesa.html"));
});
router.post("/cadastro_mesa", Cadastro_de_Mesa.cadastrar);

// reserva de mesa
router.get("/reserva_mesa", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/reservaMesa.html"));
});

router.post("/reserva_mesa", Reserva_de_Mesa.cadastrar);


module.exports = router;
