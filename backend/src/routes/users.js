// In your Backend Routes file (e.g., routes/users.js)
const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Import the model from your first image

// This matches your frontend fetch(`${API_BASE_URL}/user/profile`)
router.get('/user/profile', async (req, res) => {
    try {
        // 1. Identify the user
        // vital: In a real app, you get the ID from the logged-in session or token.
        // For now, I'm hardcoding ID 1 so you can test the connection.
        const currentUserId = 1; // req.session.userId (if using sessions)

        // 2. Use the Sequelize Model (from your image) to find data
        const user = await User.findOne({
            where: { user_id: currentUserId },
            attributes: ['name', 'email'] // Only select fields you need (security best practice)
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 3. Send the data back to your frontend
        res.json({
            name: user.name,
            email: user.email
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
