const request = require("supertest");
const app = require("../index");

// testes de autentificação
describe("Testes de autenticação", () => {
  let token = "";

  // testar o cadastro
  it("Deve cadastrar um novo usuário com sucesso", async () => {
    const res = await request(app)
      .post("/auth/cadastro")
      .send({
        nome: "Usuário Teste",
        email: `teste${Date.now()}@example.com`, // evita conflito
        password: "123456",
      });

    // verificar se foi cadastrado com sucesso e enviar uma confirmação
    expect(res.statusCode).toBe(200);
    expect(res.body.erro).toBe(false);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  // testar se n cadastra com email duplicado
  it("Não deve cadastrar usuário com email duplicado", async () => {
    const res = await request(app).post("/auth/cadastro").send({
      nome: "Usuário Teste",
      email: "duplicado@example.com",
      password: "123456",
    });

    // primeiro cadastro deve ser bem sucessedido
    await request(app).post("/auth/cadastro").send({
      nome: "Usuário Teste",
      email: "duplicado@example.com",
      password: "123456",
    });

    // segundo deve falhar
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe(true);
  });

  // testar o login
  it("Deve logar com sucesso com usuário válido", async () => {
    const email = `login${Date.now()}@example.com`;
    await request(app).post("/auth/cadastro").send({
      nome: "Login Teste",
      email,
      password: "123456",
    });

    // tentar logar
    const res = await request(app)
      .post("/auth/login")
      .send({ email, password: "123456" });

    // verificar se o login foi bem sucedido
    expect(res.statusCode).toBe(200);
    expect(res.body.erro).toBe(false);
    expect(res.body).toHaveProperty("token");
  });

  // testar login com email inexistente
  it("Não deve logar com email inexistente", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "naoexiste@example.com",
      password: "123456",
    });

    // verificar se o login retornando a mensagem de erro
    expect(res.statusCode).toBe(401);
    expect(res.body.erro).toBe(true);
  });

  // testar login com senha incorreta
  it("Não deve logar com senha incorreta", async () => {
    const email = `senha${Date.now()}@example.com`;
    await request(app).post("/auth/cadastro").send({
      nome: "Senha Teste",
      email,
      password: "123456",
    });

    // tentar logar com senha errada e encainhar o erro
    const res = await request(app)
      .post("/auth/login")
      .send({ email, password: "errada" });

    // verificar se o login retornando a mensagem de erro
    expect(res.statusCode).toBe(401);
    expect(res.body.erro).toBe(true);
  });
});
