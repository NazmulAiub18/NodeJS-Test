const main = async () => {
  try {
    const express = require("express");
    const mongoose = require("mongoose");

    mongoose.set("debug", true);
    require("dotenv").config();

    if (!process.env.MONGODB_URI) {
      throw new Error("Please Add MONGODB_URI In Your .env File!");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    // middlewares
    const notFound = require("./middlewares/notFound");
    const errorHandler = require("./middlewares/errorHandler");
    const validate = require("./middlewares/validate");

    // utils
    const { NotFoundError } = require("./utils/Errors");

    // models
    const Order = require("./models/Order");
    const OrderItem = require("./models/OrderItem");

    // validation schemas
    const { createSchema } = require("./validationSchemas/orderSchemas");

    const app = express();

    app.use(express.json());

    app.post("/api/order", validate(createSchema), async (req, res, next) => {
      try {
        const { phone, orderItems } = req.body;

        const orderItemsToBeInsert = orderItems.reduce(
          (acc, { quantity, product }) => {
            // considering there will be no duplicate product in the array
            if (acc[quantity]) {
              acc[quantity].products.push(product);
            } else {
              acc[quantity] = {
                quantity,
                products: [product],
              };
            }

            return acc;
          },
          {}
        );

        const orderItemDocs = await OrderItem.insertMany(
          Object.values(orderItemsToBeInsert)
        );

        const orderItemIds = orderItemDocs.map(({ _id }) => _id);

        const order = new Order({
          phone,
          orderItems: orderItemIds,
        });

        await order.save();
        return res.json({
          message: "Order Successfully Created!",
          data: order,
        });
      } catch (err) {
        return next(err);
      }
    });

    app.get("/api/order/:orderId", async (req, res, next) => {
      try {
        const { orderId } = req.params;

        // const data = await Order.findById(orderId)
        //   .populate("orderItems", "quantity products")
        //   .lean();

        // The query above will produce two database call, for one database call here is the aggregate
        const [data] = await Order.aggregate([
          {
            $match: {
              _id: mongoose.Types.ObjectId(orderId),
            },
          },
          {
            $unwind: "$orderItems",
          },
          {
            $lookup: {
              from: "orderitems",
              let: {
                keyToPopulate: "$orderItems",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$keyToPopulate"],
                    },
                  },
                },
                {
                  $project: {
                    quantity: 1,
                    products: 1,
                  },
                },
              ],
              as: "orderItems",
            },
          },
          {
            $unwind: "$orderItems",
          },
          {
            $group: {
              _id: "$_id",
              phone: {
                $first: "$phone",
              },
              orderItems: {
                $push: "$orderItems",
              },
              createdAt: {
                $first: "$createdAt",
              },
              updatedAt: {
                $first: "$updatedAt",
              },
            },
          },
        ]);

        if (!data) {
          throw new NotFoundError("Order Not Found!");
        }

        data.orderItems = data.orderItems.reduce(
          (acc, { quantity, products }) => {
            products.forEach((product) => {
              acc.push({
                quantity,
                product,
              });
            });

            return acc;
          },
          []
        );

        return res.json({
          message: "Order Details!",
          data,
        });
      } catch (err) {
        return next(err);
      }
    });

    app.use(notFound);
    app.use(errorHandler);

    const port = process.env.PORT || 5000;

    app.listen(port, () =>
      console.log(`Server Started at http://localhost:${port}`)
    );
  } catch (err) {
    console.log(err.message);
  }
};

main();
