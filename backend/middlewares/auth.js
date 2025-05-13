// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view this resource');
  res.redirect('/auth/login');
};

// Admin authentication middleware
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  req.flash('error_msg', 'Access denied: Admin privileges required');
  res.redirect('/auth/login');
};

// Main admin authentication middleware
const isMainAdmin = (req, res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (req.session.user && req.session.user.email === adminEmail) {
    return next();
  }
  req.flash('error_msg', 'Access denied: Main admin privileges required');
  res.redirect('/admin/login');
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isMainAdmin
};