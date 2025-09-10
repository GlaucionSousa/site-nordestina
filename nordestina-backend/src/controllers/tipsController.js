const initModels = require("../models");
const Joi = require("joi");

// Public: return N tips based on day-of-year rotation
async function getDailyTips(req, res) {
  const count = Number(req.query.count) || 3;
  const models = await initModels({ sync: false });
  const allTips = await models.Tip.findAll({
    where: { isActive: true },
    order: [["id", "ASC"]],
  });

  if (!allTips.length) return res.json([]);

  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  const startIndex = dayOfYear % allTips.length;
  const tips = [];
  for (let i = 0; i < count; i++) {
    tips.push(allTips[(startIndex + i) % allTips.length]);
  }
  return res.json(tips);
}

// Admin endpoints: create / update / delete
async function createTip(req, res) {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    isActive: Joi.boolean().default(true),
  });
  const { error, value } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ error: error.details.map((d) => d.message) });

  const models = await initModels({ sync: false });
  const tip = await models.Tip.create(value);
  res.status(201).json(tip);
}

async function updateTip(req, res) {
  const id = req.params.id;
  const models = await initModels({ sync: false });
  const tip = await models.Tip.findByPk(id);
  if (!tip) return res.status(404).json({ error: "Tip not found" });
  await tip.update(req.body);
  res.json(tip);
}

async function deleteTip(req, res) {
  const id = req.params.id;
  const models = await initModels({ sync: false });
  const tip = await models.Tip.findByPk(id);
  if (!tip) return res.status(404).json({ error: "Tip not found" });
  await tip.destroy();
  res.json({ success: true });
}

module.exports = { getDailyTips, createTip, updateTip, deleteTip };
