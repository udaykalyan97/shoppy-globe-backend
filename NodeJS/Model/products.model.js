import mongoose from "mongoose";
import { reviewSchema } from "./review.model.js";
import { dimensionSchema } from "./dimension.model.js";
import { metaSchema } from "./meta.model.js";

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

export default Products;