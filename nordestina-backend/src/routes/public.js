const express = require("express");
const router = express.Router();
const tips = require("../controllers/tipsController");
const reviews = require("../controllers/reviewsController");
const gallery = require("../controllers/galleryController");
const contact = require("../controllers/contactController");

router.get("/tips", tips.getDailyTips); // ?count=3
router.get("/reviews", reviews.getRecent);
router.post("/reviews", reviews.createReview);
router.get("/gallery", gallery.listGallery);
router.post("/contact", contact.createContact);

module.exports = router;
