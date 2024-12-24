import mongoose from "mongoose";

// Define the dimensions schema
export const dimensionSchema = new mongoose.Schema({
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true }
});