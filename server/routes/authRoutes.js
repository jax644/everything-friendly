const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/AuthController');

// Local auth routes
router.post('/register', AuthController.register);
router.post('/login', passport.authenticate('local'), AuthController.login);

// Google auth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=Authentication failed' }),
  AuthController.googleCallback
);

router.get('/current-user', (req,res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

router.post('/logout', AuthController.logout);

module.exports = router;