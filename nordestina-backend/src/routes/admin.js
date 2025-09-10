const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const tips = require("../controllers/tipsController");
const gallery = require("../controllers/galleryController");
const initModels = require("../models");

router.use(auth);

// Tips admin
router.post("/tips", tips.createTip);
router.put("/tips/:id", tips.updateTip);
router.delete("/tips/:id", tips.deleteTip);

// Gallery admin
router.post("/gallery", gallery.createImage);

// Retrieve contacts
router.get("/contacts", async (req, res) => {
  const models = await initModels({ sync: false });
  const all = await models.Contact.findAll({ order: [["createdAt", "DESC"]] });
  res.json(all);
});

// Reviews management
router.get("/reviews/all", async (req, res) => {
  const models = await initModels({ sync: false });
  const all = await models.Review.findAll({ order: [["createdAt", "DESC"]] });
  res.json(all);
});

module.exports = router;
