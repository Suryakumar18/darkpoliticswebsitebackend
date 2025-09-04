// models/Homepage.js
const mongoose = require('mongoose');

const backgroundImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { _id: true });

const socialLinksSchema = new mongoose.Schema({
  linkedin: {
    type: String,
    default: "#"
  },
  twitter: {
    type: String,
    default: "#"
  },
  email: {
    type: String,
    default: "#"
  }
}, { _id: false });

const displaySettingsSchema = new mongoose.Schema({
  imageRotationInterval: {
    type: Number,
    default: 5,
    min: 2,
    max: 30
  },
  animationDuration: {
    type: Number,
    default: 2,
    min: 1,
    max: 10
  },
  enableFloatingAnimations: {
    type: Boolean,
    default: true
  },
  autoRotateImages: {
    type: Boolean,
    default: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const homepageSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
    default: "DARK STATE"
  },
  tagline: {
    type: String,
    required: true,
    default: "DARK STATE POLITICAL CONSULTANCY"
  },
  mainHeading: {
    type: String,
    required: true,
    default: "Political Excellence Redefined"
  },
  description: {
    type: String,
    required: true,
    default: "Strategic political consulting that transforms visions into victories. We craft campaigns that resonate, strategies that win, and futures that inspire."
  },
  ctaButton: {
    type: String,
    required: true,
    default: "Start Your Campaign"
  },
  socialLinks: {
    type: socialLinksSchema,
    default: () => ({})
  },
  backgroundImages: [backgroundImageSchema],
  displaySettings: {
    type: displaySettingsSchema,
    default: () => ({})
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure there's always only one active homepage configuration
homepageSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

const Homepage = mongoose.model('Homepage', homepageSchema);

module.exports = Homepage;