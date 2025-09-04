const mongoose = require("mongoose");

// Expertise Area Schema
const expertiseAreaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  details: [{
    type: String,
    trim: true
  }],
  color: {
    type: String,
    default: 'from-orange-500 to-red-500',
    trim: true
  },
  icon: {
    type: String,
    default: 'MapPin',
    trim: true
  }
}, {
  timestamps: true
});

// Career Path Schema
const careerPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Entry to Mid-Level', 'Mid to Senior Level', 'Senior Level', 'Specialized Role'],
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  growth: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: 'BarChart3',
    trim: true
  },
  shape: {
    type: String,
    default: 'hexagon',
    enum: ['hexagon', 'diamond', 'circle', 'octagon'],
    trim: true
  }
}, {
  timestamps: true
});

// Benefit Schema
const benefitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'Award',
    trim: true
  },
  accent: {
    type: String,
    default: 'orange',
    enum: ['orange', 'blue', 'purple', 'green', 'red', 'cyan'],
    trim: true
  }
}, {
  timestamps: true
});

// Main Career Schema (optional - if you want to group everything under one document)
const careerSchema = new mongoose.Schema({
  expertiseAreas: [expertiseAreaSchema],
  careerPaths: [careerPathSchema],
  benefits: [benefitSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create models
const ExpertiseArea = mongoose.model("ExpertiseArea", expertiseAreaSchema);
const CareerPath = mongoose.model("CareerPath", careerPathSchema);
const Benefit = mongoose.model("Benefit", benefitSchema);
const Career = mongoose.model("Career", careerSchema);

module.exports = {
  ExpertiseArea,
  CareerPath,
  Benefit,
  Career
};