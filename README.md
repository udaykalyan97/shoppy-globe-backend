# Shoppy-Globe Backend

The backend for the Shoppy-Globe e-commerce platform, built with **Node.js**, **Express.js**, and **MongoDB**. It provides APIs for managing users, products, and shopping carts, with JWT-based authentication for secure access.

## Features

- **User Management**: Register and login users with JWT-based authentication.
- **Product Management**: Add, view, and manage products with detailed schemas.
- **Shopping Cart**: Add, update, and remove items in a shopping cart.
- **Database Initialization**: Prepopulate the database with sample product data.
- **Secure APIs**: JWT middleware ensures only authenticated users can access protected routes.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/udaykalyan97/shoppy-globe-backend.git
   ```


2. Navigate to the project directory:
 ```bash
cd shoppy-globe-backend
```

3. Install dependencies:
 ```bash
npm install
```

4. Start the MongoDB server:
 ```bash
mongod --dbpath=/path/to/your/data/db
```

5. Start the server:
 ```bash
npm start
```

## Environment Variables

Create a `.env` file in the root of the project and configure the following variables:

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/shoppy-globe
JWT_SECRET=yourSecretKey
```


## API Endpoints

### User APIs
- **POST** `/register`: Register a new user.
- **POST** `/login`: Authenticate user and return a JWT token.

### Product APIs
- **GET** `/products`: Fetch all products (protected).
- **GET** `/products/:id`: Fetch a single product by ID (protected).

### Cart APIs
- **POST** `/cart`: Add a product to the cart (protected).
- **PUT** `/cart`: Update the quantity of a product in the cart (protected).
- **DELETE** `/cart`: Remove a product from the cart (protected).

## Project Structure

```bash
shoppy-globe-backend/
│
├── Controller/
│   ├── initialDB.controller.js  # Database initialization
│
├── Models/
│   ├── product.model.js         # Product schema
│   ├── user.model.js            # User schema
│   ├── cart.model.js            # Cart schema
│
├── Routes/
│   ├── product.routes.js        # Product-related routes
│   ├── user.routes.js           # User-related routes
│   ├── cart.routes.js           # Cart-related routes
│
├── .env                         # Environment variables
├── server.js                    # Main server file
├── package.json                 # Project dependencies

```


## Usage

Use **Thunder Client** or **Postman** to test APIs.  

For protected routes, add the `Authorization` header with a valid JWT token:
Authorization: Bearer <your_token>


## Contributing

1. Fork the repository.  
2. Create a new feature branch:  
   ```bash
   git checkout -b feature/your-feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add your message here"
    ```
4. Push to your branch:
    ```bash
    git push origin feature/your-feature-name
    ```
5. Open a pull request.

---

# Assignment: Build APIs with Node.js and Express.js for ShoppyGlobe E-commerce

## Objective
Create the backend for the ShoppyGlobe application using Node.js, Express, and MongoDB.

---

## Requirements

### 1. Node.js and Express API Setup:
- **Set up a Node.js application using Express.**
- **Create the following routes:**
  - `GET /products`: Fetch a list of products from MongoDB.
  - `GET /products/:id`: Fetch details of a single product by its ID.
  - `POST /cart`: Add a product to the shopping cart.
  - `PUT /cart/:id`: Update the quantity of a product in the cart.
  - `DELETE /cart/:id`: Remove a product from the cart.

---

### 2. MongoDB Integration:
- **Use MongoDB to store product data and cart items.**
- **Set up collections for:**
  - **Products:** Fields include `name`, `price`, `description`, and `stock quantity`.
  - **Cart:** Items include `product IDs` and `quantities`.
- **Implement CRUD operations** on MongoDB collections for products and cart items.
- **Provide screenshots** from the MongoDB Database.

---

### 3. API Error Handling and Validation:
- **Implement error handling** for all API routes.
- **Validate input data**, e.g., check if product ID exists before adding it to the cart.

---

### 4. Authentication & Authorization:
- **Implement JWT-based authentication.**
- **Create the following routes:**
  - `POST /register`: Register a new user.
  - `POST /login`: Authenticate user and return a JWT token.
- **Protect cart routes**, so only logged-in users can access them.

---

### 5. Testing with ThunderClient:
- **Use ThunderClient to test all API routes.**

---

### 6. Submission Guidelines:
- Ensure the API runs without errors.
- Submit a GitHub repository link containing:
  - Source code and documentation.
  - API testing screenshots.
- Include comments and proper documentation in the code. 

---

### Additional Notes:
- Focus on modularity and maintainable project structure.
- Ensure API responses include meaningful error messages and HTTP status codes.
- Follow best practices for securing JWT tokens and handling sensitive data.
