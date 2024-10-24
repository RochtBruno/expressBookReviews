const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configuração da sessão para rotas de clientes
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Middleware de autenticação para rotas protegidas
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }
    jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido.' });
        }
        req.session.user = user;  // Armazena o usuário autenticado na sessão
        next();
    });
});

// Definição das rotas
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Inicia o servidor
const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
