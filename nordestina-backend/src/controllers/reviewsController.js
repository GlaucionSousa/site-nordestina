const initModels = require("../models");
const Joi = require("joi");

async function getRecent(req, res) {
  const models = await initModels({ sync: false });
  const reviews = await models.Review.findAll({
    order: [["createdAt", "DESC"]],
    limit: 10,
  });
  res.json(reviews);
}

async function createReview(req, res) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    company: Joi.string().allow("", null),
    rating: Joi.number().min(1).max(5).required(),
    message: Joi.string().min(1).required(),
  });
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error)
    return res.status(400).json({ error: error.details.map((d) => d.message) });

  const models = await initModels({ sync: false });
  const review = await models.Review.create(value);
  res.status(201).json(review);
}

module.exports = { getRecent, createReview };
