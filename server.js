const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/user'); // Path to your user model
const portfolioRoutes = require('./routes/portfolioRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Set the PORT (from environment variable or default to 3000)
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/stock_portfolio', {
    // No need for useNewUrlParser and useUnifiedTopology options
});

// MongoDB connection events
const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => {
    console.log('MongoDB connected successfully!');
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Set up view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

// Middleware for checking user authentication
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/', (req, res, next) => {
    if (!req.session.user && req.path !== '/login' && req.path !== '/signup') {
        return res.redirect('/login');
    }
    next();
});
app.use('/', userRoutes);
app.use('/', portfolioRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
