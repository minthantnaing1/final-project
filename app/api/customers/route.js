import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Customer from '../../../models/Customer';

export async function GET() {
    await dbConnect();
    const customers = await Customer.find({});
    return NextResponse.json(customers);
}

export async function POST(req) {
    await dbConnect();
    const data = await req.json();
    const customer = new Customer(data);

    try {
        await customer.save();
        return NextResponse.json(customer, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add customer" }, { status: 400 });
    }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); // Extract id from URL query params

  await dbConnect();
  try {
    await Customer.findByIdAndDelete(id);
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 400 });
  }
}
