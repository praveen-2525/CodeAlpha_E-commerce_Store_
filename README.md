# AuraStore | Industry-Inspired Full-Stack E-Commerce Store

An industry-level, professional Full-Stack E-Commerce Store project designed as a complete internship portfolio submission. Built using a unified JavaScript stack with an Express REST API backend and a responsive Vanilla HTML5/CSS3/JavaScript frontend client.

---

## 🌟 Key Features

1. **Responsive Glassmorphic UI**: Optimized layout configurations for Mobile, Tablet, and Desktop screen widths.
2. **Product Catalog Listing**: Immersive product grids, category filtering sidebar, and search operations.
3. **Product Details View**: Dynamic stock status checking, details summaries, and quantity selectors.
4. **Interactive Shopping Cart**: Add, remove, and update cart item quantities with immediate tax and shipping calculations.
5. **JWT Authentication Guarding**: Protected routes secured with JSON Web Tokens and passwords hashed using bcryptjs.
6. **Administrator Dashboard Panel**: Restricted controls to add new products, inspect inventory volumes, and track stock.
7. **Robust Error Handler Middleware**: Graceful capture of CastErrors, validation issues, and key duplicates.
8. **Toast Notifications & Loading States**: Clean micro-animations and status banners.

---

## 🛠️ Technology Stack

- **Frontend client**: HTML5, CSS3 (CSS Variables, Flexbox, Grids, Transitions), Vanilla JavaScript
- **Backend server**: Node.js, Express.js
- **Database layer**: MongoDB, Mongoose ODM
- **Security & Tokens**: jsonwebtoken (JWT), bcryptjs

---

## 📂 Project Structure

```text
E-commerce store/
├── config/
│   └── db.js                 # Database connection handler using Mongoose
├── middleware/
│   ├── auth.js               # JWT verification & admin role check middleware
│   └── error.js              # Centralized express error handler
├── models/
│   ├── User.js               # User collection database model
│   ├── Product.js            # Product collection database model
│   └── Order.js              # Order collection database model
├── routes/
│   ├── auth.js               # Register, login, and user profile endpoints
│   ├── products.js           # Search, listing, categories, and admin creation endpoints
│   └── orders.js             # Checkout placement, history, and admin check endpoints
├── public/                   # Static Frontend Files
│   ├── css/
│   │   └── style.css         # Dark theme layout variables, tables, and grids
│   ├── js/
│   │   ├── api.js            # Base HTTP wrapper, localStorage handler, and nav toggles
│   │   ├── auth.js           # Register & login submission controller
│   │   ├── products.js       # Search filters & catalogs rendering controller
│   │   ├── details.js        # Specifications loader & quantities widget binder
│   │   ├── cart.js           # Subtotals math, removals, and checkout form handler
│   │   ├── orders.js         # Order history dynamic builder
│   │   └── admin.js          # Admin dashboard & products addition logic
│   ├── index.html            # Landing homepage with sliding hero section
│   ├── products.html         # Main catalog browse marketplace
│   ├── product-details.html  # Product description details sheet
│   ├── cart.html             # Item basket list & shipping address form
│   ├── login.html            # User credentials authentication portal
│   ├── register.html         # User sign up form portal
│   ├── orders.html           # Historical order transaction tracking table
│   └── admin.html            # Product creation & stock control interface
├── scripts/
│   ├── seed.js               # Seeder file to populate 20 products & users
│   └── test-api.js           # Diagnostics local API ping check script
├── .env                      # Secrets & configurations (port, MONGO_URI)
├── package.json              # Script directives & npm dependencies
└── server.js                 # Main startup file
```

---

## 🚀 Installation & Local Startup

### 1. Prerequisites
- Install **Node.js** (v16+ recommended).
- Install and start **MongoDB** locally (defaulting to `mongodb://127.0.0.1:27017/ecommerce`) or configure a **MongoDB Atlas** cloud cluster.

### 2. Setup Files & Dependencies
Extract the project files, navigate into the root directory in your terminal, and install the node dependencies:
```bash
npm install
```

### 3. Environment Variable Configuration
Verify that the `.env` file exists in your project root with the following parameters:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=supersecretjwtkeyforinternshipecommerce2026
```

### 4. Database Seeding
Populate the database collections with 20 distinct products, 1 Customer user, 1 Administrator user, and 1 historical order:
```bash
npm run seed
```

### 5. Launch the Server
Start the Express server locally:
```bash
npm run dev
```
Open your browser and navigate to: **[http://localhost:5000](http://localhost:5000)** to view the live e-commerce application.

---

## 📖 REST API Documentation (Phase 5)

All backend endpoints are structured under `/api` and consume/return `application/json` content.

### 1. User Authentication Routes

#### **POST** `/api/auth/register`
Creates a new client account.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@ecommerce.com",
    "password": "Password123"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "640aef5c88b63e14a840e1a1",
      "name": "Jane Doe",
      "email": "jane@ecommerce.com",
      "role": "user",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### **POST** `/api/auth/login`
Authenticates a user and issues a JWT token.
- **Request Body**:
  ```json
  {
    "email": "buyer@ecommerce.com",
    "password": "BuyerPassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "640aef5c88b63e14a840e1a2",
      "name": "John Customer",
      "email": "buyer@ecommerce.com",
      "role": "user",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

---

### 2. Product Catalog Routes

#### **GET** `/api/products`
Retrieves products list. Supports optional keyword query search & category filter.
- **Query Params**: `keyword=headphones`, `category=Electronics`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "640bef5c88b63e14a840e2b1",
        "name": "TechPro Over-Ear Headphones",
        "description": "Studio-quality active noise-cancelling headphones...",
        "price": 199.99,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        "category": "Electronics",
        "stock": 15
      }
    ]
  }
  ```

#### **GET** `/api/products/:id`
Retrieves specifications for a single item.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "640bef5c88b63e14a840e2b1",
      "name": "TechPro Over-Ear Headphones",
      "price": 199.99,
      "description": "Studio-quality active noise-cancelling headphones...",
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      "category": "Electronics",
      "stock": 15
    }
  }
  ```

#### **POST** `/api/products` *(Admin Protected)*
Appends a new item to the store catalog. Requires JWT Header.
- **Authorization Header**: `Bearer <admin_jwt_token>`
- **Request Body**:
  ```json
  {
    "name": "Mechanical Keyboard Pro",
    "description": "Premium brown switch keyboard with RGB backlights",
    "price": 129.99,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
    "category": "Electronics",
    "stock": 10
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "640cef5c88b63e14a840e3c4",
      "name": "Mechanical Keyboard Pro",
      "price": 129.99,
      "category": "Electronics",
      "stock": 10
    }
  }
  ```

---

### 3. Checkout Transaction Routes

#### **POST** `/api/orders` *(User Protected)*
Validates inventory stock volumes, creates a new order transaction, and deducts items from inventory.
- **Authorization Header**: `Bearer <user_jwt_token>`
- **Request Body**:
  ```json
  {
    "orderItems": [
      {
        "name": "TechPro Over-Ear Headphones",
        "qty": 2,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        "price": 199.99,
        "product": "640bef5c88b63e14a840e2b1"
      }
    ],
    "shippingAddress": {
      "address": "102 Innovation Way",
      "city": "Silicon Valley",
      "postalCode": "94016",
      "country": "United States"
    },
    "paymentMethod": "Cash on Delivery",
    "taxPrice": 59.99,
    "shippingPrice": 0.00,
    "totalPrice": 459.97
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "640def5c88b63e14a840e4d2",
      "user": "640aef5c88b63e14a840e1a2",
      "orderItems": [...],
      "shippingAddress": {...},
      "totalPrice": 459.97,
      "status": "Pending"
    }
  }
  ```

#### **GET** `/api/orders/myorders` *(User Protected)*
Retrieves all historical orders completed by the logged-in customer.
- **Authorization Header**: `Bearer <user_jwt_token>`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "640def5c88b63e14a840e4d2",
        "orderItems": [...],
        "totalPrice": 459.97,
        "status": "Pending",
        "createdAt": "2026-06-06T14:00:18.000Z"
      }
    ]
  }
  ```

---

## 🧪 Testing Protocol & Cases (Phase 8)

### 1. Manual Testing Checklist
- [ ] **Registration Form validation**: Fill register fields with non-matching passwords, verify red alert toasts. Register with a short password (< 6 characters) and verify validation warning.
- [ ] **Login Authentication**: Verify that logging in with incorrect credentials triggers invalid toasts. Verify that successful login redirects to `products.html` and saves the user JWT to `localStorage`.
- [ ] **Dynamic Navigation**: Verify that the navbar updates to show "My Orders", "Logout", and "Cart" badge counts upon logging in.
- [ ] **Search & Sidebar filters**: Search for `"Pro"` inside catalog input, press Enter, verify that the grid filters down. Click `"Apparel"`, verify that cards are updated to apparel items.
- [ ] **Stock Constraints**: Go to product details page of an item with stock `15`. Click `+` button 20 times. Verify that warning toast triggers and caps quantity input to `15`. Add `15` items to cart. Try adding another from listings page, verify stock boundary toast.
- [ ] **Admin Operations**: Login using `admin@ecommerce.com` / `AdminPassword123`, verify that you can navigate to `admin.html`. Fill and submit a new product, verify that it appears instantly inside "Catalog Inventory" table and catalog shop grid.

### 2. Local Diagnostic Tests
Ensure your Express server is running, and launch our verification script:
```bash
node scripts/test-api.js
```

---

## 🎓 Internship Submission Materials (Phase 9)

### 1. 2-Minute Project Explanation Script
> *"Good morning panel/mentor, today I am presenting my internship project: a full-stack, industry-inspired E-Commerce application. The project is designed with a single-repository architecture where Node.js and Express manage the RESTful API endpoints, and serve our static HTML, CSS, and Vanilla JavaScript frontend resources on a single unified port.*
> 
> *For our database layer, we utilize MongoDB with Mongoose to enforce structured Schemas for Users, Products, and Orders. Security is prioritized using JWT authentication; when a client registers or logs in, a token is issued and stored in localStorage. Passwords are encrypted pre-save inside Mongoose using bcryptjs.*
> 
> *On the frontend, I avoided external framework complexity and styled the UI from scratch using custom CSS variables, glassmorphic panel backdrops, and media query viewports to achieve a responsive, sleek dark theme. We support catalog keyword searches, sidebar category filters, and live stock tracking: if a buyer attempts to purchase items exceeding the warehouse stock, the client alerts them, and checking out deducts that stock from the collection automatically. This application is modular, completely documented, and directly deployable on cloud infrastructures."*

### 2. Project Workflow Explanation
1. **Request Flow**: The browser loads the UI files (`index.html`, etc.) served statically by Express.
2. **API Requests**: JavaScript makes async Fetch calls to backend routers under `/api`.
3. **Guard Checking**: Endpoints for checkout or product additions run through `protect` or `admin` middlewares to verify authorization headers.
4. **Mongoose Execution**: Routers access Mongoose schemas to validate operations, hash credentials, check stock limits, update product documents, and record order details.
5. **JSON Response**: The Express server returns standardized JSON payloads. The client captures successes or errors, updates the navbar, displays toast notifications, and renders HTML content.

### 3. Viva & Interview Questions and Answers (Q&A)

**Q1: Why did you choose JSON Web Tokens (JWT) instead of session-based cookies?**  
*A: JWT is stateless, meaning the server doesn't need to store session states in memory. The token contains encrypted payloads that verify user identity, making the backend API scalable, easy to secure, and highly compatible with mobile/third-party clients.*

**Q2: How does Mongoose pre-save hashing work for password security?**  
*A: Inside `models/User.js`, we define a Mongoose middleware hook: `UserSchema.pre('save', ...)`. Before the user document is written to MongoDB, the hook intercepts the operation, checks if the password field is modified, hashes it using `bcryptjs` with 10 salt rounds, and overwrites the plain-text password with the secure hash. This prevents plain-text storage.*

**Q3: How does the application prevent race conditions or stock overselling?**  
*A: In `routes/orders.js`, when a checkout request is received, we execute two steps: first, we query the product collection to verify that the requested quantities are available. If all are in stock, we perform an atomic update using `Product.findByIdAndUpdate` with the Mongoose decrement operator `$inc: { stock: -item.qty }`. This atomic database write prevents overselling.*

**Q4: Why serve the frontend statically from the backend `public` folder?**  
*A: Serving the frontend statically from Express eliminates CORS (Cross-Origin Resource Sharing) configuration errors because both assets are hosted on the same origin (protocol, domain, and port). It simplifies cloud deployments since the entire full-stack project is contained in one repository and runs on a single server port.*

---

## ☁️ Cloud Deployment Walkthrough (Phase 10)

### 1. Database Setup: MongoDB Atlas
1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Deploy a free shared Cluster (M0 Sandbox).
3. Under **Network Access**, add IP address `0.0.0.0/log` (allow access from anywhere, required for cloud servers like Render).
4. Under **Database Access**, create a user account with a password (e.g. `dbUser` / `SecurePassword123`).
5. Click **Connect** -> **Drivers** -> Copy the connection URI string. Replace `<password>` with your database user password:
   `mongodb+srv://dbUser:SecurePassword123@cluster0.abcde.mongodb.net/ecommerce?retryWrites=true&w=majority`

### 2. Backend Server Setup: Render.com
1. Create a free account on [Render](https://render.com).
2. Connect your **GitHub repository** where your project is uploaded.
3. Select **New Web Service**. Set configuration attributes:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add the values:
   - `MONGO_URI` = *(your MongoDB Atlas connection string)*
   - `JWT_SECRET` = `yoursecrettokenkeyhere`
   - `PORT` = `10000` (Render binds this dynamically, but adding 10000 is a safe backup)
5. Click **Deploy Web Service**. Render will build the project and serve both frontend static client assets and backend REST APIs on their generated URL.
