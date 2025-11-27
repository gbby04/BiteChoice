const db = require("../models");
// Note: We include the UserPreferences model here
const { User, UserPreferences } = db; 

const userController = {
    // ===============================================
    // GET /user/profile - Fetch data for EditProfilePage
    // ===============================================
    getProfile: async (req, res) => {
        try {
            // The user ID is retrieved securely from the JWT token via authMiddleware
            const userId = req.user.userId; 

            const user = await User.findByPk(userId, {
                // Include all necessary profile fields and related preferences
                attributes: [
                    'user_id', 
                    'name', 
                    'email', 
                    'gender',       // Required by Frontend
                    'birthday',     // Required by Frontend
                    'profile_image' // Required by Frontend
                ],
                // Include any associated preferences data if needed later
                include: [{ 
                    model: UserPreferences,
                    attributes: ['theme_preference'] // Example preference field
                }] 
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Send the required fields back to the React component
            res.json(user);

        } catch (error) {
            console.error("user.getProfile error:", error);
            res.status(500).json({ message: 'Server error retrieving profile.' });
        }
    },

    // ===============================================
    // PUT /user/profile - Update editable fields
    // ===============================================
    updateProfile: async (req, res) => {
        try {
            const userId = req.user.userId; 
            const { name, gender, birthday, profile_image } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            // Update the editable fields
            await user.update({
                name: name,
                gender: gender,
                birthday: birthday,
                profile_image: profile_image,
            });

            res.json({ 
                message: "Profile updated successfully.", 
                // Send back the updated data structure 
                user: { id: user.user_id, name: user.name, email: user.email, gender: user.gender }
            });
            
        } catch (error) {
            console.error("user.updateProfile error:", error);
            res.status(500).json({ message: "Failed to update profile." });
        }
    }
};

module.exports = userController;

