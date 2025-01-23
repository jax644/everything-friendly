import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { FRONTEND_BASE_URL } from '../utils.js';

console.log('AuthController loaded')

class AuthController {

  static async register(req, res) {
    console.log(`request:`)
    console.log(req.body)
    try {
      const { name, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await create({
        email: email.toLowerCase(),
        password: hashedPassword,
        name
      });

      // Log in the user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error logging in' });
        }
        return res.json({ user });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  }

  static async login(req, res) {
    console.log('login called')
    // Passport will handle authentication
    res.json({ user: req.user });
  }

  static async googleCallback(req, res) {
    console.log('googleCallback called')
    // Successful authentication, redirect to dashboard
    console.log("USER SHOULD BE SAVED", req.user);
    console.log("Session should be saved:", req.session)
    console.log("Authenticated:", req.isAuthenticated())
    console.log("Redirecting to: dashboard")
    res.redirect(`${FRONTEND_BASE_URL}/dashboard`);
  }

  static async logout(req, res) {
    console.log('logout called')
    
    // Clear all auth-related cookies
    res.clearCookie('connect.sid');
    res.clearCookie('G_AUTHUSER_H'); // Clear Google auth cookie
    
    if (req.session) {
      try {
        console.log('destroying session')
        await req.session.destroy();
        console.log("destroyed success")
        res.status(200).json({ message: 'Logged out successfully' });
      } catch (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Failed to log out' });
      }
    } else {
      res.status(200).json({ message: 'Logged out successfully' });
    }
  }
}

export default AuthController;