const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body; // Recupera username e password do corpo da requisição

  // Verifica se o username e password foram fornecidos
  if (!username || !password) {
    return res.status(400).json({ message: "Username e password são obrigatórios." }); // Retorna erro se faltarem dados
  }

  // Verifica se o usuário já existe
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "O nome de usuário já existe." }); // Retorna erro se o usuário já existe
  }

  // Adiciona o novo usuário à lista de usuários
  users.push({ username, password });
  return res.status(201).json({ message: "Usuário registrado com sucesso." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn; // Recupera o ISBN dos parâmetros da requisição
  const book = books.find(b => b.isbn === isbn); // Encontra o livro com o ISBN fornecido

  if (book) {
    return res.status(200).json(JSON.stringify(book, null, 2)); // Retorna os detalhes do livro
  } else {
    return res.status(404).json({ message: "Livro não encontrado" }); // Retorna mensagem de erro se o livro não for encontrado
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author; // Recupera o autor dos parâmetros da requisição
  const booksByAuthor = books.filter(b => b.author === author); // Filtra os livros pelo autor fornecido

  if (booksByAuthor.length > 0) {
    return res.status(200).json(JSON.stringify(booksByAuthor, null, 2)); // Retorna os livros encontrados do autor
  } else {
    return res.status(404).json({ message: "Nenhum livro encontrado para este autor" }); // Retorna mensagem de erro se nenhum livro for encontrado
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title; // Recupera o título dos parâmetros da requisição
  const booksByTitle = books.filter(b => b.title === title); // Filtra os livros pelo título fornecido

  if (booksByTitle.length > 0) {
    return res.status(200).json(JSON.stringify(booksByTitle, null, 2)); // Retorna os livros encontrados com o título
  } else {
    return res.status(404).json({ message: "Nenhum livro encontrado com este título" }); // Retorna mensagem de erro se nenhum livro for encontrado
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; // Recupera o ISBN dos parâmetros da requisição
  const book = books.find(b => b.isbn === isbn); // Encontra o livro correspondente ao ISBN fornecido

  if (book && book.reviews) {
    return res.status(200).json(JSON.stringify(book.reviews, null, 2)); // Retorna as resenhas do livro
  } else {
    return res.status(404).json({ message: "Nenhuma resenha encontrada para este ISBN" }); // Retorna mensagem de erro se nenhuma resenha for encontrada
  }
});

module.exports.general = public_users;
