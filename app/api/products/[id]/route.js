import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Product from '../../../../models/Product';

export async function GET(req, { params }) {
    await dbConnect();
    const product = await Product.findById(params.id);
    
    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
}

export async function PUT(req, { params }) {
    await dbConnect();
    const data = await req.json();
    
    try {
        const updatedProduct = await Product.findByIdAndUpdate(params.id, data, { new: true });
        if (!updatedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update product" }, { status: 400 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params; // Extract id from the URL params
  
    await dbConnect();
    try {
      await Product.findByIdAndDelete(id);
      return NextResponse.json({}, { status: 204 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete product" }, { status: 400 });
    }
}
