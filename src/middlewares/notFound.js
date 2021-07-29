const { NotFoundError } = require("../utils/Errors");

module.exports = function notFound(req, res, next) {
  const error = new NotFoundError(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
};
