const request = require("supertest");
const app = require("./index.js");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

beforeAll(async () => {
  // Limpa os registros antigos antes dos testes
  await prisma.auth.deleteMany({});
});

afterAll(async () => {
  // Fecha a conexão com o banco após os testes
  await prisma.$disconnect();
});

describe("Testes de autenticação", () => {
  let token = "";

  it("Deve cadastrar um novo usuário com sucesso", async () => {
    const res = await request(app)
      .post("/auth/cadastro")
      .send({
        nome: "Teste",
        email: `teste${Date.now()}@example.com`,
        password: "123456",
      });

    // Loga em caso de erro pra debugar facilmente
    if (res.statusCode !== 200) {
      console.error("Erro no teste de cadastro:", res.body);
    }

    expect(res.statusCode).toBe(200);
    expect(res.body.erro).toBe(false);
    expect(res.body).toHaveProperty("token");

    token = res.body.token;
  });

  it("Não deve cadastrar usuário com email duplicado", async () => {
    const email = `dup${Date.now()}@example.com`;

    // Cadastra pela primeira vez
    await request(app).post("/auth/cadastro").send({
      nome: "Usuário duplicado",
      email,
      password: "123456",
    });

    // Tenta cadastrar novamente com o mesmo email
    const res = await request(app).post("/auth/cadastro").send({
      nome: "Usuário duplicado",
      email,
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe(true);
  });

  it("Deve logar com sucesso com usuário válido", async () => {
    const email = `login${Date.now()}@example.com`;

    await request(app).post("/auth/cadastro").send({
      nome: "Login Teste",
      email,
      password: "123456",
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email, password: "123456" });

    if (res.statusCode !== 200) {
      console.error("Erro no login:", res.body);
    }

    expect(res.statusCode).toBe(200);
    expect(res.body.erro).toBe(false);
    expect(res.body).toHaveProperty("token");
  });

  it("Não deve logar com email inexistente", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "naotem@gmail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.erro).toBe(true);
  });

  it("Não deve logar com senha incorreta", async () => {
    const email = `senha${Date.now()}@example.com`;

    await request(app).post("/auth/cadastro").send({
      nome: "Teste senha",
      email,
      password: "123456",
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email, password: "incorreta" });

    expect(res.statusCode).toBe(401);
    expect(res.body.erro).toBe(true);
  });
});
