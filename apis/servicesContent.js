const express = require('express');
const router = express.Router();
const { HeaderContent, CtaContent } = require('../models/Services');

// Get header content
router.get('/header', async (req, res) => {
  try {
    let headerContent = await HeaderContent.findOne();
    
    if (!headerContent) {
      headerContent = await HeaderContent.create({});
    }
    
    res.json({
      success: true,
      data: headerContent
    });
  } catch (error) {
    console.error('Error fetching header content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch header content'
    });
  }
});

// Update header content
router.put('/header', async (req, res) => {
  try {
    const { subtitle, mainTitle, description } = req.body;
    
    // Find existing header content or create new
    let headerContent = await HeaderContent.findOne();
    
    if (!headerContent) {
      headerContent = new HeaderContent({ subtitle, mainTitle, description });
    } else {
      headerContent.subtitle = subtitle || headerContent.subtitle;
      headerContent.mainTitle = mainTitle || headerContent.mainTitle;
      headerContent.description = description || headerContent.description;
    }
    
    const updatedHeader = await headerContent.save();
    
    res.json({
      success: true,
      message: 'Header content updated successfully',
      data: updatedHeader
    });
  } catch (error) {
    console.error('Error updating header content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update header content'
    });
  }
});

// Get CTA content
router.get('/cta', async (req, res) => {
  try {
    let ctaContent = await CtaContent.findOne();
    
    if (!ctaContent) {
      ctaContent = await CtaContent.create({});
    }
    
    res.json({
      success: true,
      data: ctaContent
    });
  } catch (error) {
    console.error('Error fetching CTA content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch CTA content'
    });
  }
});

// Update CTA content
router.put('/cta', async (req, res) => {
  try {
    const { title, description, buttonText } = req.body;
    
    // Find existing CTA content or create new
    let ctaContent = await CtaContent.findOne();
    
    if (!ctaContent) {
      ctaContent = new CtaContent({ title, description, buttonText });
    } else {
      ctaContent.title = title || ctaContent.title;
      ctaContent.description = description || ctaContent.description;
      ctaContent.buttonText = buttonText || ctaContent.buttonText;
    }
    
    const updatedCta = await ctaContent.save();
    
    res.json({
      success: true,
      message: 'CTA content updated successfully',
      data: updatedCta
    });
  } catch (error) {
    console.error('Error updating CTA content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update CTA content'
    });
  }
});

module.exports = router;