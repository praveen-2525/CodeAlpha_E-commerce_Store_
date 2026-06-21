const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');
const jsonDB = require('../config/json_db');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const wishlist = jsonDB.getWishlist(req.user._id);
      return res.json({ success: true, data: wishlist });
    }

    // --- Standard MongoDB Mode ---
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name price image stock averageRating numReviews');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Please provide product ID' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const wishlist = jsonDB.addToWishlist(req.user._id, productId);
      return res.json({ success: true, data: wishlist });
    }

    // --- Standard MongoDB Mode ---
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const populatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name price image stock averageRating numReviews');
    res.json({ success: true, data: populatedWishlist });
  } catch (error) {
    next(error);
  }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const wishlist = jsonDB.removeFromWishlist(req.user._id, req.params.productId);
      return res.json({ success: true, data: wishlist });
    }

    // --- Standard MongoDB Mode ---
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(pId => pId.toString() !== req.params.productId);
      await wishlist.save();
    }

    const populatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name price image stock averageRating numReviews');
    res.json({ success: true, data: populatedWishlist });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
