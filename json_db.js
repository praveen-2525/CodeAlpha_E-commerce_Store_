const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const DB_FILE = path.join(__dirname, '..', 'db.json');

// Helper to encrypt password synchronously
const hashPasswordSync = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

// Initial Seed Data for JSON Database
const getInitialData = () => {
  const adminPasswordHash = hashPasswordSync('AdminPassword123');
  const buyerPasswordHash = hashPasswordSync('BuyerPassword123');

  const categories = [
    { _id: 'json-cat-1', name: 'Electronics', slug: 'electronics', description: 'Gadgets, devices, and accessories' },
    { _id: 'json-cat-2', name: 'Apparel', slug: 'apparel', description: 'Premium wear and garments' },
    { _id: 'json-cat-3', name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Kitchenware and sheet sets' },
    { _id: 'json-cat-4', name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Gym gears and tents' },
    { _id: 'json-cat-5', name: 'Books', slug: 'books', description: 'Novels and guidebooks' },
    { _id: 'json-cat-6', name: 'Footwear', slug: 'footwear', description: 'Boots, trainers, and slippers' },
    { _id: 'json-cat-7', name: 'Beauty & Personal Care', slug: 'beauty-personal-care', description: 'Facial creams and stylers' },
    { _id: 'json-cat-8', name: 'Toys & Hobbies', slug: 'toys-hobbies', description: 'Drones, paints, and board games' }
  ];

  const products = [
    {
      _id: "json-prod-1",
      name: 'TechPro Over-Ear Headphones',
      description: 'Experience studio-quality sound with active noise-cancellation (ANC), 40-hour battery life, and ultra-comfortable memory foam earcups.',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      category: 'Electronics',
      stock: 15,
      averageRating: 4.5,
      numReviews: 2
    },
    {
      _id: "json-prod-2",
      name: 'SmartFit Pro Fitness Tracker',
      description: 'Track your heart rate, sleep quality, daily steps, and workouts with this water-resistant smartwatch featuring a high-definition AMOLED screen.',
      price: 89.50,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80',
      category: 'Electronics',
      stock: 25,
      averageRating: 4.0,
      numReviews: 1
    },
    {
      _id: "json-prod-3",
      name: 'Ultima Mechanical Keyboard',
      description: 'Anodized aluminum frame, hot-swappable brown tactile switches, and vibrant customizable RGB backlighting for developers and gamers alike.',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
      category: 'Electronics',
      stock: 10,
      averageRating: 5.0,
      numReviews: 1
    },
    {
      _id: "json-prod-4",
      name: 'Curved IPS Gaming Monitor 27"',
      description: 'Immersive 1500R curvature, QHD resolution (2560x1440), lightning-fast 165Hz refresh rate, and 1ms response time with AMD FreeSync technology.',
      price: 349.99,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
      category: 'Electronics',
      stock: 8,
      averageRating: 0,
      numReviews: 0
    },
    {
      _id: "json-prod-5",
      name: 'Ergonomic Wireless Mouse',
      description: 'Designed to fit comfortably in your palm, featuring adjustable DPI levels, dual wireless modes (Bluetooth + 2.4GHz), and silent-click buttons.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
      category: 'Electronics',
      stock: 40,
      averageRating: 0,
      numReviews: 0
    },
    {
      _id: "json-prod-6",
      name: "Men's Explorer Bomber Jacket",
      description: 'Water-resistant, insulated shell jacket inspired by flight deck designs. Perfect for cool-weather styling and outdoor excursions.',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
      category: 'Apparel',
      stock: 20,
      averageRating: 0,
      numReviews: 0
    },
    {
      _id: "json-prod-7",
      name: "Women's Comfort Knit Sweater",
      description: 'Woven with a premium cashmere blend, this oversized cable-knit crewneck sweater offers exceptional warmth and luxury comfort.',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1574164904299-3a102b110380?w=500&q=80',
      category: 'Apparel',
      stock: 18,
      averageRating: 0,
      numReviews: 0
    },
    {
      _id: "json-prod-8",
      name: 'Vintage Leather Messenger Bag',
      description: 'Handcrafted genuine leather messenger bag with dedicated 15.6-inch laptop pocket, antique brass hardware, and adjustable shoulder straps.',
      price: 110.00,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
      category: 'Apparel',
      stock: 12,
      averageRating: 0,
      numReviews: 0
    },
    {
      _id: "json-prod-9",
      name: 'Breathable Running Sneakers',
      description: 'Engineered mesh upper, impact-absorbing foam midsole, and durable rubber traction outsoles for jogging, running, and heavy gym training.',
      price: 95.00,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      category: 'Apparel',
      stock: 30,
      averageRating: 0,
      numReviews: 0
    },
    {
      _id: "json-prod-10",
      name: 'Premium Bamboo Sheet Set',
      description: 'Silky smooth, hypoallergenic, temperature-regulating bamboo viscose sheets. Set includes 1 flat sheet, 1 fitted sheet, and 2 pillowcases.',
      price: 65.00,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80',
      category: 'Home & Kitchen',
      stock: 15,
      averageRating: 0,
      numReviews: 0
    }
  ];

  const users = [
    {
      _id: "json-user-admin",
      name: 'E-commerce Admin',
      email: 'admin@ecommerce.com',
      password: adminPasswordHash,
      role: 'admin',
      savedAddresses: [
        {
          _id: 'json-addr-admin-1',
          address: '500 HQ Boulevard',
          city: 'Tech City',
          postalCode: '10001',
          country: 'Developer Land',
          isDefault: true
        }
      ]
    },
    {
      _id: "json-user-buyer",
      name: 'John Customer',
      email: 'buyer@ecommerce.com',
      password: buyerPasswordHash,
      role: 'user',
      savedAddresses: [
        {
          _id: 'json-addr-buyer-1',
          address: '102 Innovation Way',
          city: 'Silicon Valley',
          postalCode: '94016',
          country: 'United States',
          isDefault: true
        }
      ]
    }
  ];

  const orders = [
    {
      _id: "json-order-seed-1",
      user: "json-user-buyer",
      orderItems: [
        {
          name: "TechPro Over-Ear Headphones",
          qty: 1,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
          price: 199.99,
          product: "json-prod-1"
        }
      ],
      shippingAddress: {
        address: "102 Innovation Way",
        city: "Silicon Valley",
        postalCode: "94016",
        country: "United States"
      },
      paymentMethod: "Cash on Delivery",
      taxPrice: 16.00,
      shippingPrice: 10.00,
      totalPrice: 225.99,
      status: "Pending",
      createdAt: new Date().toISOString()
    }
  ];

  const reviews = [
    {
      _id: "json-rev-1",
      user: "json-user-buyer",
      userName: "John Customer",
      product: "json-prod-1",
      rating: 5,
      comment: "Incredible sound isolation and heavy punchy bass. Best purchase of this year!",
      createdAt: new Date().toISOString()
    },
    {
      _id: "json-rev-2",
      user: "json-user-admin",
      userName: "E-commerce Admin",
      product: "json-prod-1",
      rating: 4,
      comment: "Very solid construction and clean spatial imaging. ANC could be slightly stronger.",
      createdAt: new Date().toISOString()
    },
    {
      _id: "json-rev-3",
      user: "json-user-buyer",
      userName: "John Customer",
      product: "json-prod-2",
      rating: 4,
      comment: "Decent fitness watch. Tracker is accurate enough, and AMOLED screen is vibrant.",
      createdAt: new Date().toISOString()
    },
    {
      _id: "json-rev-4",
      user: "json-user-buyer",
      userName: "John Customer",
      product: "json-prod-3",
      rating: 5,
      comment: "Love the tactile feel and satisfying sound of the brown switches. Backlighting is gorgeous.",
      createdAt: new Date().toISOString()
    }
  ];

  const carts = [];
  const wishlists = [];

  return { users, categories, products, orders, reviews, carts, wishlists };
};

// Read database from file, seed if not present
const readDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    
    // Ensure all required top level keys exist
    let dirty = false;
    const defaults = {
      users: [],
      categories: [],
      products: [],
      orders: [],
      reviews: [],
      carts: [],
      wishlists: []
    };
    for (const key in defaults) {
      if (!parsed[key]) {
        parsed[key] = defaults[key];
        dirty = true;
      }
    }
    if (dirty) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2));
    }
    return parsed;
  } catch (err) {
    console.error('Error reading json db file:', err.message);
    const initialData = getInitialData();
    return initialData;
  }
};

// Save database to file
const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Helper to recalculate ratings in memory database
const recalculateRatings = (productId, db) => {
  const prodReviews = db.reviews.filter(r => r.product === productId);
  const product = db.products.find(p => p._id === productId);
  if (product) {
    product.numReviews = prodReviews.length;
    if (prodReviews.length > 0) {
      const sum = prodReviews.reduce((acc, r) => acc + r.rating, 0);
      product.averageRating = Math.round((sum / prodReviews.length) * 10) / 10;
    } else {
      product.averageRating = 0;
    }
  }
};

const jsonDB = {
  // --- Products ---
  getProducts: (keyword, category, sort, minPrice, maxPrice) => {
    const db = readDB();
    let result = db.products;
    
    if (category && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (keyword) {
      const query = keyword.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    if (minPrice !== undefined && minPrice !== '') {
      result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      result = result.filter(p => p.price <= Number(maxPrice));
    }
    
    // Sort logic
    if (sort) {
      if (sort === 'priceAsc') {
        result.sort((a, b) => a.price - b.price);
      } else if (sort === 'priceDesc') {
        result.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        result.sort((a, b) => b.averageRating - a.averageRating);
      } else if (sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } else {
      result.reverse(); // default newest
    }
    
    return result;
  },

  getProductById: (id) => {
    const db = readDB();
    return db.products.find(p => p._id === id) || null;
  },

  createProduct: (productData) => {
    const db = readDB();
    const newProduct = {
      _id: 'json-prod-' + Date.now(),
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
      averageRating: 0,
      numReviews: 0,
      createdAt: new Date().toISOString()
    };
    db.products.push(newProduct);
    writeDB(db);
    return newProduct;
  },

  updateProduct: (id, productData) => {
    const db = readDB();
    const index = db.products.findIndex(p => p._id === id);
    if (index !== -1) {
      db.products[index] = {
        ...db.products[index],
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
        updatedAt: new Date().toISOString()
      };
      writeDB(db);
      return db.products[index];
    }
    return null;
  },

  deleteProduct: (id) => {
    const db = readDB();
    const exists = db.products.some(p => p._id === id);
    if (exists) {
      db.products = db.products.filter(p => p._id !== id);
      db.reviews = db.reviews.filter(r => r.product !== id); // Cascade delete reviews
      writeDB(db);
      return true;
    }
    return false;
  },

  updateProductStock: (id, qtyChange) => {
    const db = readDB();
    const product = db.products.find(p => p._id === id);
    if (product) {
      product.stock += qtyChange;
      if (product.stock < 0) product.stock = 0;
      writeDB(db);
      return true;
    }
    return false;
  },

  // --- Categories ---
  getCategories: () => {
    const db = readDB();
    if (!db.categories || db.categories.length === 0) {
      // populate from product categories
      const distinct = [...new Set(db.products.map(p => p.category))];
      db.categories = distinct.map((name, i) => ({
        _id: 'json-cat-' + i,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `${name} items`
      }));
      writeDB(db);
    }
    return db.categories;
  },

  createCategory: (categoryData) => {
    const db = readDB();
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (db.categories.some(c => c.slug === slug || c.name.toLowerCase() === categoryData.name.toLowerCase())) {
      throw new Error('Category already exists');
    }
    const newCat = {
      _id: 'json-cat-' + Date.now(),
      name: categoryData.name,
      slug,
      description: categoryData.description || '',
      createdAt: new Date().toISOString()
    };
    db.categories.push(newCat);
    writeDB(db);
    return newCat;
  },

  deleteCategory: (id) => {
    const db = readDB();
    const cat = db.categories.find(c => c._id === id);
    if (cat) {
      db.categories = db.categories.filter(c => c._id !== id);
      writeDB(db);
      return true;
    }
    return false;
  },

  // --- Reviews ---
  getProductReviews: (productId) => {
    const db = readDB();
    return db.reviews.filter(r => r.product === productId).reverse();
  },

  createReview: (userId, userName, productId, reviewData) => {
    const db = readDB();
    
    // Check if user already reviewed
    const alreadyReviewed = db.reviews.some(r => r.product === productId && r.user === userId);
    if (alreadyReviewed) {
      throw new Error('Product already reviewed by this user');
    }

    const newReview = {
      _id: 'json-rev-' + Date.now(),
      user: userId,
      userName: userName,
      product: productId,
      rating: Number(reviewData.rating),
      comment: reviewData.comment,
      createdAt: new Date().toISOString()
    };

    db.reviews.push(newReview);
    recalculateRatings(productId, db);
    writeDB(db);
    return newReview;
  },

  // --- Users ---
  getUsers: () => {
    const db = readDB();
    return db.users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }));
  },

  deleteUser: (id) => {
    const db = readDB();
    const exists = db.users.some(u => u._id === id);
    if (exists) {
      db.users = db.users.filter(u => u._id !== id);
      writeDB(db);
      return true;
    }
    return false;
  },

  updateUserRole: (id, role) => {
    const db = readDB();
    const user = db.users.find(u => u._id === id);
    if (user) {
      user.role = role;
      writeDB(db);
      return user;
    }
    return null;
  },

  getUserByEmail: (email) => {
    const db = readDB();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getUserById: (id) => {
    const db = readDB();
    return db.users.find(u => u._id === id) || null;
  },

  createUser: (userData) => {
    const db = readDB();
    const newUser = {
      _id: 'json-user-' + Date.now(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashPasswordSync(userData.password),
      role: 'user',
      savedAddresses: [],
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeDB(db);
    return newUser;
  },

  updateUserProfile: (userId, profileData) => {
    const db = readDB();
    const user = db.users.find(u => u._id === userId);
    if (!user) return null;
    if (profileData.name) user.name = profileData.name;
    if (profileData.email) user.email = profileData.email.toLowerCase();
    if (profileData.password) user.password = hashPasswordSync(profileData.password);
    writeDB(db);
    return user;
  },

  // --- Password Reset Mock ---
  forgotPassword: (email) => {
    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    writeDB(db);
    return resetToken;
  },

  resetPassword: (resetToken, newPassword) => {
    const db = readDB();
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = db.users.find(u => u.resetPasswordToken === hashedToken && u.resetPasswordExpire > Date.now());
    if (!user) return null;
    user.password = hashPasswordSync(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    writeDB(db);
    return user;
  },

  // --- User Address CRUD ---
  addAddress: (userId, addressData) => {
    const db = readDB();
    const user = db.users.find(u => u._id === userId);
    if (!user) return null;
    if (!user.savedAddresses) user.savedAddresses = [];
    const newAddress = {
      _id: 'json-addr-' + Date.now(),
      address: addressData.address,
      city: addressData.city,
      postalCode: addressData.postalCode,
      country: addressData.country,
      isDefault: user.savedAddresses.length === 0 ? true : !!addressData.isDefault
    };
    if (newAddress.isDefault) {
      user.savedAddresses.forEach(a => a.isDefault = false);
    }
    user.savedAddresses.push(newAddress);
    writeDB(db);
    return user;
  },

  deleteAddress: (userId, addressId) => {
    const db = readDB();
    const user = db.users.find(u => u._id === userId);
    if (!user || !user.savedAddresses) return null;
    user.savedAddresses = user.savedAddresses.filter(a => a._id !== addressId);
    if (user.savedAddresses.length > 0 && !user.savedAddresses.some(a => a.isDefault)) {
      user.savedAddresses[0].isDefault = true;
    }
    writeDB(db);
    return user;
  },

  updateAddress: (userId, addressId, addressData) => {
    const db = readDB();
    const user = db.users.find(u => u._id === userId);
    if (!user || !user.savedAddresses) return null;
    const addr = user.savedAddresses.find(a => a._id === addressId);
    if (!addr) return null;
    addr.address = addressData.address || addr.address;
    addr.city = addressData.city || addr.city;
    addr.postalCode = addressData.postalCode || addr.postalCode;
    addr.country = addressData.country || addr.country;
    if (addressData.isDefault !== undefined) {
      addr.isDefault = !!addressData.isDefault;
      if (addr.isDefault) {
        user.savedAddresses.forEach(a => {
          if (a._id !== addressId) a.isDefault = false;
        });
      }
    }
    writeDB(db);
    return user;
  },

  // --- Cart Sync ---
  getCart: (userId) => {
    const db = readDB();
    let cart = db.carts.find(c => c.user === userId);
    if (!cart) {
      cart = { _id: 'json-cart-' + Date.now(), user: userId, items: [] };
      db.carts.push(cart);
      writeDB(db);
    }
    // Populate product fields for frontend
    const populatedItems = cart.items.map(item => {
      const product = db.products.find(p => p._id === item.product);
      return {
        ...item,
        product: product || { _id: item.product, name: 'Unknown Product', price: 0, image: '', stock: 0 }
      };
    }).filter(item => item.product._id !== undefined);
    return { ...cart, items: populatedItems };
  },

  syncCart: (userId, items) => {
    const db = readDB();
    let cart = db.carts.find(c => c.user === userId);
    const sanitizedItems = items.map(item => ({
      product: typeof item.product === 'object' ? item.product._id : item.product,
      qty: Number(item.qty)
    }));
    if (cart) {
      cart.items = sanitizedItems;
    } else {
      cart = {
        _id: 'json-cart-' + Date.now(),
        user: userId,
        items: sanitizedItems
      };
      db.carts.push(cart);
    }
    writeDB(db);
    return jsonDB.getCart(userId);
  },

  removeFromCart: (userId, productId) => {
    const db = readDB();
    const cart = db.carts.find(c => c.user === userId);
    if (cart) {
      cart.items = cart.items.filter(item => item.product !== productId);
      writeDB(db);
    }
    return jsonDB.getCart(userId);
  },

  // --- Wishlist Sync ---
  getWishlist: (userId) => {
    const db = readDB();
    let wishlist = db.wishlists.find(w => w.user === userId);
    if (!wishlist) {
      wishlist = { _id: 'json-wish-' + Date.now(), user: userId, products: [] };
      db.wishlists.push(wishlist);
      writeDB(db);
    }
    // Populate products
    const populatedProducts = wishlist.products.map(pId => {
      return db.products.find(p => p._id === pId);
    }).filter(p => !!p);
    return { ...wishlist, products: populatedProducts };
  },

  addToWishlist: (userId, productId) => {
    const db = readDB();
    let wishlist = db.wishlists.find(w => w.user === userId);
    if (!wishlist) {
      wishlist = { _id: 'json-wish-' + Date.now(), user: userId, products: [productId] };
      db.wishlists.push(wishlist);
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }
    writeDB(db);
    return jsonDB.getWishlist(userId);
  },

  removeFromWishlist: (userId, productId) => {
    const db = readDB();
    const wishlist = db.wishlists.find(w => w.user === userId);
    if (wishlist) {
      wishlist.products = wishlist.products.filter(pId => pId !== productId);
      writeDB(db);
    }
    return jsonDB.getWishlist(userId);
  },

  // --- Orders ---
  createOrder: (userId, orderData) => {
    const db = readDB();
    
    // Validate stock and deduct
    for (const item of orderData.orderItems) {
      const pId = typeof item.product === 'object' ? item.product._id : item.product;
      const product = db.products.find(p => p._id === pId);
      if (!product) {
        throw new Error(`Product "${item.name}" not found in local catalog`);
      }
      if (product.stock < item.qty) {
        throw new Error(`Insufficient stock for "${item.name}". Available: ${product.stock}`);
      }
    }

    // Deduct stock
    for (const item of orderData.orderItems) {
      const pId = typeof item.product === 'object' ? item.product._id : item.product;
      const product = db.products.find(p => p._id === pId);
      product.stock -= item.qty;
    }

    const newOrder = {
      _id: 'json-order-' + Date.now(),
      user: userId,
      orderItems: orderData.orderItems.map(item => ({
        ...item,
        product: typeof item.product === 'object' ? item.product._id : item.product
      })),
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      taxPrice: Number(orderData.taxPrice) || 0,
      shippingPrice: Number(orderData.shippingPrice) || 0,
      totalPrice: Number(orderData.totalPrice) || 0,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);
    
    // Empty the user's cart on successful checkout
    const cart = db.carts.find(c => c.user === userId);
    if (cart) {
      cart.items = [];
    }
    
    writeDB(db);
    return newOrder;
  },

  getUserOrders: (userId) => {
    const db = readDB();
    return db.orders.filter(o => o.user === userId).slice().reverse();
  },

  getAllOrders: () => {
    const db = readDB();
    // populate user metadata (mimic populate)
    const result = db.orders.map(order => {
      const user = db.users.find(u => u._id === order.user);
      return {
        ...order,
        user: user ? { _id: user._id, name: user.name, email: user.email } : null
      };
    });
    return result.slice().reverse();
  },

  cancelOrder: (orderId, userId) => {
    const db = readDB();
    const order = db.orders.find(o => o._id === orderId && o.user === userId);
    if (!order) return null;
    if (order.status !== 'Pending') {
      throw new Error('Only Pending orders can be cancelled');
    }
    order.status = 'Cancelled';
    
    // Release back product stock
    order.orderItems.forEach(item => {
      const product = db.products.find(p => p._id === item.product);
      if (product) {
        product.stock += item.qty;
      }
    });

    writeDB(db);
    return order;
  },

  updateOrderStatus: (orderId, status) => {
    const db = readDB();
    const order = db.orders.find(o => o._id === orderId);
    if (!order) return null;
    order.status = status;
    writeDB(db);
    
    // Populate user
    const user = db.users.find(u => u._id === order.user);
    return {
      ...order,
      user: user ? { _id: user._id, name: user.name, email: user.email } : null
    };
  },

  // --- Admin Analytics ---
  getAdminAnalytics: () => {
    const db = readDB();
    const usersCount = db.users.length;
    const productsCount = db.products.length;
    const ordersCount = db.orders.length;
    
    const paidOrders = db.orders.filter(o => o.status !== 'Cancelled');
    const totalSales = paidOrders.reduce((acc, o) => acc + o.totalPrice, 0);

    // Sales by category
    const salesByCategory = {};
    db.products.forEach(p => {
      salesByCategory[p.category] = 0;
    });
    paidOrders.forEach(order => {
      order.orderItems.forEach(item => {
        const product = db.products.find(p => p._id === item.product);
        const cat = product ? product.category : 'Unknown';
        if (!salesByCategory[cat]) salesByCategory[cat] = 0;
        salesByCategory[cat] += item.price * item.qty;
      });
    });

    // Recent orders
    const recentOrders = db.orders.slice(-5).reverse().map(order => {
      const user = db.users.find(u => u._id === order.user);
      return {
        _id: order._id,
        user: user ? { name: user.name, email: user.email } : null,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt
      };
    });

    // Top products
    const productSalesCount = {};
    paidOrders.forEach(order => {
      order.orderItems.forEach(item => {
        if (!productSalesCount[item.product]) productSalesCount[item.product] = 0;
        productSalesCount[item.product] += item.qty;
      });
    });
    
    const topProducts = Object.keys(productSalesCount).map(pId => {
      const product = db.products.find(p => p._id === pId);
      return {
        _id: pId,
        name: product ? product.name : 'Unknown Product',
        salesCount: productSalesCount[pId],
        price: product ? product.price : 0,
        revenue: productSalesCount[pId] * (product ? product.price : 0)
      };
    }).sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);

    // Status distributions
    const statusDistribution = {
      Pending: db.orders.filter(o => o.status === 'Pending').length,
      Processing: db.orders.filter(o => o.status === 'Processing').length,
      Shipped: db.orders.filter(o => o.status === 'Shipped').length,
      Delivered: db.orders.filter(o => o.status === 'Delivered').length,
      Cancelled: db.orders.filter(o => o.status === 'Cancelled').length
    };

    return {
      usersCount,
      productsCount,
      ordersCount,
      totalSales: Math.round(totalSales * 100) / 100,
      salesByCategory,
      statusDistribution,
      recentOrders,
      topProducts
    };
  }
};

module.exports = jsonDB;
