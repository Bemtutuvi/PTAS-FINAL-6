const express = require("express");
const path = require("path");

const CadastroController = require("../controllers/CadastroController");
const LoginController = require("../controllers/LoginController");

const router = express.Router();

// Cadastro de usuário
router.get("/cadastro_usuario", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/cadastro.html"));
});
router.post("/cadastro_usuario", CadastroController.cadastrar);

// Login de usuário
router.get("/login_usuario", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});
router.post("/login_usuario", LoginController.login);

module.exports = router;
