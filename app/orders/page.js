"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const { register, handleSubmit } = useForm();
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchOrders = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders`);
    const data = await response.json();
    setOrders(data);
  };

  // Create a new order
  const createOrder = async (data) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    fetchOrders();
  };

  // Delete an order
  const deleteOrder = async (id) => {
    if (confirm("Are you sure?")) {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders?id=${id}`, {
        method: "DELETE",
      });
      fetchOrders();
    }
  };

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      <form onSubmit={handleSubmit(createOrder)}>
        <input {...register("productId")} placeholder="Product ID" required />
        <input {...register("customerId")} placeholder="Customer ID" required />
        <input type="number" {...register("quantity")} placeholder="Quantity" required />
        <button type="submit">Add Order</button>
      </form>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order ID: {order._id} - Product ID: {order.productId} - Customer ID: {order.customerId} - Quantity: {order.quantity}
            <button onClick={() => deleteOrder(order._id)}>❌</button>
            <Link href={`/orders/edit/${order._id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
