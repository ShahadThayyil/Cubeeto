const express = require('express');
const router = express.Router();
const userDashboardController = require('../controllers/userDashboardController');
const { isAuthenticated } = require('../middlewares/auth');

// Dashboard
router.get('/', isAuthenticated, userDashboardController.renderDashboard);

// NoteBank management
router.get('/notebank', isAuthenticated, userDashboardController.renderNotebankManagement);

// Sell management
router.get('/sell', isAuthenticated, userDashboardController.renderSellManagement);

// Rent management
router.get('/rent', isAuthenticated, userDashboardController.renderRentManagement);

// Delete product
router.delete('/product/:id', isAuthenticated, userDashboardController.deleteProduct);

// Delete note
router.delete('/note/:id', isAuthenticated, userDashboardController.deleteNote);

module.exports = router;