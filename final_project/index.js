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
        const token = req.headers['authorization']?.split(' ')[1];
    
        if (!token) {
            return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
        }
        jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token inválido.' });
            }
            req.session.user = user;
            next();
        });
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
