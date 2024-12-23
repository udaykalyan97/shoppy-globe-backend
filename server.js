import express from "express";
import mongoose from "mongoose";
import { initialDB } from "./initialDB.js";


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

// Connect to MongoDB
const uri = 'mongodb://localhost:27017/shoppy-globe'; 

mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
    initializeDatabase();
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Insert products into the database
async function initializeDatabase() {
    const productData = initialDB["products"];
    try {
        await Products.insertMany(productData);
        console.log('Database initialized with products');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error initializing database', error);
        mongoose.connection.close();
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

mongoose.connect(uri);

const db = mongoose.connection;

db.on("open", () => {
    console.log("Database connection is successful");
});

db.on("error", () => {
    console.log("Database connection is not successful");
});


app.get('/products', async (req, res) => {
    try {
        const products = await Products.find(); // Fetch all products from the database
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});