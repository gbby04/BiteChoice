const express = require("express");
const router = express.Router();
const preferenceController = require("../controllers/preferenceController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, preferenceController.getPreferences);
router.post("/", auth, preferenceController.updatePreferences);

module.exports = router;
