import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

async function createUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas.");

    const username = "dreamvisimmigove";
    const password = "dreamvisimmigove";

    // Check if user exists
    let user = await User.findOne({ username });
    
    if (user) {
      console.log(`User ${username} already exists. Updating password and making admin...`);
      user.password = password;
      user.role = 'admin';
      await user.save();
      console.log("User updated successfully!");
    } else {
      console.log(`Creating new user ${username}...`);
      user = new User({
        username,
        password,
        role: 'admin'
      });
      await user.save();
      console.log("User created successfully!");
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

createUser();
