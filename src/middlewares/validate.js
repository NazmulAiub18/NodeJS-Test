const { BadRequestError } = require("../utils/Errors");

const formatYupError = require("../utils/formatYupError");

module.exports = function (schema) {
  return async (req, _, next) => {
    const data = req.body;

    if (!schema) {
      return next(new Error("Please Provide Schema"));
    }
    try {
      await schema.validate(data, { abortEarly: false });
      return next();
    } catch (err) {
      return next(new BadRequestError(err.message, formatYupError(err)));
    }
  };
};
