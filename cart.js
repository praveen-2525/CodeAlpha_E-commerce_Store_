const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');
const jsonDB = require('../config/json_db');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const cart = jsonDB.getCart(req.user._id);
      return res.json({ success: true, data: cart });
    }

    // --- Standard MongoDB Mode ---
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price image stock');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

// @desc    Sync user cart (Overwrite/Update items list)
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { product: productId, qty: quantity }

    if (!items) {
      return res.status(400).json({ success: false, message: 'Please provide items list' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const cart = jsonDB.syncCart(req.user._id, items);
      return res.json({ success: true, data: cart });
    }

    // --- Standard MongoDB Mode ---
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    cart.items = items.map(item => ({
      product: item.product,
      qty: Number(item.qty)
    }));

    await cart.save();
    
    // Fetch populated
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price image stock');
    res.json({ success: true, data: populatedCart });
  } catch (error) {
    next(error);
  }
});

// @desc    Remove single product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const cart = jsonDB.removeFromCart(req.user._id, req.params.productId);
      return res.json({ success: true, data: cart });
    }

    // --- Standard MongoDB Mode ---
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
      await cart.save();
    }
    
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price image stock');
    res.json({ success: true, data: populatedCart });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
