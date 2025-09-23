
//---------- Updated server.js ----------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./apis/auth");
const homepageRoutes = require("./apis/homepage");
const aboutusRoutes = require("./apis/aboutus");
const servicesRoutes = require("./apis/services");
const servicesContentRoutes = require("./apis/servicesContent");
const careerRoutes = require("./apis/carrear");
const ourImpactRoutes = require("./apis/ourImpact");
const contactRoutes = require("./apis/contact");

const app = express();
const PORT = 5000; // Render sets this
const BACKEND_URL = "https://darkpoliticswebsitebackend.onrender.com"; // ✅ Hardcoded backend URL

// Middleware
app.use(express.json({ extended: false }));
app.use(
  cors({
    origin: [
      "https://darkpoliticalconsultancy.com","https://68d2655c9f1f1f3efc81865d--darkpoliticss.netlify.app",
      "https://68d2655c9f1f1f3efc81865d--darkpoliticss.netlify.app/login"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["Content-Length", "Authorization"],
  })
);

// MongoDB connection
const MONGO_URI =
  "mongodb+srv://darkstate49:Hardwork%4018@cluster0.4sq1ggj.mongodb.net/darkpolitics?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/aboutus", aboutusRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/services-content", servicesContentRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/our-impact", ourImpactRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running properly",
    backendURL: BACKEND_URL, // ✅ show backend url
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${BACKEND_URL} (port ${PORT})`);
});



//---------- Usage Examples ----------

// Frontend API calls examples:

// 1. Get all contact data (for admin)
// GET /api/contact

// 2. Get public contact data (for public website)
// GET /api/contact/public

// 3. Add new contact information
// POST /api/contact/info
// Body: { "type": "email", "title": "Email Us", "info": "contact@example.com", "subInfo": "info@example.com", "icon": "Mail" }

// 4. Update contact information
// PUT /api/contact/info/:id
// Body: { "title": "Updated Title", "info": "updated@example.com" }

// 5. Toggle contact info active status
// PATCH /api/contact/info/:id/toggle
// Body: { "active": true }

// 6. Delete contact information
// DELETE /api/contact/info/:id

// 7. Update office details
// PUT /api/contact/office
// Body: { "address": "New Address", "description": "New Description", "mapUrl": "New Map URL" }

// 8. Add social link
// POST /api/contact/social
// Body: { "platform": "Facebook", "url": "https://facebook.com/company" }

// 9. Update social link
// PUT /api/contact/social/:id
// Body: { "platform": "Twitter", "url": "https://twitter.com/company" }

// 10. Toggle social link active status
// PATCH /api/contact/social/:id/toggle

// 11. Delete social link

// DELETE /api/contact/social/:id


