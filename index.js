const express = require("express");
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



const authRoute = require("./routes/authroutes");
const authcontroller = require("./controllers/authcontroller");


app.use("/auth", authRoute);


app.get(
  "/areaLogada",
  authcontroller.vereficarAutentificacao,
  (req, res) => {
    res.json({
      msg:
        "vc está logando com o ID: " +
        req.usuarioId +
        " e está permitido a acessar esta área logada",
    });
  }
);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});

module.exports = app;