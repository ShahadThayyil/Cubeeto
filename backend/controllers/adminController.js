const User = require('../models/User');
const Product = require('../models/Product');
const Note = require('../models/Note');
const StudyKit = require('../models/StudyKit');

// Render admin dashboard
exports.renderDashboard = async (req, res) => {
  try {
    // Get counts for dashboard
    const userCount = await User.countDocuments();
    const pendingProductCount = await Product.countDocuments({ isApproved: false });
    const pendingNoteCount = await Note.countDocuments({ isApproved: false });
    const productCount = await Product.countDocuments();
    const noteCount = await Note.countDocuments();
    
    res.render('admin/dashboard', { 
      title: 'Admin Dashboard',
      layout: 'layouts/admin',
      counts: {
        users: userCount,
        pendingProducts: pendingProductCount,
        pendingNotes: pendingNoteCount,
        totalProducts: productCount,
        totalNotes: noteCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      layout: 'layouts/admin',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Render user management
exports.renderUserManagement = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    res.render('admin/users', { 
      title: 'User Management',
      layout: 'layouts/admin',
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      layout: 'layouts/admin',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Toggle user admin status
exports.toggleUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/admin/users');
    }
    
    // Toggle admin status
    user.isAdmin = !user.isAdmin;
    await user.save();
    
    req.flash('success_msg', `User ${user.isAdmin ? 'promoted to' : 'removed from'} admin`);
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/admin/users');
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/admin/users');
    }
    
    // Delete user's products and notes
    await Product.deleteMany({ user: user._id });
    await Note.deleteMany({ user: user._id });
    
    // Delete user
    await user.remove();
    
    req.flash('success_msg', 'User deleted successfully');
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/admin/users');
  }
};

// Render product approval
exports.renderProductApproval = async (req, res) => {
  try {
    const pendingProducts = await Product.find({ isApproved: false })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.render('admin/products-approval', { 
      title: 'Product Approval',
      layout: 'layouts/admin',
      products: pendingProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      layout: 'layouts/admin',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Approve product
exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/admin/products-approval');
    }
    
    // Approve product
    product.isApproved = true;
    await product.save();
    
    req.flash('success_msg', 'Product approved successfully');
    res.redirect('/admin/products-approval');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/admin/products-approval');
  }
};

// Reject product
exports.rejectProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/admin/products-approval');
    }
    
    // Delete product
    await product.remove();
    
    req.flash('success_msg', 'Product rejected and deleted');
    res.redirect('/admin/products-approval');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/admin/products-approval');
  }
};

// Render note approval
exports.renderNoteApproval = async (req, res) => {
  try {
    const pendingNotes = await Note.find({ isApproved: false })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.render('admin/notes-approval', { 
      title: 'Note Approval',
      layout: 'layouts/admin',
      notes: pendingNotes
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      layout: 'layouts/admin',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Approve note
exports.approveNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      req.flash('error_msg', 'Note not found');
      return res.redirect('/admin/notes-approval');
    }
    
    // Approve note
    note.isApproved = true;
    await note.save();
    
    req.flash('success_msg', 'Note approved successfully');
    res.redirect('/admin/notes-approval');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/admin/notes-approval');
  }
};

// Reject note
exports.rejectNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      req.flash('error_msg', 'Note not found');
      return res.redirect('/admin/notes-approval');
    }
    
    // Delete note
    await note.remove();
    
    req.flash('success_msg', 'Note rejected and deleted');
    res.redirect('/admin/notes-approval');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/admin/notes-approval');
  }
};

// Render study kit management
exports.renderStudyKitManagement = async (req, res) => {
  try {
    const studyKits = await StudyKit.find().sort({ createdAt: -1 });
    
    res.render('admin/studykit', { 
      title: 'Study Kit Management',
      layout: 'layouts/admin',
      studyKits
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      layout: 'layouts/admin',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Create study kit
exports.createStudyKit = async (req, res) => {
  try {
    const { title, description, isVisible } = req.body;
    
    // Create new study kit
    const studyKit = new StudyKit({
      title,
      description,
      isVisible: isVisible === 'true'
    });
    
    await studyKit.save();
    
    req.flash('success_msg', 'Study Kit created successfully');
    res.redirect('/admin/studykit');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/admin/studykit');
  }
};

// Update study kit
exports.updateStudyKit = async (req, res) => {
  try {
    const { title, description, isVisible } = req.body;
    
    const studyKit = await StudyKit.findById(req.params.id);
    
    if (!studyKit) {
      req.flash('error_msg', 'Study Kit not found');
      return res.redirect('/admin/studykit');
    }
    
    // Update study kit
    studyKit.title = title;
    studyKit.description = description;
    studyKit.isVisible = isVisible === 'true';
    
    await studyKit.save();
    
    req.flash('success_msg', 'Study Kit updated successfully');
    res.redirect('/admin/studykit');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/admin/studykit');
  }
};

// Delete study kit
exports.deleteStudyKit = async (req, res) => {
  try {
    const studyKit = await StudyKit.findById(req.params.id);
    
    if (!studyKit) {
      req.flash('error_msg', 'Study Kit not found');
      return res.redirect('/admin/studykit');
    }
    
    // Delete study kit
    await studyKit.remove();
    
    req.flash('success_msg', 'Study Kit deleted successfully');
    res.redirect('/admin/studykit');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/admin/studykit');
  }
};