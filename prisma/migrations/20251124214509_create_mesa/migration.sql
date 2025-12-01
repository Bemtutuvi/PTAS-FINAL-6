-- CreateTable
CREATE TABLE "usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "mesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numeroMesa" INTEGER NOT NULL,
    "quantidadeAcentos" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "reserva" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reservadopara" TEXT NOT NULL,
    "datareserva" TEXT NOT NULL,
    "numeromesa" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
