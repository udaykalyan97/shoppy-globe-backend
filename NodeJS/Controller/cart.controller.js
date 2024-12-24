import Cart from "../Model/cart.model.js";

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;                                                                   // Get productId and quantity from request body

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
            const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);    // If the cart exists, check if the product is already in the cart

            if (existingItemIndex === -1) {            
                cart.items.push({ productId, quantity });                                                       // If product isn't in the cart, add it
            } else {
                cart.items[existingItemIndex].quantity += quantity;                                             // If product is already in the cart, update the quantity
            }
        }
 
        await cart.save();                                                                                      // Save or update the cart in the database

        res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Failed to add product to cart' });
    }
};


export const updateCart = async (req, res) => {
    const { productId, quantity } = req.body;                                                                   // Destructure productId and quantity from request body

    if (!productId || !quantity) {
        return res.status(400).json({ message: "Missing required fields: productId, quantity" });
    }

    try {
        let cart = await Cart.findOne();                                                                        // Find the existing cart (or create one if not found)

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);             // Find the product in the cart

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        cart.items[productIndex].quantity = quantity;                                                           // Update the quantity of the product
  
        await cart.save();                                                                                      // Save the updated cart

        res.status(200).json({ message: "Product quantity updated", cart });
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        res.status(500).json({ message: "Failed to update product quantity" });
    }
};


export const deleteCartItem = async (req, res) => {
    const { productId } = req.body;                                                                             // Destructure productId from the request body

    if (!productId) {
        return res.status(400).json({ message: "ProductId is required" });
    }

    try {   
        let cart = await Cart.findOne();                                                                        // Find the cart 

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);             // Find the product in the cart

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
  
        cart.items.splice(productIndex, 1);                                                                     // Remove the product from the cart
        
        await cart.save();                                                                                      // Save the updated cart

        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ message: "Failed to remove product from cart" });
    }
};
