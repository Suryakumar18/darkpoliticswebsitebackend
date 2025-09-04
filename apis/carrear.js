const express = require("express");
const { ExpertiseArea, CareerPath, Benefit } = require("../models/Carrear");

const router = express.Router();

// Helper function to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all career data (combined endpoint)
router.get("/", asyncHandler(async (req, res) => {
  try {
    const [expertiseAreas, careerPaths, benefits] = await Promise.all([
      ExpertiseArea.find().sort({ createdAt: -1 }),
      CareerPath.find().sort({ createdAt: -1 }),
      Benefit.find().sort({ createdAt: -1 })
    ]);

    res.json({
      success: true,
      data: {
        expertiseAreas,
        careerPaths,
        benefits
      }
    });
  } catch (error) {
    console.error("Error fetching career data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch career data",
      error: error.message
    });
  }
}));

// ==================== EXPERTISE AREAS ====================

// Get all expertise areas
router.get("/expertise", asyncHandler(async (req, res) => {
  const expertiseAreas = await ExpertiseArea.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    data: expertiseAreas
  });
}));

// Get single expertise area
router.get("/expertise/:id", asyncHandler(async (req, res) => {
  const expertiseArea = await ExpertiseArea.findById(req.params.id);
  if (!expertiseArea) {
    return res.status(404).json({
      success: false,
      message: "Expertise area not found"
    });
  }
  res.json({
    success: true,
    data: expertiseArea
  });
}));

// Create new expertise area
router.post("/expertise", asyncHandler(async (req, res) => {
  const { title, description, details, color, icon } = req.body;

  // Validation
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required"
    });
  }

  // Filter out empty details
  const filteredDetails = details ? details.filter(detail => detail.trim() !== '') : [];

  const expertiseArea = new ExpertiseArea({
    title: title.trim(),
    description: description.trim(),
    details: filteredDetails,
    color: color || 'from-orange-500 to-red-500',
    icon: icon || 'MapPin'
  });

  await expertiseArea.save();

  // Return all expertise areas after creation
  const allExpertiseAreas = await ExpertiseArea.find().sort({ createdAt: -1 });
  
  res.status(201).json({
    success: true,
    message: "Expertise area created successfully",
    data: allExpertiseAreas
  });
}));

// Update expertise area
router.put("/expertise/:id", asyncHandler(async (req, res) => {
  const { title, description, details, color, icon } = req.body;

  // Validation
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required"
    });
  }

  // Filter out empty details
  const filteredDetails = details ? details.filter(detail => detail.trim() !== '') : [];

  const expertiseArea = await ExpertiseArea.findByIdAndUpdate(
    req.params.id,
    {
      title: title.trim(),
      description: description.trim(),
      details: filteredDetails,
      color: color || 'from-orange-500 to-red-500',
      icon: icon || 'MapPin'
    },
    { new: true, runValidators: true }
  );

  if (!expertiseArea) {
    return res.status(404).json({
      success: false,
      message: "Expertise area not found"
    });
  }

  // Return all expertise areas after update
  const allExpertiseAreas = await ExpertiseArea.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    message: "Expertise area updated successfully",
    data: allExpertiseAreas
  });
}));

// Delete expertise area
router.delete("/expertise/:id", asyncHandler(async (req, res) => {
  const expertiseArea = await ExpertiseArea.findByIdAndDelete(req.params.id);
  
  if (!expertiseArea) {
    return res.status(404).json({
      success: false,
      message: "Expertise area not found"
    });
  }

  // Return all expertise areas after deletion
  const allExpertiseAreas = await ExpertiseArea.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    message: "Expertise area deleted successfully",
    data: allExpertiseAreas
  });
}));

// ==================== CAREER PATHS ====================

// Get all career paths
router.get("/career-paths", asyncHandler(async (req, res) => {
  const careerPaths = await CareerPath.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    data: careerPaths
  });
}));

// Get single career path
router.get("/career-paths/:id", asyncHandler(async (req, res) => {
  const careerPath = await CareerPath.findById(req.params.id);
  if (!careerPath) {
    return res.status(404).json({
      success: false,
      message: "Career path not found"
    });
  }
  res.json({
    success: true,
    data: careerPath
  });
}));

// Create new career path
router.post("/career-paths", asyncHandler(async (req, res) => {
  const { title, level, description, skills, growth, icon, shape } = req.body;

  // Validation
  if (!title || !level || !description) {
    return res.status(400).json({
      success: false,
      message: "Title, level, and description are required"
    });
  }

  // Filter out empty skills
  const filteredSkills = skills ? skills.filter(skill => skill.trim() !== '') : [];

  const careerPath = new CareerPath({
    title: title.trim(),
    level: level.trim(),
    description: description.trim(),
    skills: filteredSkills,
    growth: growth ? growth.trim() : '',
    icon: icon || 'BarChart3',
    shape: shape || 'hexagon'
  });

  await careerPath.save();

  // Return all career paths after creation
  const allCareerPaths = await CareerPath.find().sort({ createdAt: -1 });
  
  res.status(201).json({
    success: true,
    message: "Career path created successfully",
    data: allCareerPaths
  });
}));

// Update career path
router.put("/career-paths/:id", asyncHandler(async (req, res) => {
  const { title, level, description, skills, growth, icon, shape } = req.body;

  // Validation
  if (!title || !level || !description) {
    return res.status(400).json({
      success: false,
      message: "Title, level, and description are required"
    });
  }

  // Filter out empty skills
  const filteredSkills = skills ? skills.filter(skill => skill.trim() !== '') : [];

  const careerPath = await CareerPath.findByIdAndUpdate(
    req.params.id,
    {
      title: title.trim(),
      level: level.trim(),
      description: description.trim(),
      skills: filteredSkills,
      growth: growth ? growth.trim() : '',
      icon: icon || 'BarChart3',
      shape: shape || 'hexagon'
    },
    { new: true, runValidators: true }
  );

  if (!careerPath) {
    return res.status(404).json({
      success: false,
      message: "Career path not found"
    });
  }

  // Return all career paths after update
  const allCareerPaths = await CareerPath.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    message: "Career path updated successfully",
    data: allCareerPaths
  });
}));

// Delete career path
router.delete("/career-paths/:id", asyncHandler(async (req, res) => {
  const careerPath = await CareerPath.findByIdAndDelete(req.params.id);
  
  if (!careerPath) {
    return res.status(404).json({
      success: false,
      message: "Career path not found"
    });
  }

  // Return all career paths after deletion
  const allCareerPaths = await CareerPath.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    message: "Career path deleted successfully",
    data: allCareerPaths
  });
}));

// ==================== BENEFITS ====================

// Get all benefits
router.get("/benefits", asyncHandler(async (req, res) => {
  const benefits = await Benefit.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    data: benefits
  });
}));

// Get single benefit
router.get("/benefits/:id", asyncHandler(async (req, res) => {
  const benefit = await Benefit.findById(req.params.id);
  if (!benefit) {
    return res.status(404).json({
      success: false,
      message: "Benefit not found"
    });
  }
  res.json({
    success: true,
    data: benefit
  });
}));

// Create new benefit
router.post("/benefits", asyncHandler(async (req, res) => {
  const { title, description, icon, accent } = req.body;

  // Validation
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required"
    });
  }

  const benefit = new Benefit({
    title: title.trim(),
    description: description.trim(),
    icon: icon || 'Award',
    accent: accent || 'orange'
  });

  await benefit.save();

  // Return all benefits after creation
  const allBenefits = await Benefit.find().sort({ createdAt: -1 });
  
  res.status(201).json({
    success: true,
    message: "Benefit created successfully",
    data: allBenefits
  });
}));

// Update benefit
router.put("/benefits/:id", asyncHandler(async (req, res) => {
  const { title, description, icon, accent } = req.body;

  // Validation
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required"
    });
  }

  const benefit = await Benefit.findByIdAndUpdate(
    req.params.id,
    {
      title: title.trim(),
      description: description.trim(),
      icon: icon || 'Award',
      accent: accent || 'orange'
    },
    { new: true, runValidators: true }
  );

  if (!benefit) {
    return res.status(404).json({
      success: false,
      message: "Benefit not found"
    });
  }

  // Return all benefits after update
  const allBenefits = await Benefit.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    message: "Benefit updated successfully",
    data: allBenefits
  });
}));

// Delete benefit
router.delete("/benefits/:id", asyncHandler(async (req, res) => {
  const benefit = await Benefit.findByIdAndDelete(req.params.id);
  
  if (!benefit) {
    return res.status(404).json({
      success: false,
      message: "Benefit not found"
    });
  }

  // Return all benefits after deletion
  const allBenefits = await Benefit.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    message: "Benefit deleted successfully",
    data: allBenefits
  });
}));

// Error handling middleware
router.use((error, req, res, next) => {
  console.error("Career API Error:", error);
  
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format"
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

module.exports = router;