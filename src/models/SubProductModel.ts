import mongoose, { Schema } from "mongoose";

const scheme = new Schema(
  {
    size: String,
    color: String,
    price: {
      type: Number,
      default: 0,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
      required: true,
    },
    producId: {
      type: String,
      required: true,
    },
    images: [String],
  },
  { timestamps: true }
);

const SubProductModel = mongoose.model("subproducts", scheme);
export default SubProductModel;
