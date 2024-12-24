import Products from "../Model/products.model.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find(); // Fetch all products from the database
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

export const getProductById = async (req, res) => {
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
};