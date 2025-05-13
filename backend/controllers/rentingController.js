const { validationResult } = require('express-validator');
const Product = require('../models/Product');

// Render renting page
exports.renderRenting = async (req, res) => {
  try {
    const { category, place, availability } = req.query;
    
    // Build filter
    const filter = { 
      isApproved: true,
      type: 'rent'
    };
    
    if (category) filter.category = category;
    if (place) filter.place = place;
    if (availability) filter.availability = availability === 'true';
    
    // Get categories for filter
    const categories = await Product.distinct('category', { type: 'rent', isApproved: true });
    const places = await Product.distinct('place', { type: 'rent', isApproved: true });
    
    // Get products
    const products = await Product.find(filter)
      .sort({ createdAt: -1 });
    
    res.render('renting/index', { 
      title: 'Renting',
      products,
      categories,
      places,
      filters: req.query
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Render rent product form
exports.renderRentForm = (req, res) => {
  res.render('renting/rent', { title: 'Rent Out a Product' });
};

// Handle rent product submission
exports.rentProduct = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('renting/rent', {
      title: 'Rent Out a Product',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    const { name, description, price, place, category, availability, whatsappNumber, callNumber } = req.body;
    
    // Handle file uploads
    if (!req.files || req.files.length < 1) {
      req.flash('error_msg', 'Please upload at least one image');
      return res.render('renting/rent', {
        title: 'Rent Out a Product',
        formData: req.body
      });
    }
    
    // Create paths for images
    const imagePaths = req.files.map(file => `/uploads/products/${file.filename}`);
    
    // Create new product
    const product = new Product({
      name,
      description,
      price,
      place,
      category,
      availability: availability === 'true',
      whatsappNumber,
      callNumber,
      images: imagePaths,
      thumbnail: imagePaths[0], // Set first image as thumbnail
      type: 'rent',
      user: req.session.user.id
    });
    
    await product.save();
    
    req.flash('success_msg', 'Rental product submitted for approval');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/renting/rent');
  }
};