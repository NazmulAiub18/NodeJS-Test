const { model, Schema } = require("mongoose");

const orderItemSchema = new Schema(
  {
    products: [String],
    quantity: Number,
  },
  { timestamps: true }
);

const OrderItem = model("OrderItem", orderItemSchema);

module.exports = OrderItem;
