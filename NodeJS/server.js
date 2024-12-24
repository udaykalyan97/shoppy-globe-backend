// Import necessary modules and files
import express from "express";                                                      // Web framework for Node.js
import mongoose from "mongoose";                                                    // MongoDB object modeling tool
import initializeDatabase from "./Controller/initialDB.controller.js";              // Function to initialize database with sample data
import jwt from "jsonwebtoken";                                                     // Library to handle JSON Web Tokens (JWT)
import { cartRoutes } from "./Routes/cart.routes.js";                               // Cart-related routes
import { productRoutes } from "./Routes/product.routes.js";                         // Product-related routes
import { userRoutes } from "./Routes/user.routes.js";                               // User-related routes
import { PORT_NUM, MONGO_URI, JWT_SECRET } from "./Constants.js";


// Connect to MongoDB
const uri = MONGO_URI;                                                              // MongoDB connection string

mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB');
        initializeDatabase();                                                       // Initialize database with predefined data
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

// Server Initialization
const app = new express();                                                          // Create an Express application instance
const PORT = PORT_NUM;                                                              // Define the server port

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Monitor MongoDB connection status
const db = mongoose.connection;

db.on("open", () => {
    console.log("Database connection is successful");
});

db.on("error", () => {
    console.log("Database connection is not successful");
});

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to verify JWT token for protected routes
const authenticateUser = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];                      // Extract token from Authorization header

    if (!token) {
        return res.status(403).json({ message: "Token is required" });              // Return error if token is missing
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {                                 // Verify token using the secret key
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });   // Return error if token is invalid
        }
        req.user = user;                                                            // Attach decoded user data to request object
        next();                                                                     // Proceed to the next middleware or route handler
    });
};


userRoutes(app);                                                                    // Register user-related routes

productRoutes(app, authenticateUser);                                               // Register product-related routes, protected by JWT authentication middleware

cartRoutes(app, authenticateUser);                                                  // Register cart-related routes, protected by JWT authentication middleware