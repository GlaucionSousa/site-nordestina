const initModels = require("../models");
const Joi = require("joi");
const mailer = require("../utils/mailer");

async function createContact(req, res) {
  const schema = Joi.object({
    name: Joi.string().required(),
    company: Joi.string().allow("", null),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    people: Joi.number().integer().min(1).allow(null),
    message: Joi.string().allow("", null),
  });
  const { error, value } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ error: error.details.map((d) => d.message) });

  const models = await initModels({ sync: false });
  const contact = await models.Contact.create(value);

  // enviar e-mail para equipe (opcional)
  try {
    await mailer.sendContactNotification(contact);
  } catch (err) {
    console.warn("Mailer failed:", err.message);
  }

  res.status(201).json(contact);
}

module.exports = { createContact };
