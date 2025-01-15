const User = require('../models/User');
const bcrypt = require('bcryptjs');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await User.create({
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
    // Passport will handle authentication
    res.json({ user: req.user });
  }

  static async googleCallback(req, res) {
    // Successful authentication, redirect home
    res.redirect('/');
  }

  static async logout(req, res) {
    req.logout();
    res.json({ message: 'Logged out successfully' });
  }
}

module.exports = AuthController;