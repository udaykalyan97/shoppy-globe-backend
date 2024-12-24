import express from "express";
import mongoose from "mongoose";
import { initialDB } from "./initialDB.js";
import jwt from "jsonwebtoken";

/**
 * Database Initialization
 */

// Define the review schema
const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    reviewerName: { type: String, required: true },
    reviewerEmail: { type: String, required: true }
});

// Define the dimensions schema
const dimensionSchema = new mongoose.Schema({
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true }
});

// Define the meta schema
const metaSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    barcode: { type: String },
    qrCode: { type: String }
});

// Define the product schema
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    stock: { type: Number, required: true },
    tags: { type: [String], default: [] },
    brand: { type: String },
    sku: { type: String, required: true },
    weight: { type: Number, required: true },
    dimensions: { type: dimensionSchema, required: true },
    warrantyInformation: { type: String },
    shippingInformation: { type: String },
    availabilityStatus: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], required: true },
    reviews: { type: [reviewSchema], default: [] },
    returnPolicy: { type: String },
    minimumOrderQuantity: { type: Number, required: true },
    meta: { type: metaSchema, required: true },
    images: { type: [String], default: [] },
    thumbnail: { type: String, required: true }
});

// Create the Product model
const Products = mongoose.model('Products', productSchema);


/**
 * Cart Schema
 */

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const cartSchema = new mongoose.Schema({
    items: [cartItemSchema],
});

const Cart = mongoose.model('Cart', cartSchema);



// User schema and model
const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true }  // Storing plain password as per your request (Note: In real apps, hash passwords!)
});

const User = mongoose.model("User", userSchema);



// Connect to MongoDB
const uri = 'mongodb://localhost:27017/shoppy-globe'; 

mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
    // initializeDatabase();
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Insert products into the database
async function initializeDatabase() {
    const productData = initialDB["products"];
    try {
        await Products.insertMany(productData);
        console.log('Database initialized with products');
    } catch (error) {
        console.error('Error initializing database', error);
    }
}


/**
 * Server Initialization
 */


const app = new express();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const db = mongoose.connection;

db.on("open", () => {
    console.log("Database connection is successful");
});

db.on("error", () => {
    console.log("Database connection is not successful");
});


// Middleware to parse JSON request body
app.use(express.json());


// Middleware to verify JWT token
const authenticateUser = (req, res, next) => {

    const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header

    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }

    jwt.verify(token, "secretKey", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user; // Attach decoded user data to request
        next();
    });
};

// Protected /products route with JWT token verification
app.get('/products', authenticateUser, async (req, res) => {
    try {
        const products = await Products.find(); // Fetch all products from the database
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

// Fetch a particular product by ID
app.get("/products/:id", authenticateUser, async (req, res) => {
    const productId = req.params.id;                                        // Get the product ID from the URL parameter

    try {
        const product = await Products.findById(productId);                 // Search for the product by ID

        if (!product) {
            return res.status(404).json({ message: "Product not found" });  // If no product found, return 404
        }

        res.status(200).json(product);                                      // Return the product details
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
});


app.post("/cart", authenticateUser, async (req, res) => {
    const { productId, quantity } = req.body; // Get productId and quantity from request body

    if (!productId || !quantity) {
        return res.status(400).json({ message: "Missing required fields: productId, quantity" });
    }

    try {
        // Find the existing cart or create a new one
        let cart = await Cart.findOne();

        if (!cart) {
            // If no cart exists, create a new one
            cart = new Cart({ items: [{ productId, quantity }] });
        } else {
            // If the cart exists, check if the product is already in the cart
            const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (existingItemIndex === -1) {
                // If product isn't in the cart, add it
                cart.items.push({ productId, quantity });
            } else {
                // If product is already in the cart, update the quantity
                cart.items[existingItemIndex].quantity += quantity;
            }
        }

        // Save or update the cart in the database
        await cart.save();

        res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Failed to add product to cart' });
    }
});


// PUT API to update the quantity of a product in the cart
app.put("/cart", authenticateUser, async (req, res) => {
    const { productId, quantity } = req.body;  // Destructure productId and quantity from request body

    if (!productId || !quantity) {
        return res.status(400).json({ message: "Missing required fields: productId, quantity" });
    }

    try {
        // Find the existing cart (or create one if not found)
        let cart = await Cart.findOne();

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the product in the cart
        const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Update the quantity of the product
        cart.items[productIndex].quantity = quantity;

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: "Product quantity updated", cart });
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        res.status(500).json({ message: "Failed to update product quantity" });
    }
});


// DELETE API to remove a product from the cart
app.delete("/cart", authenticateUser, async (req, res) => {
    const { productId } = req.body;  // Destructure productId from the request body

    if (!productId) {
        return res.status(400).json({ message: "ProductId is required" });
    }

    try {
        // Find the cart (assuming only one cart exists for now)
        let cart = await Cart.findOne();

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the product in the cart
        const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Remove the product from the cart
        cart.items.splice(productIndex, 1);  // Splice removes the product from the array

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ message: "Failed to remove product from cart" });
    }
});


// POST /register - Register a new user
app.post("/register", async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const newUser = new User({ userName, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to register user" });
    }
});

// POST /login - Authenticate user and return JWT token
app.post("/login", async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find the user by userName
        const user = await User.findOne({ userName });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid Username or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, userName: user.userName }, "secretKey", { expiresIn: "15m" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to authenticate user" });
    }
});
