"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditOrderPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders/${id}`);
    const data = await response.json();
    setOrder(data);
    setLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: data.quantity }), // Only update quantity
    });

    if (response.ok) {
      alert("Order updated successfully");
      router.push("/orders");
    } else {
      alert("Failed to update order");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <form onSubmit={handleSubmit} className="formContainer">
      <h2>Edit Order</h2>
      <p>Product: {order.product.name} (ID: {order.product._id})</p>
      <p>Customer: {order.customer.name} (ID: {order.customer._id})</p>
      <input
        type="number"
        name="quantity"
        defaultValue={order.quantity}
        placeholder="Quantity"
        className="formInput"
      />
      <div className="formButtons">
        <button type="submit" className="updateButton">Update</button>
      </div>
    </form>
  );
}
