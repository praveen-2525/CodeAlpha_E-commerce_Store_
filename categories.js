const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');
const jsonDB = require('../config/json_db');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const categories = jsonDB.getCategories();
      return res.json({
        success: true,
        data: categories
      });
    }

    // --- Standard MongoDB Mode ---
    const categories = await Category.find({}).sort({ name: 1 });
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create a category (Admin only)
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a category name' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      try {
        const cat = jsonDB.createCategory({ name, description });
        return res.status(201).json({ success: true, data: cat });
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }

    // --- Standard MongoDB Mode ---
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({ name, description });
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a category (Admin only)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const deleted = jsonDB.deleteCategory(req.params.id);
      if (deleted) {
        return res.json({ success: true, message: 'Category deleted successfully' });
      }
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // --- Standard MongoDB Mode ---
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.json({ success: true, message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
