const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    trim: true
  }],
  icon: {
    type: String,
    default: 'Users'
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Schema for header content
const headerContentSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    default: "Our Services"
  },
  mainTitle: {
    type: String,
    default: "Complete Political Solutions"
  },
  description: {
    type: String,
    default: "From strategic planning to crisis management, we provide comprehensive political consulting services that drive success and create lasting impact."
  }
});

// Schema for CTA content
const ctaContentSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Ready to Transform Your Political Journey?"
  },
  description: {
    type: String,
    default: "Let's discuss how our comprehensive services can help you achieve your political goals."
  },
  buttonText: {
    type: String,
    default: "Get Started Today"
  }
});

// Add the static method to the schema BEFORE creating the model
servicesSchema.statics.getServicesPageData = async function() {
  const services = await this.find({}).sort({ order: 1, createdAt: 1 });
  
  // Get header and CTA content from their respective collections
  let headerContent = await HeaderContent.findOne();
  let ctaContent = await CtaContent.findOne();
  
  // If no content exists, create defaults
  if (!headerContent) {
    headerContent = await HeaderContent.create({});
  }
  
  if (!ctaContent) {
    ctaContent = await CtaContent.create({});
  }

  return {
    services,
    headerContent,
    ctaSection: ctaContent
  };
};

// Now create the models
const Service = mongoose.model('Services', servicesSchema);
const HeaderContent = mongoose.model('HeaderContent', headerContentSchema);
const CtaContent = mongoose.model('CtaContent', ctaContentSchema);

module.exports = { Service, HeaderContent, CtaContent };