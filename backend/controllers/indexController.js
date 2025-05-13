const Product = require('../models/Product');
const Note = require('../models/Note');

// Render home page
exports.renderHome = async (req, res) => {
  try {
    // Get latest approved products for marketplace section
    const latestMarketplaceProducts = await Product.find({ 
      isApproved: true,
      type: 'sell'
    })
    .sort({ createdAt: -1 })
    .limit(4);
    
    // Get latest approved products for renting section
    const latestRentingProducts = await Product.find({ 
      isApproved: true,
      type: 'rent'
    })
    .sort({ createdAt: -1 })
    .limit(4);
    
    // Get most downloaded notes for notebank section
    const popularNotes = await Note.find({ isApproved: true })
      .sort({ downloadCount: -1 })
      .limit(4);
    
    res.render('index', { 
      title: 'Cubeeto - Home',
      latestMarketplaceProducts,
      latestRentingProducts,
      popularNotes
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};