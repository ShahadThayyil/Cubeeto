const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const marketplaceController = require('../controllers/marketplaceController');
const { isAuthenticated } = require('../middlewares/auth');
const { uploadProduct } = require('../middlewares/upload');

// Marketplace page
router.get('/', marketplaceController.renderMarketplace);

// Product details page
router.get('/details/:id', marketplaceController.renderProductDetails);

// Sell product form page
router.get('/sell', isAuthenticated, marketplaceController.renderSellForm);

// Sell product handle
router.post('/sell', isAuthenticated, 
  uploadProduct.array('images', 7), // Allow up to 6 images (1 thumbnail + 5 regular)
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('place').notEmpty().withMessage('Place is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('whatsappNumber').notEmpty().withMessage('WhatsApp number is required'),
    body('callNumber').notEmpty().withMessage('Call number is required')
  ],
  marketplaceController.sellProduct
);

module.exports = router;