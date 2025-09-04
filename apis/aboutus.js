const express = require('express');
const router = express.Router();
const AboutUs = require('../models/About');

// GET about us data
router.get('/', async (req, res) => {
  try {
    const aboutUsData = await AboutUs.getAboutUsData();
    res.json({
      success: true,
      data: aboutUsData
    });
  } catch (error) {
    console.error('Error fetching about us data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch about us data'
    });
  }
});

// UPDATE header content
router.put('/header', async (req, res) => {
  try {
    const { subtitle, title, description } = req.body;
    
    const aboutUsData = await AboutUs.getAboutUsData();
    aboutUsData.header = {
      subtitle: subtitle || aboutUsData.header.subtitle,
      title: title || aboutUsData.header.title,
      description: description || aboutUsData.header.description
    };
    
    await aboutUsData.save();
    
    res.json({
      success: true,
      message: 'Header content updated successfully',
      data: aboutUsData
    });
  } catch (error) {
    console.error('Error updating header content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update header content'
    });
  }
});

// UPDATE mission content
router.put('/mission', async (req, res) => {
  try {
    const { title, content, subsectionTitle } = req.body;
    
    const aboutUsData = await AboutUs.getAboutUsData();
    aboutUsData.mission = {
      title: title || aboutUsData.mission.title,
      content: content || aboutUsData.mission.content,
      subsectionTitle: subsectionTitle || aboutUsData.mission.subsectionTitle
    };
    
    await aboutUsData.save();
    
    res.json({
      success: true,
      message: 'Mission content updated successfully',
      data: aboutUsData
    });
  } catch (error) {
    console.error('Error updating mission content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mission content'
    });
  }
});

// ADD carousel image
router.post('/carousel', async (req, res) => {
  try {
    const { url, title, description } = req.body;
    
    if (!url || !title) {
      return res.status(400).json({
        success: false,
        message: 'URL and title are required'
      });
    }
    
    const aboutUsData = await AboutUs.getAboutUsData();
    aboutUsData.carouselImages.push({
      url,
      title,
      description: description || '',
      active: true
    });
    
    await aboutUsData.save();
    
    res.json({
      success: true,
      message: 'Carousel image added successfully',
      data: aboutUsData
    });
  } catch (error) {
    console.error('Error adding carousel image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add carousel image'
    });
  }
});

// UPDATE carousel image status
router.put('/carousel/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    
    const aboutUsData = await AboutUs.getAboutUsData();
    const imageIndex = aboutUsData.carouselImages.findIndex(img => img._id.toString() === id);
    
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Carousel image not found'
      });
    }
    
    aboutUsData.carouselImages[imageIndex].active = active;
    await aboutUsData.save();
    
    res.json({
      success: true,
      message: 'Carousel image status updated successfully',
      data: aboutUsData
    });
  } catch (error) {
    console.error('Error updating carousel image status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update carousel image status'
    });
  }
});

// DELETE carousel image
router.delete('/carousel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const aboutUsData = await AboutUs.getAboutUsData();
    aboutUsData.carouselImages = aboutUsData.carouselImages.filter(img => img._id.toString() !== id);
    
    await aboutUsData.save();
    
    res.json({
      success: true,
      message: 'Carousel image deleted successfully',
      data: aboutUsData
    });
  } catch (error) {
    console.error('Error deleting carousel image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete carousel image'
    });
  }
});

// ADD feature
router.post('/features', async (req, res) => {
  try {
    const { feature } = req.body;
    
    if (!feature) {
      return res.status(400).json({
        success: false,
        message: 'Feature text is required'
      });
    }
    
    const aboutUsData = await AboutUs.getAboutUsData();
    aboutUsData.features.push(feature);
    
    await aboutUsData.save();
    
    res.json({
      success: true,
      message: 'Feature added successfully',
      data: aboutUsData
    });
  } catch (error) {
    console.error('Error adding feature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add feature'
    });
  }
});

// DELETE feature
router.delete('/features/:index', async (req, res) => {
  try {
    const { index } = req.params;
    
    const aboutUsData = await AboutUs.getAboutUsData();
    
    if (index < 0 || index >= aboutUsData.features.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feature index'
      });
    }
    
    aboutUsData.features.splice(index, 1);
    await aboutUsData.save();
    
    res.json({
      success: true,
      message: 'Feature deleted successfully',
      data: aboutUsData
    });
  } catch (error) {
    console.error('Error deleting feature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feature'
    });
  }
});

// UPDATE statistics
router.put('/stats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { number, label } = req.body;
    
    const aboutUsData = await AboutUs.getAboutUsData();
    const statIndex = aboutUsData.stats.findIndex(stat => stat._id.toString() === id);
    
    if (statIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Statistic not found'
      });
    }
    
    if (number) aboutUsData.stats[statIndex].number = number;
    if (label) aboutUsData.stats[statIndex].label = label;
    
    await aboutUsData.save();
    
    res.json({
      success: true,
      message: 'Statistic updated successfully',
      data: aboutUsData
    });
  } catch (error) {
    console.error('Error updating statistic:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update statistic'
    });
  }
});

module.exports = router;