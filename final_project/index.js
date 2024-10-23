const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    app.use("/customer/auth/*", function auth(req, res, next) {
        // Verifica se o token de acesso está presente no cabeçalho da solicitação
        const token = req.headers['authorization']?.split(' ')[1]; // Ex: "Bearer TOKEN"
    
        if (!token) {
            return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
        }
    
        // Verifica e decodifica o token
        jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token inválido.' });
            }
            
            // Salva os dados do usuário na sessão
            req.session.user = user;
            next(); // Chama o próximo middleware ou rota
        });
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
