const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: [0, 'Price cannot be negative']
    },
    image: {
      type: String,
      required: [true, 'Please add a product image URL or path']
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
      trim: true
    },
    stock: {
      type: Number,
      required: [true, 'Please add a stock count'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', ProductSchema);
