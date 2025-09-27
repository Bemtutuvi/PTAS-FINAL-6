const express = require("express");
const app = express();

// configurar o express para receber json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ola mundo?");
});

// rotas de usuario
const usuarioRoute = require("./routes/usuarioRoute");
const UsuarioController = require("./controllers/UsuarioController");

//mudei o /usuario para /auth
app.use("/auth", usuarioRoute);

// vereficar se vc esta logado
app.get(
  "/areaLogada",
  UsuarioController.vereficarAutentificacao,
  (req, res) => {
    res.json({
      msg:
        "vc está logando com o ID: " +
        req.usuarioId +
        " e está permitido a acessar esta área logada",
    });
  }
);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});

module.exports = app;
