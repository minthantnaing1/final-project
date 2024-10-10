import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Order from '../../../../models/Order';

export async function GET(req, { params }) {
    await dbConnect();
    const order = await Order.findById(params.id)
        .populate('product') // Populate product details
        .populate('customer'); // Populate customer details
    
    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    
    return NextResponse.json(order);
}

export async function PUT(req, { params }) {
    await dbConnect();
    const data = await req.json();

    try {
        const updatedOrder = await Order.findByIdAndUpdate(params.id, data, { new: true })
            .populate('product') // Repopulate updated product
            .populate('customer'); // Repopulate updated customer
        
        if (!updatedOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        return NextResponse.json(updatedOrder);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update order" }, { status: 400 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;

    await dbConnect();
    try {
      await Order.findByIdAndDelete(id);
      return NextResponse.json({}, { status: 204 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete order" }, { status: 400 });
    }
}
