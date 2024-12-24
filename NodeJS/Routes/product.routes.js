import { getAllProducts, getProductById } from "../Controller/products.controller.js";

export function productRoutes(app, authenticateUser){
    app.get('/products', authenticateUser, getAllProducts);
    app.get("/products/:id", authenticateUser, getProductById);
}