// apis/homepage.js
const express = require('express');
const router = express.Router();
const Homepage = require('../models/Homepage');

// Get active homepage data
router.get('/', async (req, res) => {
  try {
    let homepage = await Homepage.findOne({ isActive: true });
    
    // If no homepage exists, create default one
    if (!homepage) {
      homepage = new Homepage({
        brandName: "DARK STATE",
        tagline: "DARK STATE POLITICAL CONSULTANCY",
        mainHeading: "Political Excellence Redefined",
        description: "Strategic political consulting that transforms visions into victories. We craft campaigns that resonate, strategies that win, and futures that inspire.",
        ctaButton: "Start Your Campaign",
        socialLinks: {
          linkedin: "#",
          twitter: "#",
          email: "#"
        },
        backgroundImages: [
          {
            url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
            alt: "Political meeting",
            active: true
          },
          {
            url: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            alt: "Government building",
            active: true
          },
          {
            url: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            alt: "Campaign rally",
            active: true
          },
          {
            url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80",
            alt: "Political discussion",
            active: true
          }
        ],
        displaySettings: {
          imageRotationInterval: 5,
          animationDuration: 2,
          enableFloatingAnimations: true,
          autoRotateImages: true,
          maintenanceMode: false
        }
      });
      await homepage.save();
    }

    res.json({
      success: true,
      data: homepage
    });
  } catch (error) {
    console.error('Error fetching homepage:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching homepage data',
      error: error.message
    });
  }
});

// Update homepage content (brand info, text content)
router.put('/content', async (req, res) => {
  try {
    const { brandName, tagline, mainHeading, description, ctaButton } = req.body;
    
    const homepage = await Homepage.findOne({ isActive: true });
    if (!homepage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage configuration not found'
      });
    }

    // Update only provided fields
    if (brandName !== undefined) homepage.brandName = brandName;
    if (tagline !== undefined) homepage.tagline = tagline;
    if (mainHeading !== undefined) homepage.mainHeading = mainHeading;
    if (description !== undefined) homepage.description = description;
    if (ctaButton !== undefined) homepage.ctaButton = ctaButton;

    await homepage.save();

    res.json({
      success: true,
      message: 'Homepage content updated successfully',
      data: homepage
    });
  } catch (error) {
    console.error('Error updating homepage content:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating homepage content',
      error: error.message
    });
  }
});

// Update social links
router.put('/social-links', async (req, res) => {
  try {
    const { linkedin, twitter, email } = req.body;
    
    const homepage = await Homepage.findOne({ isActive: true });
    if (!homepage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage configuration not found'
      });
    }

    // Update social links
    if (linkedin !== undefined) homepage.socialLinks.linkedin = linkedin;
    if (twitter !== undefined) homepage.socialLinks.twitter = twitter;
    if (email !== undefined) homepage.socialLinks.email = email;

    await homepage.save();

    res.json({
      success: true,
      message: 'Social links updated successfully',
      data: homepage.socialLinks
    });
  } catch (error) {
    console.error('Error updating social links:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating social links',
      error: error.message
    });
  }
});

// Add new background image
router.post('/images', async (req, res) => {
  try {
    const { url, alt, active = true } = req.body;
    
    if (!url || !alt) {
      return res.status(400).json({
        success: false,
        message: 'URL and alt text are required'
      });
    }

    const homepage = await Homepage.findOne({ isActive: true });
    if (!homepage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage configuration not found'
      });
    }

    const newImage = {
      url,
      alt,
      active
    };

    homepage.backgroundImages.push(newImage);
    await homepage.save();

    res.json({
      success: true,
      message: 'Background image added successfully',
      data: homepage.backgroundImages
    });
  } catch (error) {
    console.error('Error adding background image:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding background image',
      error: error.message
    });
  }
});

// Update background image
router.put('/images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const { url, alt, active } = req.body;
    
    const homepage = await Homepage.findOne({ isActive: true });
    if (!homepage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage configuration not found'
      });
    }

    const image = homepage.backgroundImages.id(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Update only provided fields
    if (url !== undefined) image.url = url;
    if (alt !== undefined) image.alt = alt;
    if (active !== undefined) image.active = active;

    await homepage.save();

    res.json({
      success: true,
      message: 'Background image updated successfully',
      data: image
    });
  } catch (error) {
    console.error('Error updating background image:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating background image',
      error: error.message
    });
  }
});

// Delete background image
router.delete('/images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    
    const homepage = await Homepage.findOne({ isActive: true });
    if (!homepage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage configuration not found'
      });
    }

    const image = homepage.backgroundImages.id(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    homepage.backgroundImages.pull(imageId);
    await homepage.save();

    res.json({
      success: true,
      message: 'Background image deleted successfully',
      data: homepage.backgroundImages
    });
  } catch (error) {
    console.error('Error deleting background image:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting background image',
      error: error.message
    });
  }
});

// Update display settings
router.put('/settings', async (req, res) => {
  try {
    const { 
      imageRotationInterval, 
      animationDuration, 
      enableFloatingAnimations, 
      autoRotateImages, 
      maintenanceMode 
    } = req.body;
    
    const homepage = await Homepage.findOne({ isActive: true });
    if (!homepage) {
      return res.status(404).json({
        success: false,
        message: 'Homepage configuration not found'
      });
    }

    // Update display settings
    if (imageRotationInterval !== undefined) {
      homepage.displaySettings.imageRotationInterval = imageRotationInterval;
    }
    if (animationDuration !== undefined) {
      homepage.displaySettings.animationDuration = animationDuration;
    }
    if (enableFloatingAnimations !== undefined) {
      homepage.displaySettings.enableFloatingAnimations = enableFloatingAnimations;
    }
    if (autoRotateImages !== undefined) {
      homepage.displaySettings.autoRotateImages = autoRotateImages;
    }
    if (maintenanceMode !== undefined) {
      homepage.displaySettings.maintenanceMode = maintenanceMode;
    }

    await homepage.save();

    res.json({
      success: true,
      message: 'Display settings updated successfully',
      data: homepage.displaySettings
    });
  } catch (error) {
    console.error('Error updating display settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating display settings',
      error: error.message
    });
  }
});

// Get all homepage configurations (admin only)
router.get('/all', async (req, res) => {
  try {
    const homepages = await Homepage.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: homepages
    });
  } catch (error) {
    console.error('Error fetching all homepages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching homepage configurations',
      error: error.message
    });
  }
});

module.exports = router;