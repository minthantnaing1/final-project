import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true }, // Unique customer ID
  name: { type: String, required: true },
  email: { type: String, required: true }, // No longer unique
  phone: { type: String, required: true },
  address: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
