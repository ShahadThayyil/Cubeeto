const Product = require('../models/Product');
const Note = require('../models/Note');

// Render dashboard
exports.renderDashboard = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    // Get user's products and notes
    const products = await Product.find({ user: userId }).sort({ createdAt: -1 });
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    
    // Count items by type
    const sellCount = products.filter(product => product.type === 'sell').length;
    const rentCount = products.filter(product => product.type === 'rent').length;
    const noteCount = notes.length;
    
    res.render('dashboard/index', { 
      title: 'Dashboard',
      products,
      notes,
      counts: {
        sell: sellCount,
        rent: rentCount,
        note: noteCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Render notebank management
exports.renderNotebankManagement = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    // Get user's notes
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    
    res.render('dashboard/notebank', { 
      title: 'NoteBank Management',
      notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Render sell management
exports.renderSellManagement = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    // Get user's sell products
    const products = await Product.find({ 
      user: userId,
      type: 'sell'
    }).sort({ createdAt: -1 });
    
    res.render('dashboard/sell', { 
      title: 'Sell Management',
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Render rent management
exports.renderRentManagement = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    // Get user's rent products
    const products = await Product.find({ 
      user: userId,
      type: 'rent'
    }).sort({ createdAt: -1 });
    
    res.render('dashboard/rent', { 
      title: 'Rent Management',
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/dashboard');
    }
    
    // Check if product belongs to user
    if (product.user.toString() !== req.session.user.id) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/dashboard');
    }
    
  await product.deleteOne();
    
    req.flash('success_msg', 'Product deleted successfully');
    if (product.type === 'sell') {
      return res.redirect('/dashboard/sell');
    } else {
      return res.redirect('/dashboard/rent');
    }
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/dashboard');
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      req.flash('error_msg', 'Note not found');
      return res.redirect('/dashboard/notebank');
    }
    
    // Check if note belongs to user
    if (note.user.toString() !== req.session.user.id) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/dashboard/notebank');
    }
    
    await note.deleteOne();
    
    req.flash('success_msg', 'Note deleted successfully');
    return res.redirect('/dashboard/notebank');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/dashboard/notebank');
  }
};