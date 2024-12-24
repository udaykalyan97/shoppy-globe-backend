import User from "../Model/user.model.js";
import jwt from "jsonwebtoken";   
import { JWT_SECRET } from "../Constants.js";

export const userRegister = async (req, res) => {
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
};

export const userLogin = async (req, res) => {
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
        const token = jwt.sign({ userId: user._id, userName: user.userName }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to authenticate user" });
    }
};