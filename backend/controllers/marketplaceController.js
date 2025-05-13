const { validationResult } = require('express-validator');
const Product = require('../models/Product');

// Render marketplace page
exports.renderMarketplace = async (req, res) => {
  try {
    const { category, place, availability } = req.query;
    
    // Build filter
    const filter = { 
      isApproved: true,
      type: 'sell'
    };
    
    if (category) filter.category = category;
    if (place) filter.place = place;
    if (availability) filter.availability = availability === 'true';
    
    // Get categories for filter
    const categories = await Product.distinct('category', { type: 'sell', isApproved: true });
    const places = await Product.distinct('place', { type: 'sell', isApproved: true });
    
    // Get products
    const products = await Product.find(filter)
      .sort({ createdAt: -1 });
    
    res.render('marketplace/index', { 
      title: 'Marketplace',
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

// Render product details page
exports.renderProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('user', 'name');
    
    if (!product || !product.isApproved) {
      return res.status(404).render('errors/404', { title: 'Product Not Found' });
    }
    
    res.render('marketplace/details', { 
      title: product.name,
      product
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).render('errors/404', { title: 'Product Not Found' });
    }
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Render sell product form
exports.renderSellForm = (req, res) => {
  res.render('marketplace/sell', { title: 'Sell a Product' });
};

// Handle sell product submission
exports.sellProduct = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('marketplace/sell', {
      title: 'Sell a Product',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    const { name, description, price, place, category, availability, whatsappNumber, callNumber } = req.body;
    
    // Handle file uploads
    if (!req.files || req.files.length < 1) {
      req.flash('error_msg', 'Please upload at least one image');
      return res.render('marketplace/sell', {
        title: 'Sell a Product',
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
      type: 'sell',
      user: req.session.user.id
    });
    
    await product.save();
    
    req.flash('success_msg', 'Product submitted for approval');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/marketplace/sell');
  }
};