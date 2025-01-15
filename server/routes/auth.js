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
  passport.authenticate('google', { failureRedirect: '/login' }),
  AuthController.googleCallback
);

router.get('/logout', AuthController.logout);

module.exports = router;