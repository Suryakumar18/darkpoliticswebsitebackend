const mongoose = require('mongoose');

const carouselImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'users'
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const statSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
}, { timestamps: true });

const aboutUsSchema = new mongoose.Schema({
  header: {
    subtitle: {
      type: String,
      default: "About Dark State"
    },
    title: {
      type: String,
      default: "Redefining Political Excellence"
    },
    description: {
      type: String,
      default: "We are the architects of political transformation, crafting strategies that turn visions into victories."
    }
  },
  mission: {
    title: {
      type: String,
      default: "Our Mission"
    },
    content: {
      type: String,
      default: "At Dark State Political Consultancy, we believe that great campaigns are born from the perfect fusion of strategic insight, innovative thinking, and relentless execution. Our team of seasoned professionals brings decades of experience in political strategy, digital marketing, and stakeholder engagement."
    },
    subsectionTitle: {
      type: String,
      default: "What Sets Us Apart"
    }
  },
  features: [{
    type: String
  }],
  carouselImages: [carouselImageSchema],
  services: [serviceSchema],
  stats: [statSchema]
}, { timestamps: true });

// Create or get the singleton document
aboutUsSchema.statics.getAboutUsData = function() {
  return this.findOne().then(doc => {
    if (doc) {
      return doc;
    } else {
      // Create default document if none exists
      return this.create({
        header: {
          subtitle: "About Dark State",
          title: "Redefining Political Excellence", 
          description: "We are the architects of political transformation, crafting strategies that turn visions into victories."
        },
        mission: {
          title: "Our Mission",
          content: "At Dark State Political Consultancy, we believe that great campaigns are born from the perfect fusion of strategic insight, innovative thinking, and relentless execution. Our team of seasoned professionals brings decades of experience in political strategy, digital marketing, and stakeholder engagement.",
          subsectionTitle: "What Sets Us Apart"
        },
        features: [
          "Data-driven strategies backed by comprehensive research",
          "Innovative digital solutions for modern campaigns", 
          "Proven track record across diverse political landscapes",
          "24/7 dedicated support throughout your campaign"
        ],
        carouselImages: [
          {
            url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80",
            title: "Strategic Planning",
            description: "Comprehensive political strategy development",
            active: true
          },
          {
            url: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2131&q=80",
            title: "Campaign Management",
            description: "Full-scale campaign orchestration",
            active: true
          }
        ],
        services: [
          {
            title: "Strategic Consulting",
            description: "Deep political analysis and strategic planning",
            icon: "brain",
            active: true
          },
          {
            title: "Campaign Management", 
            description: "End-to-end campaign execution and oversight",
            icon: "users",
            active: true
          }
        ],
        stats: [
          { number: "150+", label: "Successful Campaigns" },
          { number: "25+", label: "Years Experience" },
          { number: "98%", label: "Client Satisfaction" },
          { number: "50+", label: "Political Victories" }
        ]
      });
    }
  });
};

module.exports = mongoose.model('AboutUs', aboutUsSchema);