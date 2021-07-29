module.exports = (err) => {
  const errors = {};
  err.inner.forEach((e) => {
    errors[e.path] = e.message;
  });

  return errors;
};
