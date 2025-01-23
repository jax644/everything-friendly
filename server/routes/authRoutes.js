import { Router } from 'express';
const router = Router();
import passport from 'passport';
import AuthController from '../controllers/AuthController.js';

// Local auth routes
router.post('/register', AuthController.register);
router.post('/login', passport.authenticate('local'), AuthController.login);

// Google auth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account',
    access_type: 'online'
  })
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

export default router;