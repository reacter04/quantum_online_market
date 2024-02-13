import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Write the name of the product"],
      maxLength: [200, "The product name cannot exceed 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Write the price of the product"],
      maxLength: [5, "PThe price cannot consist of more than 5 digits"],
    },
    description: {
      type: String,
      required: [true, "Write a description of the product"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: { type: String, required: true },
      },
    ],
    category: {
      type: String,
      required: [true, "Select the category for the product"],
      enum: {
        values: [
          "Electronics",
          "Cameras",
          "Laptops",
          "Accessories",
          "Headphones",
          "Food",
          "Books",
          "Sport",
          "Outdoors",
          "Home",
        ],
        message: "Select the correct category for the product",
      },
    },
    seller: {
      type: String,
      required: [true, "Write who the seller is"],
    },
    stock: {
      type: Number,
      required: [true, "Write how many products are in stock"],
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
