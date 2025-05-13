const { validationResult } = require('express-validator');
const User = require('../models/User');

// Render register page
exports.renderRegister = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};

// Handle user registration
exports.register = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('auth/register', {
      title: 'Register',
      errors: errors.array(),
      formData: req.body
    });
  }

  const { name, email, password, phone } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      req.flash('error_msg', 'Email is already registered');
      return res.render('auth/register', {
        title: 'Register',
        formData: req.body
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone
    });

    await user.save();
    
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/auth/register');
  }
};

// Render login page
exports.renderLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

// Handle user login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      title: 'Login',
      errors: errors.array(),
      formData: req.body
    });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      req.flash('error_msg', 'Invalid email or password');
      return res.render('auth/login', {
        title: 'Login',
        formData: { email }
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      req.flash('error_msg', 'Invalid email or password');
      return res.render('auth/login', {
        title: 'Login',
        formData: { email }
      });
    }

    // Set user session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    };
    
    req.flash('success_msg', 'You are now logged in');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/auth/login');
  }
};

// Handle user logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
};

// Render admin login page
exports.renderAdminLogin = (req, res) => {
  res.render('admin/login', { title: 'Admin Login', layout: 'layouts/admin' });
};

// Handle admin login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  
  // Check against environment variables for main admin
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    req.session.user = {
      email: process.env.ADMIN_EMAIL,
      name: 'Main Admin',
      isAdmin: true,
      isMainAdmin: true
    };
    
    req.flash('success_msg', 'Admin logged in successfully');
    return res.redirect('/admin/dashboard');
  }
  
  // Check for regular admin users
  try {
    const user = await User.findOne({ email, isAdmin: true });
    
    if (!user) {
      req.flash('error_msg', 'Invalid admin credentials');
      return res.render('admin/login', {
        title: 'Admin Login',
        layout: 'layouts/admin',
        formData: { email }
      });
    }

    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      req.flash('error_msg', 'Invalid admin credentials');
      return res.render('admin/login', {
        title: 'Admin Login',
        layout: 'layouts/admin',
        formData: { email }
      });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: true
    };
    
    req.flash('success_msg', 'Admin logged in successfully');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/admin/login');
  }
};