const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');
const jsonDB = require('../config/json_db');

// @desc    Get dashboard analytics metrics
// @route   GET /api/admin/analytics
// @access  Private/Admin
router.get('/analytics', protect, admin, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const stats = jsonDB.getAdminAnalytics();
      return res.json({ success: true, data: stats });
    }

    // --- Standard MongoDB Mode ---
    const usersCount = await User.countDocuments({});
    const productsCount = await Product.countDocuments({});
    const ordersCount = await Order.countDocuments({});

    // Total sales (excluding cancelled orders)
    const salesAgg = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalSales = salesAgg.length > 0 ? salesAgg[0].total : 0;

    // Sales by Category
    const salesByCat = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          sales: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } }
        }
      }
    ]);
    const salesByCategory = {};
    salesByCat.forEach(item => {
      salesByCategory[item._id] = Math.round(item.sales * 100) / 100;
    });

    // Status Distributions
    const statusDistributionAgg = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusDistribution = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };
    statusDistributionAgg.forEach(item => {
      statusDistribution[item._id] = item.count;
    });

    // Recent orders (last 5)
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          price: { $first: '$orderItems.price' },
          salesCount: { $sum: '$orderItems.qty' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } }
        }
      },
      { $sort: { salesCount: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        usersCount,
        productsCount,
        ordersCount,
        totalSales: Math.round(totalSales * 100) / 100,
        salesByCategory,
        statusDistribution,
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const users = jsonDB.getUsers();
      return res.json({ success: true, data: users });
    }

    // --- Standard MongoDB Mode ---
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const deleted = jsonDB.deleteUser(req.params.id);
      if (deleted) {
        return res.json({ success: true, message: 'User deleted successfully' });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // --- Standard MongoDB Mode ---
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Toggle admin/user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
router.put('/users/:id/role', protect, admin, async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid role' });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot demote yourself' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const user = jsonDB.updateUserRole(req.params.id, role);
      if (user) {
        return res.json({ success: true, message: `User role updated to ${role}`, data: user });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // --- Standard MongoDB Mode ---
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = role;
      await user.save();
      res.json({ success: true, message: `User role updated to ${role}`, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
