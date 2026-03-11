const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { userValidation, loginValidation } = require('../middleware/validation');

// POST /api/auth/register - Register new user
router.post('/register', userValidation, (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    User.getByEmail(email, (err, existingUser) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }

      // Hash password (placeholder - use bcrypt in production)
      const password_hash = User.hashPassword(password);

      // Create user
      User.create({ email, password_hash }, (err, user) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email
            },
            token
          },
          message: 'User registered successfully'
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', loginValidation, (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    User.getByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Verify password (placeholder - use bcrypt in production)
      const isValidPassword = User.verifyPassword(user.password_hash, password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email
          },
          token
        },
        message: 'Login successful'
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/auth/me - Get current user (requires authentication)
router.get('/me', (req, res) => {
  try {
    // This endpoint would use the authenticateToken middleware
    // For now, returning a placeholder response
    res.json({
      success: true,
      data: {
        message: 'Authentication middleware needs to be implemented for this endpoint',
        note: 'Add authenticateToken middleware to protect this route'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
