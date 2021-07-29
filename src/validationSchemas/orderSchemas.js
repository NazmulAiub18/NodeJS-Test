const yup = require("yup");

exports.createSchema = yup.object().shape({
  phone: yup.string().typeError("Must be a string").min(3).max(20).required(),
  orderItems: yup
    .array()
    .typeError("Must be an array")
    .of(
      yup.object().shape({
        quantity: yup.number().typeError("Must be a number").min(1).required(),
        product: yup.string().typeError("Must be a string").min(1).required(),
      })
    )
    .min(1)
    .required(),
});
