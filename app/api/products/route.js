import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';

export async function GET() {
    await dbConnect();
    const products = await Product.find({});
    return NextResponse.json(products);
}

export async function POST(req) {
    await dbConnect();
    const data = await req.json();
    const product = new Product(data);
    
    try {
        await product.save();
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add product" }, { status: 400 });
    }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); // Extract id from URL query params

  await dbConnect();
  try {
    await Product.findByIdAndDelete(id);
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 400 });
  }
}
