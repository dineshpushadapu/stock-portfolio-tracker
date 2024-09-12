const Portfolio = require('../models/portfolio');

// Fetch all portfolios for the logged-in user
exports.getPortfolios = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const portfolios = await Portfolio.find({ user: userId });
        res.render('index', { portfolios });
    } catch (error) {
        console.error('Error fetching portfolios:', error);
        res.status(500).send('Server error');
    }
};

// Add a new portfolio
exports.addPortfolio = async (req, res) => {
    const { name, symbol, quantity, purchasePrice, currentPrice } = req.body;
    try {
        const userId = req.session.user._id;
        const newPortfolio = new Portfolio({
            name,
            user: userId, // Associate portfolio with the user
            stocks: [{
                symbol,
                quantity,
                purchasePrice,
                currentPrice,
            }]
        });
        await newPortfolio.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error adding portfolio:', error);
        res.status(500).send('Server error');
    }
};

// Show edit form for a portfolio
exports.editPortfolioForm = async (req, res) => {
    const { id } = req.params;
    try {
        const portfolio = await Portfolio.findById(id);
        if (!portfolio) throw new Error('Portfolio not found');
        if (portfolio.user.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Forbidden');
        }
        res.render('edit', { portfolio });
    } catch (error) {
        console.error('Error fetching portfolio for edit:', error);
        res.status(500).send('Server error');
    }
};

// Update a portfolio
exports.editPortfolio = async (req, res) => {
    const { id } = req.params;
    const { name, symbol, quantity, purchasePrice, currentPrice } = req.body;
    try {
        const portfolio = await Portfolio.findById(id);
        if (!portfolio) throw new Error('Portfolio not found');
        if (portfolio.user.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Forbidden');
        }
        await Portfolio.findByIdAndUpdate(id, {
            name,
            stocks: [{ symbol, quantity, purchasePrice, currentPrice }]
        }, { new: true });
        res.redirect('/');
    } catch (error) {
        console.error('Error editing portfolio:', error);
        res.status(500).send('Server error');
    }
};

// Delete a portfolio
exports.deletePortfolio = async (req, res) => {
    const { id } = req.params;
    try {
        const portfolio = await Portfolio.findById(id);
        if (!portfolio) throw new Error('Portfolio not found');
        if (portfolio.user.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Forbidden');
        }
        await Portfolio.findByIdAndDelete(id);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting portfolio:', error);
        res.status(500).send('Server error');
    }
};
