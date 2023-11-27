import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  }
);
const orderModel = model('order', orderSchema);

export default orderModel;