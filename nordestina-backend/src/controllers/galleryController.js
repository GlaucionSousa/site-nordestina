const initModels = require("../models");

// lista imagens ativas
async function listGallery(req, res) {
  const models = await initModels({ sync: false });
  const images = await models.Gallery.findAll({
    where: { active: true },
    order: [["order", "ASC"]],
  });
  res.json(images);
}

// admin: create / update / delete (not full file upload here)
async function createImage(req, res) {
  const models = await initModels({ sync: false });
  const { url, alt, order = 0, active = true } = req.body;
  const image = await models.Gallery.create({ url, alt, order, active });
  res.status(201).json(image);
}
module.exports = { listGallery, createImage };
