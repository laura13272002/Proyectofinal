import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {type: String, required: true},
    rating: { type: Number, min: 0, max: 5, default: 0,},
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const productModel = model('product', productSchema);

export default productModel;