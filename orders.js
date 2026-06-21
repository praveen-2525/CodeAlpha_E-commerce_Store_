const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { protect, admin } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');
const jsonDB = require('../config/json_db');

// @desc    Create a new order (Place Order)
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in the order' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      return res.status(400).json({ success: false, message: 'Please provide complete shipping address details' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      try {
        const order = jsonDB.createOrder(req.user._id, {
          orderItems,
          shippingAddress,
          paymentMethod,
          taxPrice,
          shippingPrice,
          totalPrice
        });
        return res.status(201).json({
          success: true,
          data: order
        });
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }

    // --- Standard MongoDB Mode ---
    // Verify product stock availability and deduct
    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ success: false, message: `Product "${item.name}" not found in inventory` });
      }
      if (dbProduct.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.name}". Available: ${dbProduct.stock}, Requested: ${item.qty}`
        });
      }
    }

    // Deduct stock after validation
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty }
      });
    }

    // Create the order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0
    });

    const createdOrder = await order.save();

    // Clear user's DB cart after ordering
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      data: createdOrder
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const orders = jsonDB.getUserOrders(req.user._id);
      return res.json({
        success: true,
        data: orders
      });
    }

    // --- Standard MongoDB Mode ---
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const orders = jsonDB.getAllOrders();
      return res.json({
        success: true,
        data: orders
      });
    }

    // --- Standard MongoDB Mode ---
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      try {
        const order = jsonDB.cancelOrder(req.params.id, req.user._id);
        if (order) {
          return res.json({ success: true, message: 'Order has been cancelled successfully', data: order });
        }
        return res.status(404).json({ success: false, message: 'Order not found' });
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }

    // --- Standard MongoDB Mode ---
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Only Pending orders can be cancelled' });
    }

    order.status = 'Cancelled';
    await order.save();

    // Release back product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty }
      });
    }

    res.json({
      success: true,
      message: 'Order has been cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid status update' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const order = jsonDB.updateOrderStatus(req.params.id, status);
      if (order) {
        return res.json({ success: true, message: `Order status updated to ${status}`, data: order });
      }
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // --- Standard MongoDB Mode ---
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // If order was transitioned to Cancelled, release stock
    if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.qty }
        });
      }
    }

    // If order was cancelled and now transitioned to something else, deduct stock
    if (oldStatus === 'Cancelled' && status !== 'Cancelled') {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.qty }
        });
      }
    }

    const updatedOrder = await Order.findById(req.params.id).populate('user', 'id name email');

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
