import mongoose from "mongoose";
import { cartItemSchema } from "./cartItem.model.js";

const cartSchema = new mongoose.Schema({
    items: [cartItemSchema],
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;