const express = require('express');
const router = express.Router();
const studykitController = require('../controllers/studykitController');

// StudyKit page
router.get('/', studykitController.renderStudykit);

module.exports = router;