const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Um nome de usuário é válido se ele tiver entre 3 e 20 caracteres e não contiver caracteres especiais
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // Permite letras, números e sublinhados
  return usernameRegex.test(username);
};

// Function to check if username and password match the records
const authenticatedUser = (username, password) => {
  // Busca o usuário na lista de usuários
  const user = users.find((user) => user.username === username);

  // Verifica se o usuário existe e se a senha coincide
  return user && user.password === password;
};

// Rota para registrar um novo usuário
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body; // Extrai username e password do corpo da requisição

  // Verifica se o username ou password não foram fornecidos
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username e password são obrigatórios." });
  }

  // Verifica se o username já existe
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username já existe." });
  }

  // Registra o novo usuário
  users.push({ username, password }); // Adicione lógica para hash da senha se necessário
  return res.status(201).json({ message: "Usuário registrado com sucesso." });
});

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body; // Recupera o username e password do corpo da requisição

  // Valida se username e password foram fornecidos
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username e password são obrigatórios." }); // Retorna erro se faltarem dados
  }

  // Verifica se o usuário existe e se a senha está correta
  const user = users.find((user) => user.username === username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Usuário ou senha inválidos." }); // Retorna erro de autenticação
  }

  // Cria um token JWT com os dados do usuário
  const token = jwt.sign({ username }, "seu_segredo", { expiresIn: "1h" }); // Troque 'seu_segredo' por uma chave secreta segura

  // Retorna o token ao cliente
  return res.status(200).json({ message: "Login bem-sucedido", token });
});

// Adicionar ou modificar uma resenha de livro
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body; // Recupera a resenha do corpo da requisição
  const isbn = req.params.isbn; // Recupera o ISBN da URL
  const username = req.session.user.username; // Obtém o nome de usuário da sessão

  // Verifica se a resenha foi fornecida
  if (!review) {
    return res.status(400).json({ message: "A resenha é obrigatória." });
  }

  // Verifica se o livro com o ISBN fornecido existe
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Livro não encontrado." });
  }

  // Inicializa a lista de resenhas se não existir
  if (!book.reviews) {
    book.reviews = {};
  }

  // Adiciona ou modifica a resenha do usuário
  book.reviews[username] = review;

  return res.status(200).json({
    message: "Resenha adicionada ou modificada com sucesso.",
    reviews: book.reviews,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Recupera o ISBN da URL
  const username = req.session.user.username; // Obtém o nome de usuário da sessão

  // Verifica se o livro com o ISBN fornecido existe
  const book = books[isbn];
  if (!book || !book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "Resenha não encontrada." });
  }

  // Deleta a resenha do usuário
  delete book.reviews[username];

  return res
    .status(200)
    .json({ message: "Resenha deletada com sucesso.", reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
