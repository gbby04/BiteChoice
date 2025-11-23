const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const auth = require("../middleware/authMiddleware");

// public search (auth optional) — requires no auth by default, but you may add auth middleware if you want
router.get("/", searchController.search);

module.exports = router;
