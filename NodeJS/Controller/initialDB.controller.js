import { initialDB } from "../initialDB.js";
import Products from "../Model/products.model.js";


// Insert products into the database
const initializeDatabase = async function() {
    const productData = initialDB["products"];

    try {
        // Check if there are already products in the database
        const existingCount = await Products.countDocuments();

        if (existingCount > 0) {
            console.log("Database already initialized. Skipping insertion.");
            return;
        }

        // Insert documents if the database is empty
        await Products.insertMany(productData);
        console.log("Database initialized with products");
    } catch (error) {
        console.error("Error initializing database", error);
    }
};

export default initializeDatabase;