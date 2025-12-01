require("dotenv").config();
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("views"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

const usuarioRoute = require("./routes/usuarioRoute");
app.use("/auth", usuarioRoute);

const mesaRoute = require("./routes/mesaRoute");

app.use("/mesa", mesaRoute);

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: true, msg: "Token não fornecido!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.PASSWORD_TOKEN);
    req.usuarioId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ erro: true, msg: "Token inválido!" });
  }
};

app.get("/areaLogada", verificarToken, (req, res) => {
  res.json({
    msg: `Você está logado com o ID: ${req.usuarioId} e pode acessar esta área.`,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});

module.exports = app;
