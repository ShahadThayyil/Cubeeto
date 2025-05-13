const StudyKit = require('../models/StudyKit');

// Render studykit page
exports.renderStudykit = async (req, res) => {
  try {
    // Get visible study kit cards
    const studyKits = await StudyKit.find({ isVisible: true });
    
    res.render('studykit/index', { 
      title: 'Study Kit',
      studyKits
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};