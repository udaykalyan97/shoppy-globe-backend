import { addToCart, updateCart, deleteCartItem } from "../Controller/cart.controller.js";

export function cartRoutes(app, authenticateUser){
    app.post("/cart", authenticateUser, addToCart);
    app.put("/cart", authenticateUser, updateCart);  // PUT API to update the quantity of a product in the cart
    app.delete("/cart", authenticateUser, deleteCartItem);
}