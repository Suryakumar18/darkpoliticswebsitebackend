const express = require("express");
const router = express.Router();
const OurImpact = require("../models/ourImpact");

// Initialize default Our Impact data if it doesn't exist
const initializeOurImpactData = async () => {
  try {
    const existingData = await OurImpact.findOne();
    if (!existingData) {
      const defaultData = new OurImpact({
        mainHeading: "Transforming Indian Politics",
        mainDescription: "From grassroots movements to high-stakes elections, we've consistently delivered exceptional results that reshape the political landscape across India.",
        overviewDescription: "From grassroots movements to high-stakes elections, we've consistently delivered exceptional results that reshape the political landscape across India. Our data-driven strategies and deep regional understanding have transformed campaigns and empowered leaders to connect authentically with voters.",
        impactStats: [
          {
            icon: "Trophy",
            number: "95%",
            label: "Election Success Rate",
            description: "Campaigns we've managed to victory",
            color: "from-yellow-500 to-orange-500"
          },
          {
            icon: "Users",
            number: "2.5M+",
            label: "Voters Reached",
            description: "Citizens engaged across India",
            color: "from-blue-500 to-cyan-500"
          },
          {
            icon: "MapPin",
            number: "28",
            label: "States Covered",
            description: "Pan-India political presence",
            color: "from-green-500 to-teal-500"
          },
          {
            icon: "BarChart3",
            number: "180+",
            label: "Campaigns Managed",
            description: "From grassroots to high-profile elections",
            color: "from-purple-500 to-pink-500"
          }
        ],
        successStories: [
          {
            title: "State Assembly Victory",
            location: "Tamil Nadu",
            result: "Won by 67% margin",
            year: "2024",
            description: "Transformed a trailing candidate into a decisive winner through targeted voter outreach and strategic messaging.",
            metrics: ["45% voter turnout increase", "300+ volunteers mobilized", "2M+ social media impressions"],
            image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=300&h=200&fit=crop"
          },
          {
            title: "Municipal Corporation",
            location: "Karnataka",
            result: "Swept 85% seats",
            year: "2024",
            description: "Complete transformation of local governance through grassroots mobilization and community engagement.",
            metrics: ["12 out of 14 wards won", "60% youth voter engagement", "100% digital coverage"],
            image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300&h=200&fit=crop"
          }
        ],
        keyAchievements: [
          {
            category: "Digital Innovation",
            achievements: [
              "First to implement AI-driven voter sentiment analysis in South India",
              "Revolutionary micro-targeting strategies with 94% accuracy",
              "Real-time crisis management protocols saving 15+ campaigns"
            ]
          },
          {
            category: "Ground Operations",
            achievements: [
              "Trained 5000+ grassroots workers across multiple states",
              "Established 200+ ground intelligence networks",
              "Mobilized communities in rural and urban constituencies"
            ]
          }
        ],
        clientTestimonials: [
          {
            name: "Hon. Rajesh Kumar",
            position: "MLA, Tamil Nadu",
            quote: "Darkstate didn't just manage my campaign - they transformed my entire political approach. Their data-driven strategies and ground intelligence were game-changers.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
          },
          {
            name: "Dr. Priya Sharma",
            position: "Mayor, Bengaluru",
            quote: "The crisis management expertise of Darkstate saved my political career. Their 24/7 monitoring and rapid response team is unmatched in the industry.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=60&h=60&fit=crop&crop=face"
          }
        ],
        impactAreas: [
          {
            icon: "Globe",
            title: "National Influence",
            description: "Shaping political discourse across India with innovative strategies and deep regional understanding",
            stats: "28 States, 180+ Constituencies"
          },
          {
            icon: "Users",
            title: "Voter Empowerment",
            description: "Connecting leaders with citizens through authentic messaging and grassroots mobilization",
            stats: "2.5M+ Citizens Engaged"
          },
          {
            icon: "Shield",
            title: "Electoral Integrity",
            description: "Maintaining highest standards of compliance while delivering exceptional campaign results",
            stats: "100% Clean Campaigns"
          },
          {
            icon: "Zap",
            title: "Digital Revolution",
            description: "Pioneering technology-driven political consulting in the Indian electoral landscape",
            stats: "95% Success Rate"
          }
        ]
      });
      await defaultData.save();
      console.log("✅ Default Our Impact data initialized");
    }
  } catch (error) {
    console.error("❌ Error initializing Our Impact data:", error);
  }
};

// Get all Our Impact data
router.get("/", async (req, res) => {
  try {
    const ourImpactData = await OurImpact.findOne();
    
    if (!ourImpactData) {
      // Initialize data if not found
      await initializeOurImpactData();
      const newData = await OurImpact.findOne();
      return res.json({
        success: true,
        message: "Our Impact data retrieved successfully",
        data: newData
      });
    }
    
    res.json({
      success: true,
      message: "Our Impact data retrieved successfully",
      data: ourImpactData
    });
  } catch (error) {
    console.error("Error fetching Our Impact data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Our Impact data",
      error: error.message
    });
  }
});

// Update main content
router.put("/content", async (req, res) => {
  try {
    const { mainHeading, mainDescription, overviewDescription } = req.body;
    
    const ourImpactData = await OurImpact.findOneAndUpdate(
      {},
      { mainHeading, mainDescription, overviewDescription },
      { new: true, upsert: true }
    );
    
    res.json({
      success: true,
      message: "Content updated successfully",
      data: ourImpactData
    });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update content",
      error: error.message
    });
  }
});

// Add a new impact statistic
router.post("/stats", async (req, res) => {
  try {
    const { icon, number, label, description, color } = req.body;
    
    const ourImpactData = await OurImpact.findOne();
    
    if (!ourImpactData) {
      await initializeOurImpactData();
      const newData = await OurImpact.findOne();
      newData.impactStats.push({ icon, number, label, description, color });
      await newData.save();
      
      return res.json({
        success: true,
        message: "Statistic added successfully",
        data: newData.impactStats
      });
    }
    
    ourImpactData.impactStats.push({ icon, number, label, description, color });
    await ourImpactData.save();
    
    res.json({
      success: true,
      message: "Statistic added successfully",
      data: ourImpactData.impactStats
    });
  } catch (error) {
    console.error("Error adding statistic:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add statistic",
      error: error.message
    });
  }
});

// Delete an impact statistic
router.delete("/stats/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const ourImpactData = await OurImpact.findOne();
    
    if (!ourImpactData) {
      return res.status(404).json({
        success: false,
        message: "Our Impact data not found"
      });
    }
    
    ourImpactData.impactStats = ourImpactData.impactStats.filter(
      stat => stat._id.toString() !== id
    );
    
    await ourImpactData.save();
    
    res.json({
      success: true,
      message: "Statistic deleted successfully",
      data: ourImpactData.impactStats
    });
  } catch (error) {
    console.error("Error deleting statistic:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete statistic",
      error: error.message
    });
  }
});

// Add a new success story
router.post("/stories", async (req, res) => {
  try {
    const { title, location, result, year, description, metrics, image } = req.body;
    
    const ourImpactData = await OurImpact.findOne();
    
    if (!ourImpactData) {
      await initializeOurImpactData();
      const newData = await OurImpact.findOne();
      newData.successStories.push({ title, location, result, year, description, metrics, image });
      await newData.save();
      
      return res.json({
        success: true,
        message: "Success story added successfully",
        data: newData.successStories
      });
    }
    
    ourImpactData.successStories.push({ title, location, result, year, description, metrics, image });
    await ourImpactData.save();
    
    res.json({
      success: true,
      message: "Success story added successfully",
      data: ourImpactData.successStories
    });
  } catch (error) {
    console.error("Error adding success story:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add success story",
      error: error.message
    });
  }
});

// Delete a success story
router.delete("/stories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const ourImpactData = await OurImpact.findOne();
    
    if (!ourImpactData) {
      return res.status(404).json({
        success: false,
        message: "Our Impact data not found"
      });
    }
    
    ourImpactData.successStories = ourImpactData.successStories.filter(
      story => story._id.toString() !== id
    );
    
    await ourImpactData.save();
    
    res.json({
      success: true,
      message: "Success story deleted successfully",
      data: ourImpactData.successStories
    });
  } catch (error) {
    console.error("Error deleting success story:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete success story",
      error: error.message
    });
  }
});

// Add a new key achievement category
router.post("/achievements", async (req, res) => {
  try {
    const { category, achievements } = req.body;
    
    const ourImpactData = await OurImpact.findOne();
    
    if (!ourImpactData) {
      await initializeOurImpactData();
      const newData = await OurImpact.findOne();
      newData.keyAchievements.push({ category, achievements });
      await newData.save();
      
      return res.json({
        success: true,
        message: "Achievement category added successfully",
        data: newData.keyAchievements
      });
    }
    
    ourImpactData.keyAchievements.push({ category, achievements });
    await ourImpactData.save();
    
    res.json({
      success: true,
      message: "Achievement category added successfully",
      data: ourImpactData.keyAchievements
    });
  } catch (error) {
    console.error("Error adding achievement category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add achievement category",
      error: error.message
    });
  }
});

// Delete a key achievement category
router.delete("/achievements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const ourImpactData = await OurImpact.findOne();
    
    if (!ourImpactData) {
      return res.status(404).json({
        success: false,
        message: "Our Impact data not found"
      });
    }
    
    ourImpactData.keyAchievements = ourImpactData.keyAchievements.filter(
      achievement => achievement._id.toString() !== id
    );
    
    await ourImpactData.save();
    
    res.json({
      success: true,
      message: "Achievement category deleted successfully",
      data: ourImpactData.keyAchievements
    });
  } catch (error) {
    console.error("Error deleting achievement category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete achievement category",
      error: error.message
    });
  }
});

// Add a new testimonial
router.post("/testimonials", async (req, res) => {
  try {
    const { name, position, quote, rating, image } = req.body;
    
    const ourImpactData = await OurImpact.findOne();
    
    if (!ourImpactData) {
      await initializeOurImpactData();
      const newData = await OurImpact.findOne();
      newData.clientTestimonials.push({ name, position, quote, rating, image });
      await newData.save();
      
      return res.json({
        success: true,
        message: "Testimonial added successfully",
        data: newData.clientTestimonials
      });
    }
    
    ourImpactData.clientTestimonials.push({ name, position, quote, rating, image });
    await ourImpactData.save();
    
    res.json({
      success: true,
      message: "Testimonial added successfully",
      data: ourImpactData.clientTestimonials
    });
  } catch (error) {
    console.error("Error adding testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add testimonial",
      error: error.message
    });
  }
});

// Delete a testimonial
router.delete("/testimonials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const ourImpactData = await OurImpact.findOne();
    
    if (!ourImpactData) {
      return res.status(404).json({
        success: false,
        message: "Our Impact data not found"
      });
    }
    
    ourImpactData.clientTestimonials = ourImpactData.clientTestimonials.filter(
      testimonial => testimonial._id.toString() !== id
    );
    
    await ourImpactData.save();
    
    res.json({
      success: true,
      message: "Testimonial deleted successfully",
      data: ourImpactData.clientTestimonials
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
      error: error.message
    });
  }
});

// Add a new impact area
router.post("/impact-areas", async (req, res) => {
  try {
    const { icon, title, description, stats } = req.body;
    
    const ourImpactData = await OurImpact.findOne();
    
    if (!ourImpactData) {
      await initializeOurImpactData();
      const newData = await OurImpact.findOne();
      newData.impactAreas.push({ icon, title, description, stats });
      await newData.save();
      
      return res.json({
        success: true,
        message: "Impact area added successfully",
        data: newData.impactAreas
      });
    }
    
    ourImpactData.impactAreas.push({ icon, title, description, stats });
    await ourImpactData.save();
    
    res.json({
      success: true,
      message: "Impact area added successfully",
      data: ourImpactData.impactAreas
    });
  } catch (error) {
    console.error("Error adding impact area:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add impact area",
      error: error.message
    });
  }
});

// Delete an impact area
router.delete("/impact-areas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const ourImpactData = await OurImpact.findOne();
    
    if (!ourImpactData) {
      return res.status(404).json({
        success: false,
        message: "Our Impact data not found"
      });
    }
    
    ourImpactData.impactAreas = ourImpactData.impactAreas.filter(
      area => area._id.toString() !== id
    );
    
    await ourImpactData.save();
    
    res.json({
      success: true,
      message: "Impact area deleted successfully",
      data: ourImpactData.impactAreas
    });
  } catch (error) {
    console.error("Error deleting impact area:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete impact area",
      error: error.message
    });
  }
});

module.exports = router;