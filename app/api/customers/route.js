import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Customer from '../../../models/Customer';

export async function GET() {
  await connectDB();
  const customers = await Customer.find({});
  return NextResponse.json(customers);
}

export async function POST(req) {
  const data = await req.json();
  await connectDB();
  const customer = new Customer(data);
  await customer.save();
  return NextResponse.json(customer, { status: 201 });
}

export async function PUT(req) {
  const { id } = req.url.searchParams;
  const data = await req.json();
  await connectDB();
  const updatedCustomer = await Customer.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updatedCustomer);
}

export async function DELETE(req) {
  const { id } = req.url.searchParams;
  await connectDB();
  await Customer.findByIdAndDelete(id);
  return NextResponse.json({}, { status: 204 });
}
