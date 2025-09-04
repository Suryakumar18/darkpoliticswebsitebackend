const mongoose = require("mongoose");

const impactStatSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
    enum: ["Trophy", "Users", "Target", "Award", "BarChart3", "MapPin", "Globe", "Shield", "Zap", "TrendingUp"]
  },
  number: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true,
    default: "from-yellow-500 to-orange-500"
  }
}, { timestamps: true });

const successStorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  metrics: [{
    type: String,
    required: true
  }],
  image: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const keyAchievementSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  achievements: [{
    type: String,
    required: true
  }]
}, { timestamps: true });

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  quote: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  image: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const impactAreaSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
    enum: ["Globe", "Users", "Shield", "Zap", "Target", "Award"]
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stats: {
    type: String,
    required: true
  }
}, { timestamps: true });

const ourImpactSchema = new mongoose.Schema({
  mainHeading: {
    type: String,
    default: "Transforming Indian Politics"
  },
  mainDescription: {
    type: String,
    default: "From grassroots movements to high-stakes elections, we've consistently delivered exceptional results that reshape the political landscape across India."
  },
  overviewDescription: {
    type: String,
    default: "From grassroots movements to high-stakes elections, we've consistently delivered exceptional results that reshape the political landscape across India. Our data-driven strategies and deep regional understanding have transformed campaigns and empowered leaders to connect authentically with voters."
  },
  impactStats: [impactStatSchema],
  successStories: [successStorySchema],
  keyAchievements: [keyAchievementSchema],
  clientTestimonials: [testimonialSchema],
  impactAreas: [impactAreaSchema]
}, { timestamps: true });

// Create or get the existing model
module.exports = mongoose.models.OurImpact || mongoose.model("OurImpact", ourImpactSchema);