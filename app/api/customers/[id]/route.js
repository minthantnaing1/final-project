import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Customer from '../../../../models/Customer';

export async function GET(req, { params }) {
    await dbConnect();
    const customer = await Customer.findById(params.id);

    if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
}

export async function PUT(req, { params }) {
    await dbConnect();
    const data = await req.json();

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(params.id, data, { new: true });
        if (!updatedCustomer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }
        return NextResponse.json(updatedCustomer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update customer" }, { status: 400 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params; // Extract id from the URL params

    await dbConnect();
    try {
        await Customer.findByIdAndDelete(id);
        return NextResponse.json({}, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 400 });
    }
}
