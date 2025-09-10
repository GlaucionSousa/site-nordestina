const Joi = require("joi");

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error)
      return res
        .status(400)
        .json({ error: error.details.map((d) => d.message) });
    req.validated = value;
    next();
  };
}

module.exports = validate;
