const express = require('express');
const router = express.Router();
const { Service } = require('../models/Services'); // Only import Service

// Get all services with page content
router.get('/', async (req, res) => {
  try {
    const servicesData = await Service.getServicesPageData();
    res.json({
      success: true,
      data: servicesData
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services data'
    });
  }
});

// Create a new service
router.post('/', async (req, res) => {
  try {
    const { title, description, features, icon, active } = req.body;
    
    // Handle undefined features array
    const filteredFeatures = features ? features.filter(f => f && f.trim()) : [];
    
    const service = new Service({
      title,
      description,
      features: filteredFeatures,
      icon: icon || 'Users',
      active: active !== undefined ? active : true
    });
    
    const savedService = await service.save();
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: savedService
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service'
    });
  }
});

// Update a service
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, features, icon, active } = req.body;
    
    // Handle undefined features array
    const filteredFeatures = features ? features.filter(f => f && f.trim()) : [];
    
    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        title,
        description,
        features: filteredFeatures,
        icon,
        active
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
});

// Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedService = await Service.findByIdAndDelete(id);
    
    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
});

// Toggle service active status
router.patch('/:id/toggle-active', async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    service.active = !service.active;
    const updatedService = await service.save();
    
    res.json({
      success: true,
      message: 'Service status updated',
      data: updatedService
    });
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service status'
    });
  }
});

module.exports = router;