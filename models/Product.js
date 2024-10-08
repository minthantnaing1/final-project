import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true},
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: false },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
