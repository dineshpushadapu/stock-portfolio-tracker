const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Signup
router.get('/signup', (req, res) => {
    res.render('signup');
});
router.post('/signup', userController.signup);

// Login
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', userController.login);

// Logout
router.get('/logout', userController.logout);

module.exports = router;
