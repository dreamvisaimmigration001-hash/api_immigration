import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = "mongodb://dramanjy0770:I73Hdxh10ixsOQmO@ac-ixyc16l-shard-00-00.xgbmmfb.mongodb.net:27017,ac-ixyc16l-shard-00-01.xgbmmfb.mongodb.net:27017,ac-ixyc16l-shard-00-02.xgbmmfb.mongodb.net:27017/immigration?ssl=true&replicaSet=atlas-n6ge2a-shard-0&authSource=admin&appName=Cluster0";

async function createUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas.");

    const username = "abc@321";
    const password = "man@1234";

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
