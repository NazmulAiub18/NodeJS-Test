module.exports = function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = err.message;
  let reason = err.reason;

  switch (err.name) {
    case "AuthenticationError":
      statusCode = err.statusCode || 401;
      break;

    case "AuthorizationError":
      statusCode = err.statusCode || 403;
      break;

    case "BadRequestError":
      statusCode = err.statusCode || 400;
      break;

    case "NotFoundError":
      statusCode = err.statusCode || 404;
      break;

    case "MongoError":
      statusCode = 502;
      // message = "Database Error";
      // reason = err.message;
      break;

    default:
      break;
  }

  return res.status(statusCode).json({
    message,
    reason,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
