const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const marketplaceRoutes = require('./routes/marketplace');
const rentingRoutes = require('./routes/renting');
const notebankRoutes = require('./routes/notebank');
const studykitRoutes = require('./routes/studykit');
const userDashboardRoutes = require('./routes/userDashboard');
const adminRoutes = require('./routes/admin');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native',
    crypto: {
      secret: process.env.SESSION_SECRET || 'default_secret'
    }
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  res.locals.path = req.path;
  next();
});

// Static files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/renting', rentingRoutes);
app.use('/notebank', notebankRoutes);
app.use('/studykit', studykitRoutes);
app.use('/dashboard', userDashboardRoutes);
app.use('/admin', adminRoutes);

// 404 Error handler
app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Page Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500', { 
    title: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});