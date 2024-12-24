import mongoose from "mongoose";

// User schema and model
const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true }  // Storing plain password as per your request (Note: In real apps, hash passwords!)
});

const User = mongoose.model("User", userSchema);

export default User;