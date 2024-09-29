import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Order from '../../../models/Order';

export async function GET() {
  await connectDB();
  const orders = await Order.find({}).populate('customerId').populate('productIds');
  return NextResponse.json(orders);
}

export async function POST(req) {
  const data = await req.json();
  await connectDB();
  const order = new Order(data);
  await order.save();
  return NextResponse.json(order, { status: 201 });
}

export async function PUT(req) {
  const { id } = req.url.searchParams;
  const data = await req.json();
  await connectDB();
  const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updatedOrder);
}

export async function DELETE(req) {
  const { id } = req.url.searchParams;
  await connectDB();
  await Order.findByIdAndDelete(id);
  return NextResponse.json({}, { status: 204 });
}
