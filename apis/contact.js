const express = require("express");
const Contact = require("../models/Contact");
const mongoose = require("mongoose");
const router = express.Router();

// Get contact data
router.get("/", async (req, res) => {
  try {
    let contact = await Contact.findOne();
    
    // Create default contact if none exists
    if (!contact) {
      contact = new Contact({
        contactInfo: [],
        officeDetails: {
          address: "",
          description: "",
          mapUrl: ""
        },
        socialLinks: []
      });
      await contact.save();
    }

    res.status(200).json({
      success: true,
      message: "Contact data retrieved successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error fetching contact data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact data",
      error: error.message
    });
  }
});

// Add new contact information
router.post("/info", async (req, res) => {
  try {
    const { type, title, info, subInfo, icon } = req.body;

    // Validation
    if (!type || !title || !info) {
      return res.status(400).json({
        success: false,
        message: "Type, title, and info are required fields"
      });
    }

    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact({
        contactInfo: [],
        officeDetails: { address: "", description: "", mapUrl: "" },
        socialLinks: []
      });
    }

    // Add new contact info
    const newContactInfo = {
      type,
      title: title.trim(),
      info: info.trim(),
      subInfo: subInfo ? subInfo.trim() : "",
      icon: icon || 'Mail',
      active: true
    };

    contact.contactInfo.push(newContactInfo);
    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact information added successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error adding contact info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add contact information",
      error: error.message
    });
  }
});

// Update contact information
router.put("/info/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, info, subInfo, icon, type } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID format"
      });
    }

    // Validation
    if (!title || !info) {
      return res.status(400).json({
        success: false,
        message: "Title and info are required fields"
      });
    }

    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact data not found"
      });
    }

    // Find and update the contact info
    const contactInfo = contact.contactInfo.id(id);
    if (!contactInfo) {
      return res.status(404).json({
        success: false,
        message: "Contact information not found"
      });
    }

    // Update fields
    contactInfo.title = title.trim();
    contactInfo.info = info.trim();
    if (subInfo !== undefined) contactInfo.subInfo = subInfo.trim();
    if (icon) contactInfo.icon = icon;
    if (type) contactInfo.type = type;

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact information updated successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error updating contact info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update contact information",
      error: error.message
    });
  }
});

// Toggle contact info active status
router.patch("/info/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID format"
      });
    }

    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact data not found"
      });
    }

    // Find and update the contact info
    const contactInfo = contact.contactInfo.id(id);
    if (!contactInfo) {
      return res.status(404).json({
        success: false,
        message: "Contact information not found"
      });
    }

    contactInfo.active = typeof active === 'boolean' ? active : !contactInfo.active;
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact information status updated successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error toggling contact info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update contact information status",
      error: error.message
    });
  }
});

// Delete contact information
router.delete("/info/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID format"
      });
    }

    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact data not found"
      });
    }

    // Remove the contact info
    const contactInfoIndex = contact.contactInfo.findIndex(info => info._id.toString() === id);
    if (contactInfoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Contact information not found"
      });
    }

    contact.contactInfo.splice(contactInfoIndex, 1);
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact information deleted successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error deleting contact info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contact information",
      error: error.message
    });
  }
});

// Update office details
router.put("/office", async (req, res) => {
  try {
    const { address, description, mapUrl } = req.body;

    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact({
        contactInfo: [],
        officeDetails: { address: "", description: "", mapUrl: "" },
        socialLinks: []
      });
    }

    // Initialize officeDetails if it doesn't exist
    if (!contact.officeDetails) {
      contact.officeDetails = { address: "", description: "", mapUrl: "" };
    }

    // Update office details
    if (address !== undefined) contact.officeDetails.address = address.trim();
    if (description !== undefined) contact.officeDetails.description = description.trim();
    if (mapUrl !== undefined) contact.officeDetails.mapUrl = mapUrl.trim();

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Office details updated successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error updating office details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update office details",
      error: error.message
    });
  }
});

// Add social link
router.post("/social", async (req, res) => {
  try {
    const { platform, url } = req.body;

    // Validation
    if (!platform || !url) {
      return res.status(400).json({
        success: false,
        message: "Platform and URL are required fields"
      });
    }

    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact({
        contactInfo: [],
        officeDetails: { address: "", description: "", mapUrl: "" },
        socialLinks: []
      });
    }

    // Add new social link
    const newSocialLink = {
      platform: platform.trim(),
      url: url.trim(),
      active: true
    };

    contact.socialLinks.push(newSocialLink);
    await contact.save();

    res.status(201).json({
      success: true,
      message: "Social link added successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error adding social link:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add social link",
      error: error.message
    });
  }
});

// Update social link
router.put("/social/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, url } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid social link ID format"
      });
    }

    // Validation
    if (!platform || !url) {
      return res.status(400).json({
        success: false,
        message: "Platform and URL are required fields"
      });
    }

    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact data not found"
      });
    }

    // Find and update the social link
    const socialLink = contact.socialLinks.id(id);
    if (!socialLink) {
      return res.status(404).json({
        success: false,
        message: "Social link not found"
      });
    }

    socialLink.platform = platform.trim();
    socialLink.url = url.trim();

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Social link updated successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error updating social link:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update social link",
      error: error.message
    });
  }
});

// Toggle social link active status
router.patch("/social/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid social link ID format"
      });
    }

    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact data not found"
      });
    }

    // Find and update the social link
    const socialLink = contact.socialLinks.id(id);
    if (!socialLink) {
      return res.status(404).json({
        success: false,
        message: "Social link not found"
      });
    }

    socialLink.active = typeof active === 'boolean' ? active : !socialLink.active;
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Social link status updated successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error toggling social link:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update social link status",
      error: error.message
    });
  }
});

// Delete social link
router.delete("/social/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid social link ID format"
      });
    }

    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact data not found"
      });
    }

    // Remove the social link
    const socialLinkIndex = contact.socialLinks.findIndex(link => link._id.toString() === id);
    if (socialLinkIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Social link not found"
      });
    }

    contact.socialLinks.splice(socialLinkIndex, 1);
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Social link deleted successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error deleting social link:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete social link",
      error: error.message
    });
  }
});

// Get active contact info only (for public frontend)
router.get("/public", async (req, res) => {
  try {
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact data not found"
      });
    }

    // Filter only active items
    const publicData = {
      contactInfo: contact.contactInfo.filter(info => info.active),
      officeDetails: contact.officeDetails || { address: "", description: "", mapUrl: "" },
      socialLinks: contact.socialLinks.filter(link => link.active)
    };

    res.status(200).json({
      success: true,
      message: "Public contact data retrieved successfully",
      data: publicData
    });
  } catch (error) {
    console.error("Error fetching public contact data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch public contact data",
      error: error.message
    });
  }
});

module.exports = router;