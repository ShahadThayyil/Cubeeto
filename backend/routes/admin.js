const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const { isAdmin, isMainAdmin } = require('../middlewares/auth');

// Admin login page
router.get('/login', authController.renderAdminLogin);

// Admin login handle
router.post('/login', authController.adminLogin);

// Admin dashboard
router.get('/dashboard', isAdmin, adminController.renderDashboard);

// User management
router.get('/users', isMainAdmin, adminController.renderUserManagement);
router.put('/users/:id/toggle-admin', isMainAdmin, adminController.toggleUserAdmin);
router.delete('/users/:id', isMainAdmin, adminController.deleteUser);

// Product approval
router.get('/products/:id/view', isAdmin, adminController.viewAnyProduct);
router.get('/products-approval', isAdmin, adminController.renderProductApproval);
router.put('/products/:id/approve', isAdmin, adminController.approveProduct);
router.delete('/products/:id/reject', isAdmin, adminController.rejectProduct);

// Note approval
router.get('/notes-approval', isAdmin, adminController.renderNoteApproval);
router.put('/notes/:id/approve', isAdmin, adminController.approveNote);
router.delete('/notes/:id/reject', isAdmin, adminController.rejectNote);

// Study Kit management
router.get('/studykit', isAdmin, adminController.renderStudyKitManagement);
router.post('/studykit', isAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
], adminController.createStudyKit);
router.put('/studykit/:id', isAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
], adminController.updateStudyKit);
router.delete('/studykit/:id', isAdmin, adminController.deleteStudyKit);

module.exports = router;