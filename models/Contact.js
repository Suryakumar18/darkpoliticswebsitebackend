const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'phone', 'address', 'hours', 'social'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  info: {
    type: String,
    required: true,
    trim: true
  },
  subInfo: {
    type: String,
    trim: true,
    default: ''
  },
  icon: {
    type: String,
    enum: ['Mail', 'Phone', 'MapPin', 'Clock', 'Globe', 'Building'],
    default: 'Mail'
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const officeDetailsSchema = new mongoose.Schema({
  address: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  mapUrl: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

const contactSchema = new mongoose.Schema({
  contactInfo: [contactInfoSchema],
  officeDetails: {
    type: officeDetailsSchema,
    default: () => ({})
  },
  socialLinks: [socialLinkSchema]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure only one contact document exists
contactSchema.statics.findOneOrCreate = async function() {
  let contact = await this.findOne();
  if (!contact) {
    contact = await this.create({
      contactInfo: [],
      officeDetails: {
        address: '',
        description: '',
        mapUrl: ''
      },
      socialLinks: []
    });
  }
  return contact;
};

// Virtual for active contact info count
contactSchema.virtual('activeContactInfoCount').get(function() {
  return this.contactInfo ? this.contactInfo.filter(info => info.active).length : 0;
});

// Virtual for active social links count
contactSchema.virtual('activeSocialLinksCount').get(function() {
  return this.socialLinks ? this.socialLinks.filter(link => link.active).length : 0;
});

module.exports = mongoose.model('Contact', contactSchema);