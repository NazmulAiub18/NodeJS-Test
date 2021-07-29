const { model, Schema } = require("mongoose");

const orderSchema = new Schema(
  {
    phone: {
      type: String,
      required: [true, "phone must not be empty"],
    },
    orderItems: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

module.exports = Order;
