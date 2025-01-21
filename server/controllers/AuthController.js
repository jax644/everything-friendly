const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { FRONTEND_BASE_URL } = require('../utils');

console.log('AuthController loaded')

class AuthController {

  static async register(req, res) {
    console.log(`request:`)
    console.log(req.body)
    try {
      const { name, email, password } = req.body;
      
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
    console.log('login called')
    // Passport will handle authentication
    res.json({ user: req.user });
  }

  static async googleCallback(req, res) {
    console.log('googleCallback called')
    // Successful authentication, redirect to dashboard
    res.redirect(`${FRONTEND_BASE_URL}/dashboard`);
  }

  static async logout(req, res) {
    // Clear the session cookie
    console.log('logout called')
    console.log(`attemping to clear cookies`)
    res.clearCookie('connect.sid');
  
    // Destroy the session on the server side
    if (req.session) {
      try {
        console.log('destroying session')
        await req.session.destroy();
        console.log("destroyed success")
        res.status(200).json({ message: 'Logged out successfully' });
        // res.status(200).json({ message: 'Logged out successfully' });
        // res.redirect(`/`);
      } catch (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Failed to log out' });
      }

      // req.session.destroy((err) => {
      //   if (err) {
      //     console.error('Error destroying session:', err);
      //     return res.status(500).json({ message: 'Failed to log out' });
      //   }
  
      //   // Optional: Log the user out using Passport (if applicable)
      //   if (req.logout) {
      //     req.logout(function(err) {
      //       if (err) { return (err); }
      //       res.redirect('/');
      //     });
      //   }
  
      //   // Send confirmation to the client
      //   res.status(200).json({ message: 'Logged out successfully' });
      // });
    } else {
      // Fallback in case there's no session to destroy
      res.status(200).json({ message: 'Logged out successfully' });
    }
  }
}

module.exports = AuthController;