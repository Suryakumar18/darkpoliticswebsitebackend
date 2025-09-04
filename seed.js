// seed.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// MongoDB connection string
const MONGO_URI = "mongodb+srv://darkstate49:Hardwork%4018@cluster0.4sq1ggj.mongodb.net/darkpolitics?retryWrites=true&w=majority&appName=Cluster0";

// Sample users
const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123"
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "mypassword"
  }
];

// Seed function
const seedUsers = async () => {
  try {
    // Connect to DB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected...");

    // Clear existing users (optional)
    await User.deleteMany();
    console.log("🗑️ Old users removed");

    // Hash passwords before saving
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    // Insert users
    await User.insertMany(hashedUsers);
    console.log("🌱 Users seeded successfully!");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedUsers();
