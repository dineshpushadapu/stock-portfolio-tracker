const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController'); // Correct path

router.get('/', portfolioController.getPortfolios);
router.post('/portfolios', portfolioController.addPortfolio);
router.get('/portfolios/:id/edit', portfolioController.editPortfolioForm); 
router.post('/portfolios/:id', portfolioController.editPortfolio);
router.post('/portfolios/:id/delete', portfolioController.deletePortfolio);

module.exports = router;
