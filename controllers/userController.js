const User = require('../models/user'); // Path to your User model
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Signup controller
exports.signup = async (req, res) => {
    const { name, email, password } = req.body; // Extract user input from the request
    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If the email is already registered, send an error message
            return res.status(400).send('Email already exists. Please use a different one.');
        }

        // Hash the user's password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        // Set the user in the session after successful signup
        req.session.user = newUser;

        // Redirect the user to the home page
        res.redirect('/');
    } catch (error) {
        // Log the error if something goes wrong
        console.error('Error signing up user:', error);
        res.status(500).send('Server error');
    }
};

// Login controller
exports.login = async (req, res) => {
    const { email, password } = req.body; // Extract login credentials from the request
    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // If no user is found or password doesn't match, return an error
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).send('Invalid credentials');
        }

        // Set the user in the session after successful login
        req.session.user = user;

        // Redirect to the home page
        res.redirect('/');
    } catch (error) {
        // Log the error if something goes wrong
        console.error('Error logging in user:', error);
        res.status(500).send('Server error');
    }
};

// Logout controller
exports.logout = (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy(err => {
        if (err) {
            console.error('Error logging out:', err);
            res.status(500).send('Server error');
        } else {
            // Redirect to the login page after successful logout
            res.redirect('/login');
        }
    });
};
