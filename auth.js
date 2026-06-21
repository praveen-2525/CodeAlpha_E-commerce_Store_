const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');
const jsonDB = require('../config/json_db');

// Utility function to generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'supersecretjwtkeyforinternshipecommerce2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields (name, email, password)' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const userExists = jsonDB.getUserByEmail(email);
      if (userExists) {
        return res.status(400).json({ success: false, message: 'Email address already registered' });
      }

      const user = jsonDB.createUser({ name, email, password });
      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          savedAddresses: user.savedAddresses || [],
          token: generateToken(user._id)
        }
      });
    }

    // --- Standard MongoDB Mode ---
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          savedAddresses: user.savedAddresses || [],
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const user = jsonDB.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          savedAddresses: user.savedAddresses || [],
          token: generateToken(user._id)
        }
      });
    }

    // --- Standard MongoDB Mode ---
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedAddresses: user.savedAddresses || [],
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user profile details
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const user = jsonDB.getUserById(req.user._id);
      if (user) {
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            savedAddresses: user.savedAddresses || []
          }
        });
      } else {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    }

    // --- Standard MongoDB Mode ---
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          savedAddresses: user.savedAddresses || []
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const updatedUser = jsonDB.updateUserProfile(req.user._id, { name, email, password });
      if (updatedUser) {
        return res.json({
          success: true,
          message: 'Profile updated successfully',
          data: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            savedAddresses: updatedUser.savedAddresses || []
          }
        });
      } else {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    }

    // --- Standard MongoDB Mode ---
    const user = await User.findById(req.user._id);

    if (user) {
      if (name) user.name = name;
      if (email) {
        const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
        if (emailExists) {
          return res.status(400).json({ success: false, message: 'Email address already in use' });
        }
        user.email = email;
      }
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }
        user.password = password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          savedAddresses: updatedUser.savedAddresses || []
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Forgot password request
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email address' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const resetToken = jsonDB.forgotPassword(email);
      if (!resetToken) {
        return res.status(404).json({ success: false, message: 'No user registered with this email address' });
      }
      console.log(`[DEBUG - LOCAL MODE] Password reset token for ${email}: ${resetToken}`);
      return res.json({
        success: true,
        message: 'Password reset link generated. (Check server console/logs in development)',
        resetToken // returning for local testing ease
      });
    }

    // --- Standard MongoDB Mode ---
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email address' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    console.log(`[DEBUG - MONGODB MODE] Password reset token for ${email}: ${resetToken}`);
    
    // In a production application, you would send this token via email.
    // For local portfolio/testing ease, we also send it back in JSON format.
    res.json({
      success: true,
      message: 'Password reset link generated. (Check server console/logs in development)',
      resetToken
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
router.put('/resetpassword/:resettoken', async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Please enter a password with at least 6 characters' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const user = jsonDB.resetPassword(req.params.resettoken, password);
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
      }
      return res.json({ success: true, message: 'Password reset was successful. You can now login.' });
    }

    // --- Standard MongoDB Mode ---
    // Hash token from param
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset was successful. You can now login.'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add shipping address to user profile
// @route   POST /api/auth/addresses
// @access  Private
router.post('/addresses', protect, async (req, res, next) => {
  try {
    const { address, city, postalCode, country, isDefault } = req.body;

    if (!address || !city || !postalCode || !country) {
      return res.status(400).json({ success: false, message: 'Please enter all address fields' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const user = jsonDB.addAddress(req.user._id, { address, city, postalCode, country, isDefault });
      if (user) {
        return res.status(201).json({ success: true, data: user.savedAddresses });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // --- Standard MongoDB Mode ---
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newAddress = {
      address,
      city,
      postalCode,
      country,
      isDefault: user.savedAddresses.length === 0 ? true : !!isDefault
    };

    if (newAddress.isDefault) {
      user.savedAddresses.forEach(addr => addr.isDefault = false);
    }

    user.savedAddresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: user.savedAddresses
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user shipping address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
router.put('/addresses/:addressId', protect, async (req, res, next) => {
  try {
    const { address, city, postalCode, country, isDefault } = req.body;

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const user = jsonDB.updateAddress(req.user._id, req.params.addressId, { address, city, postalCode, country, isDefault });
      if (user) {
        return res.json({ success: true, data: user.savedAddresses });
      }
      return res.status(404).json({ success: false, message: 'Address not found or unauthorized' });
    }

    // --- Standard MongoDB Mode ---
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const addr = user.savedAddresses.id(req.params.addressId);
    if (!addr) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    if (address) addr.address = address;
    if (city) addr.city = city;
    if (postalCode) addr.postalCode = postalCode;
    if (country) addr.country = country;

    if (isDefault !== undefined) {
      addr.isDefault = !!isDefault;
      if (addr.isDefault) {
        user.savedAddresses.forEach(a => {
          if (a._id.toString() !== req.params.addressId) {
            a.isDefault = false;
          }
        });
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: user.savedAddresses
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete shipping address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
router.delete('/addresses/:addressId', protect, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const user = jsonDB.deleteAddress(req.user._id, req.params.addressId);
      if (user) {
        return res.json({ success: true, data: user.savedAddresses });
      }
      return res.status(404).json({ success: false, message: 'User or address not found' });
    }

    // --- Standard MongoDB Mode ---
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove the address
    user.savedAddresses = user.savedAddresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );

    // If we deleted the default address, and we have addresses left, make the first one default
    if (user.savedAddresses.length > 0 && !user.savedAddresses.some(a => a.isDefault)) {
      user.savedAddresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      data: user.savedAddresses
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
