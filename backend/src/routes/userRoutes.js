const express = require('express');
const router = express.Router();
// Import the controller and the middleware we set up earlier
const userController = require('../controllers/userController'); 
const authMiddleware = require('../middleware/authMiddleware');

// All user management routes require authentication first
router.use(authMiddleware);

// GET /user/profile - Fetches the logged-in user's full profile
router.get('/profile', userController.getProfile); 

// PUT /user/profile - Updates the logged-in user's profile data
router.put('/profile', userController.updateProfile); 

module.exports = router;
