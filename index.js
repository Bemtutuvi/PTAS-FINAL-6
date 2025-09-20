const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const authRoutes= require("./routes/authroutes");
app.use("/auth", authRoutes);

app.listen(8000, (err) => {
  if (err) {
    console.log("Erro: " + JSON.stringify(err));
  } else {
    console.log(`servidor rodando na porta http://localhost:${8000}`);
  }
});

//verificar com o lucas se o sqlite é apropriado
//fazer migracao com o prisma
//mosstrar tudo pra lucas