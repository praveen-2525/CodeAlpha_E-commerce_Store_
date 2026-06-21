const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const { protect, admin } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');
const jsonDB = require('../config/json_db');

// @desc    Get all products (with optional search, category, price boundaries, sorting, and pagination)
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const page = Number(req.query.pageNumber) || 1;
    const pageSize = Number(req.query.pageSize) || 8;

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const products = jsonDB.getProducts(
        req.query.keyword,
        req.query.category,
        req.query.sort,
        req.query.minPrice,
        req.query.maxPrice
      );
      const totalCount = products.length;
      const startIndex = pageSize * (page - 1);
      const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

      return res.json({
        success: true,
        page,
        pages: Math.ceil(totalCount / pageSize),
        count: totalCount,
        data: paginatedProducts
      });
    }

    // --- Standard MongoDB Mode ---
    const keywordFilter = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i'
          }
        }
      : {};

    const categoryFilter = req.query.category && req.query.category !== 'All'
      ? { category: req.query.category }
      : {};

    const priceFilter = {};
    if (req.query.minPrice) {
      priceFilter.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      priceFilter.$lte = Number(req.query.maxPrice);
    }

    const priceCriteria = Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

    const filter = { ...keywordFilter, ...categoryFilter, ...priceCriteria };

    // Sorting
    let sortCriteria = { createdAt: -1 }; // Default: Newest first
    if (req.query.sort) {
      if (req.query.sort === 'priceAsc') {
        sortCriteria = { price: 1 };
      } else if (req.query.sort === 'priceDesc') {
        sortCriteria = { price: -1 };
      } else if (req.query.sort === 'rating') {
        sortCriteria = { averageRating: -1 };
      } else if (req.query.sort === 'newest') {
        sortCriteria = { createdAt: -1 };
      }
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortCriteria)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.json({
      success: true,
      page,
      pages: Math.ceil(count / pageSize),
      count,
      data: products
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all unique categories
// @route   GET /api/products/categories
// @access  Public
router.get('/categories', async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const categories = jsonDB.getCategories();
      return res.json({
        success: true,
        data: categories.map(c => c.name) // compatibility with vanilla string array
      });
    }

    // --- Standard MongoDB Mode ---
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const product = jsonDB.getProductById(req.params.id);
      if (product) {
        return res.json({
          success: true,
          data: product
        });
      } else {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
    }

    // --- Standard MongoDB Mode ---
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json({
        success: true,
        data: product
      });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Create a new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    if (!name || !description || price === undefined || !image || !category || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all product fields' });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({ success: false, message: 'Price and Stock cannot be negative numbers' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const product = jsonDB.createProduct({ name, description, price, image, category, stock });
      return res.status(201).json({
        success: true,
        data: product
      });
    }

    // --- Standard MongoDB Mode ---
    const product = await Product.create({
      name,
      description,
      price: Number(price),
      image,
      category,
      stock: Number(stock)
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update an existing product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    if (price !== undefined && price < 0) {
      return res.status(400).json({ success: false, message: 'Price cannot be negative' });
    }
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const product = jsonDB.updateProduct(req.params.id, { name, description, price, image, category, stock });
      if (product) {
        return res.json({ success: true, data: product });
      }
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // --- Standard MongoDB Mode ---
    const product = await Product.findById(req.params.id);

    if (product) {
      if (name) product.name = name;
      if (description) product.description = description;
      if (price !== undefined) product.price = Number(price);
      if (image) product.image = image;
      if (category) product.category = category;
      if (stock !== undefined) product.stock = Number(stock);

      const updatedProduct = await product.save();
      res.json({
        success: true,
        data: updatedProduct
      });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const deleted = jsonDB.deleteProduct(req.params.id);
      if (deleted) {
        return res.json({ success: true, message: 'Product removed from catalog' });
      } else {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
    }

    // --- Standard MongoDB Mode ---
    const product = await Product.findById(req.params.id);
    if (product) {
      // Also delete associated reviews
      await Review.deleteMany({ product: req.params.id });
      await product.deleteOne();
      res.json({ success: true, message: 'Product removed from catalog' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide a rating and a comment' });
    }

    const starRating = Number(rating);
    if (starRating < 1 || starRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      try {
        const review = jsonDB.createReview(req.user._id, req.user.name, req.params.id, { rating: starRating, comment });
        return res.status(201).json({ success: true, message: 'Review added successfully', data: review });
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }

    // --- Standard MongoDB Mode ---
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: req.params.id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name,
      product: req.params.id,
      rating: starRating,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
router.get('/:id/reviews', async (req, res, next) => {
  try {
    // --- JSON Database Fallback Mode ---
    if (!getIsConnected()) {
      const reviews = jsonDB.getProductReviews(req.params.id);
      return res.json({ success: true, data: reviews });
    }

    // --- Standard MongoDB Mode ---
    const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
