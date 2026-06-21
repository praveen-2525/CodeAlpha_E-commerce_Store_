# E-Commerce Store

## Overview

The E-Commerce Store is a full-stack web application that allows customers to browse products, add items to a shopping cart, place orders, and make secure online payments. The platform provides a seamless shopping experience while enabling administrators to manage products, categories, inventory, and customer orders efficiently.

---

## Features

### Customer Features

* User Registration and Login
* Product Browsing and Search
* Product Categories and Filters
* Shopping Cart Management
* Wishlist Functionality
* Secure Checkout
* Online Payment Integration
* Order Tracking and History
* Product Reviews and Ratings

### Admin Features

* Product Management (Add, Edit, Delete)
* Category Management
* Inventory Management
* Order Management
* Customer Management
* Sales Reports and Analytics

### Security Features

* JWT Authentication
* Password Encryption using Bcrypt
* Role-Based Access Control
* Secure Payment Processing

---

## Technologies Used

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript
* Bootstrap / Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Payment Gateway

* Stripe / Razorpay

### Authentication

* JWT
* Bcrypt

---

## Program Structure

```text
ecommerce-store/
│
├── client/                         # Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProductCard.js
│   │   │   ├── CartItem.js
│   │   │   ├── CheckoutForm.js
│   │   │   └── Footer.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── ProductDetails.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Orders.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── productService.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
├── server/                         # Backend Application
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Category.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── payments/
│   │   └── paymentGateway.js
│   │
│   ├── server.js
│   └── package.json
│
├── .env
├── README.md
└── package.json
```

---

## Installation

### Prerequisites

* Node.js (v16+)
* MongoDB
* Git

### Clone Repository

```bash
git clone https://github.com/yourusername/ecommerce-store.git
cd ecommerce-store
```

### Install Dependencies

```bash
npm install
cd client
npm install
```

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PAYMENT_API_KEY=your_payment_gateway_key
```

### Run Backend

```bash
npm run server
```

### Run Frontend

```bash
npm start
```

---

## Database Collections

### Users

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "customer"
}
```

### Products

```json
{
  "_id": "ObjectId",
  "name": "Wireless Headphones",
  "description": "Noise-cancelling headphones",
  "price": 2999,
  "category": "Electronics",
  "stock": 50,
  "image": "product_image_url"
}
```

### Orders

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "items": [],
  "totalAmount": 5998,
  "status": "Delivered",
  "createdAt": "Date"
}
```

### Cart

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "products": [],
  "totalPrice": 2999
}
```

---

## API Endpoints

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`

### Products

* `GET /api/products`
* `GET /api/products/:id`
* `POST /api/products`
* `PUT /api/products/:id`
* `DELETE /api/products/:id`

### Cart

* `GET /api/cart`
* `POST /api/cart/add`
* `DELETE /api/cart/remove/:id`

### Orders

* `POST /api/orders`
* `GET /api/orders`
* `GET /api/orders/:id`

---

## Future Enhancements

* AI-Based Product Recommendations
* Multi-Vendor Marketplace
* Coupon and Discount System
* Live Chat Support
* Mobile Application
* Product Recommendation Engine
* Advanced Sales Analytics
* Social Media Login Integration

The E-Commerce Store is a scalable and secure online shopping platform that provides essential e-commerce functionalities such as product management, cart operations, order processing, and payment integration. Its modular architecture and organized program structure make it easy to maintain, enhance, and deploy, making it suitable for businesses of all sizes.
