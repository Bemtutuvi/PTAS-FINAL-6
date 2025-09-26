const router = require("express").Router();

const AuthController = require("../controllers/authcontroller");

router.post("/cadastro", AuthController.cadastrar);

router.post("/login", AuthController.login);

module.exports = router;

