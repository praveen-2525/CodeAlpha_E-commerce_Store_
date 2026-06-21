const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Review = require('../models/Review');

// Load environment variables
dotenv.config();

const categoriesData = [
  { name: 'Electronics', description: 'Gadgets, devices, and computing electronics' },
  { name: 'Apparel', description: 'Men and women premium fashion garments' },
  { name: 'Home & Kitchen', description: 'Sheets, cookware, and kitchen appliances' },
  { name: 'Sports & Fitness', description: 'Camping gear, outdoor equipment, and gym weights' },
  { name: 'Books', description: 'Novels, strategy guides, and educational literature' }
];

const productsData = [
  {
    name: 'TechPro Over-Ear Headphones',
    description: 'Experience studio-quality sound with active noise-cancellation (ANC), 40-hour battery life, and ultra-comfortable memory foam earcups.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    category: 'Electronics',
    stock: 15
  },
  {
    name: 'SmartFit Pro Fitness Tracker',
    description: 'Track your heart rate, sleep quality, daily steps, and workouts with this water-resistant smartwatch featuring a high-definition AMOLED screen.',
    price: 89.50,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80',
    category: 'Electronics',
    stock: 25
  },
  {
    name: 'Ultima Mechanical Keyboard',
    description: 'Anodized aluminum frame, hot-swappable brown tactile switches, and vibrant customizable RGB backlighting for developers and gamers alike.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    category: 'Electronics',
    stock: 10
  },
  {
    name: 'Curved IPS Gaming Monitor 27"',
    description: 'Immersive 1500R curvature, QHD resolution (2560x1440), lightning-fast 165Hz refresh rate, and 1ms response time with AMD FreeSync technology.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    category: 'Electronics',
    stock: 8
  },
  {
    name: 'Ergonomic Wireless Mouse',
    description: 'Designed to fit comfortably in your palm, featuring adjustable DPI levels, dual wireless modes (Bluetooth + 2.4GHz), and silent-click buttons.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
    category: 'Electronics',
    stock: 40
  },
  {
    name: "Men's Explorer Bomber Jacket",
    description: 'Water-resistant, insulated shell jacket inspired by flight deck designs. Perfect for cool-weather styling and outdoor excursions.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
    category: 'Apparel',
    stock: 20
  },
  {
    name: "Women's Comfort Knit Sweater",
    description: 'Woven with a premium cashmere blend, this oversized cable-knit crewneck sweater offers exceptional warmth and luxury comfort.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1574164904299-3a102b110380?w=500&q=80',
    category: 'Apparel',
    stock: 18
  },
  {
    name: 'Vintage Leather Messenger Bag',
    description: 'Handcrafted genuine leather messenger bag with dedicated 15.6-inch laptop pocket, antique brass hardware, and adjustable shoulder straps.',
    price: 110.00,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    category: 'Apparel',
    stock: 12
  },
  {
    name: 'Breathable Running Sneakers',
    description: 'Engineered mesh upper, impact-absorbing foam midsole, and durable rubber traction outsoles for jogging, running, and heavy gym training.',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    category: 'Apparel',
    stock: 30
  },
  {
    name: 'Premium Bamboo Sheet Set',
    description: 'Silky smooth, hypoallergenic, temperature-regulating bamboo viscose sheets. Set includes 1 flat sheet, 1 fitted sheet, and 2 pillowcases.',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80',
    category: 'Home & Kitchen',
    stock: 15
  },
  {
    name: 'Electric Stainless Steel Kettle',
    description: 'Boil water in minutes with this 1500W rapid-heating cordless kettle. Features auto-shutoff and boil-dry safety protection.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1594213112796-54a4ecd8d329?w=500&q=80',
    category: 'Home & Kitchen',
    stock: 22
  },
  {
    name: '12-Cup Programmable Coffee Maker',
    description: 'Wake up to freshly brewed coffee with this 24-hour programmable brewer featuring a glass carafe and customizable brew strength selector.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=500&q=80',
    category: 'Home & Kitchen',
    stock: 14
  },
  {
    name: 'Double-Wall Vacuum Water Bottle',
    description: 'Insulated stainless steel sports bottle. Keeps cold drinks ice-cold for 24 hours, and warm drinks piping-hot for up to 12 hours.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
    category: 'Home & Kitchen',
    stock: 50
  },
  {
    name: 'Pre-Seasoned Cast Iron Skillet',
    description: 'Heavy-duty 12-inch cast iron skillet that offers lifetime durability and unmatched heat retention for searing, baking, and frying.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&q=80',
    category: 'Home & Kitchen',
    stock: 10
  },
  {
    name: 'Hex Dumbbells Pair (15 lbs)',
    description: 'Solid cast iron dumbbells coated in protective hex-shaped black rubber to prevent rolling and protect floor surfaces from scratching.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&q=80',
    category: 'Sports & Fitness',
    stock: 16
  },
  {
    name: 'Eco-Friendly Pro Yoga Mat',
    description: 'Made from non-toxic biodegradable TPE material, featuring a double-sided non-slip texture and 6mm thickness for joint cushioning.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80',
    category: 'Sports & Fitness',
    stock: 35
  },
  {
    name: '4-Person Waterproof Camping Tent',
    description: 'Easy 10-minute setup with pre-attached poles, waterproof rainfly cover, and ventilation screen windows for a cozy outdoor shelter.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&q=80',
    category: 'Sports & Fitness',
    stock: 6
  },
  {
    name: 'Gourmet Cooking Masterclass',
    description: 'A beautiful hardcover book with over 150 culinary recipes, cooking techniques, and plating presentations from Michelin-star chefs.',
    price: 32.50,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80',
    category: 'Books',
    stock: 25
  },
  {
    name: 'The Chronicles of Nebula Sci-Fi Novel',
    description: 'A gripping space opera paperback story detailing galactic diplomacy, rebellion, and exploration at the edge of the universe.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1478720143022-385f704a3e79?w=500&q=80',
    category: 'Books',
    stock: 50
  },
  {
    name: 'Productive Habits Guidebook',
    description: 'Learn step-by-step psychological strategies to break bad habits, build life-changing positive routines, and maximize your daily focus.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&q=80',
    category: 'Books',
    stock: 45
  }
];

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    console.log('Seed: Connected to Database...');

    // Clear existing collections
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();
    console.log('Seed: Cleared existing database collections.');

    // Seed Categories
    await Category.create(categoriesData);
    console.log('Seed: Added default categories.');

    // Seed default users
    const adminUser = await User.create({
      name: 'E-commerce Admin',
      email: 'admin@ecommerce.com',
      password: 'AdminPassword123',
      role: 'admin',
      savedAddresses: [
        {
          address: '500 HQ Boulevard',
          city: 'Tech City',
          postalCode: '10001',
          country: 'Developer Land',
          isDefault: true
        }
      ]
    });

    const customerUser = await User.create({
      name: 'John Customer',
      email: 'buyer@ecommerce.com',
      password: 'BuyerPassword123',
      role: 'user',
      savedAddresses: [
        {
          address: '102 Innovation Way',
          city: 'Silicon Valley',
          postalCode: '94016',
          country: 'United States',
          isDefault: true
        }
      ]
    });

    console.log('Seed: Added default Users.');
    console.log('   - Admin: admin@ecommerce.com / AdminPassword123');
    console.log('   - Buyer: buyer@ecommerce.com / BuyerPassword123');

    // Seed 20 products
    const createdProducts = await Product.create(productsData);
    console.log(`Seed: Added ${createdProducts.length} product items.`);

    // Seed reviews
    const product1 = createdProducts[0]; // Headphones
    const product2 = createdProducts[1]; // Fitness Tracker
    const product3 = createdProducts[2]; // Mechanical Keyboard

    await Review.create([
      {
        user: customerUser._id,
        userName: customerUser.name,
        product: product1._id,
        rating: 5,
        comment: 'Incredible sound isolation and heavy punchy bass. Best purchase of this year!'
      },
      {
        user: adminUser._id,
        userName: adminUser.name,
        product: product1._id,
        rating: 4,
        comment: 'Very solid construction and clean spatial imaging. ANC could be slightly stronger.'
      },
      {
        user: customerUser._id,
        userName: customerUser.name,
        product: product2._id,
        rating: 4,
        comment: 'Decent fitness watch. Tracker is accurate enough, and AMOLED screen is vibrant.'
      },
      {
        user: customerUser._id,
        userName: customerUser.name,
        product: product3._id,
        rating: 5,
        comment: 'Love the tactile feel and satisfying sound of the brown switches. Backlighting is gorgeous.'
      }
    ]);
    console.log('Seed: Added product reviews and recalculated averages.');

    // Seed 1 test order for the buyer
    const orderItems = [
      {
        name: product1.name,
        qty: 1,
        image: product1.image,
        price: product1.price,
        product: product1._id
      },
      {
        name: product2.name,
        qty: 2,
        image: product2.image,
        price: product2.price,
        product: product2._id
      }
    ];

    const shippingPrice = 10;
    const taxPrice = 30.5;
    const totalPrice = product1.price * 1 + product2.price * 2 + shippingPrice + taxPrice;

    await Order.create({
      user: customerUser._id,
      orderItems,
      shippingAddress: {
        address: '102 Innovation Way',
        city: 'Silicon Valley',
        postalCode: '94016',
        country: 'United States'
      },
      paymentMethod: 'Cash on Delivery',
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'Pending'
    });

    // Deduct stock for the ordered items (corrected syntax)
    await Product.findByIdAndUpdate(product1._id, { $inc: { stock: -1 } });
    await Product.findByIdAndUpdate(product2._id, { $inc: { stock: -2 } });

    console.log('Seed: Inserted a test order successfully.');
    console.log('Database Seeding Completed!');
    process.exit();
  } catch (error) {
    console.error(`Seeding error details: ${error.message}`);
    process.exit(1);
  }
};

seedData();
