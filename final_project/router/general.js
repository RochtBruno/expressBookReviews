const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body; // Extrai username e password do corpo da requisição

  // Verifica se o username ou password não foram fornecidos
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Verifica se o username já existe
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // Registra o novo usuário
  users.push({ username, password }); // Você pode adicionar uma lógica para hash da senha aqui, se necessário
  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 2));
});

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Obtém o ISBN da URL

  if (books[isbn]) {
    // Verifica se o ISBN existe no objeto de livros
    return res.status(200).json(books[isbn]); // Retorna os detalhes do livro
  } else {
    return res.status(404).json({ message: "Book not found" }); // Se o ISBN não existir
  }
});

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author; // Obtém o nome do autor da URL
  const matchingBooks = []; // Array para armazenar livros que correspondem ao autor

  // Itera sobre todas as chaves do objeto 'books'
  for (const key in books) {
    if (books[key].author === author) {
      // Verifica se o autor do livro corresponde ao autor fornecido
      matchingBooks.push(books[key]); // Adiciona o livro ao array se o autor corresponder
    }
  }

  // Verifica se algum livro foi encontrado
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks); // Retorna os livros correspondentes
  } else {
    return res.status(404).json({ message: "No books found for this author" }); // Retorna erro se não encontrar livros
  }
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title; // Obtém o título do livro da URL
  const matchingBooks = []; // Array para armazenar livros que correspondem ao título

  // Itera sobre todas as chaves do objeto 'books'
  for (const key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      // Verifica se o título do livro corresponde ao título fornecido
      matchingBooks.push(books[key]); // Adiciona o livro ao array se o título corresponder
    }
  }

  // Verifica se algum livro foi encontrado
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks); // Retorna os livros correspondentes
  } else {
    return res.status(404).json({ message: "No books found with this title" }); // Retorna erro se não encontrar livros
  }
});

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Obtém o ISBN do livro da URL
  const book = books[isbn]; // Obtém o livro correspondente ao ISBN

  // Verifica se o livro existe
  if (book) {
    // Verifica se o livro tem avaliações
    if (book.reviews && book.reviews.length > 0) {
      return res.status(200).json(book.reviews); // Retorna as avaliações do livro
    } else {
      return res
        .status(404)
        .json({ message: "No reviews found for this book" }); // Retorna erro se não encontrar avaliações
    }
  } else {
    return res.status(404).json({ message: "Book not found" }); // Retorna erro se não encontrar o livro
  }
});

module.exports.general = public_users;
