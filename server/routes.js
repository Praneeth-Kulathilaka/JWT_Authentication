const express = require('express');
const register = require('./register');
const login = require('./login');
const { verifyToken, checkRole } = require('./auth.middleware');

const apiRouter = express.Router();

apiRouter.post('/newuser',register);
apiRouter.post('/login',login.userLogin);
apiRouter.post('/refresh',login.refresh);
apiRouter.post('/logout', verifyToken, login.logout);

apiRouter.get('/admin', verifyToken, checkRole(['admin']), (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});

apiRouter.get('/user', verifyToken, checkRole(['user']), (req, res) => {
    res.json({ message: 'Welcome User!' });
});

apiRouter.get('/common', verifyToken, checkRole(['admin', 'user']), (req, res) => {
    res.json({ message: 'Welcome Admin or User!' });
});

apiRouter.get('/any', verifyToken, (req, res) => {
    res.json({ message: 'Welcome authenticated user!' });
});

module.exports = apiRouter;