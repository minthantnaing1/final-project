"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function CustomersPage() {
  const { register, handleSubmit } = useForm();
  const [customers, setCustomers] = useState([]);

  // Fetch all customers
  const fetchCustomers = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customers`);
    const data = await response.json();
    setCustomers(data);
  };

  // Create a new customer
  const createCustomer = async (data) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    fetchCustomers();
  };

  // Delete a customer
  const deleteCustomer = async (id) => {
    if (confirm("Are you sure?")) {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customers?id=${id}`, {
        method: "DELETE",
      });
      fetchCustomers();
    }
  };

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <h1>Customers</h1>
      <form onSubmit={handleSubmit(createCustomer)}>
        <input {...register("name")} placeholder="Name" required />
        <input {...register("email")} placeholder="Email" required />
        <input {...register("phone")} placeholder="Phone" required />
        <button type="submit">Add Customer</button>
      </form>
      <ul>
        {customers.map((customer) => (
          <li key={customer._id}>
            {customer.name} - {customer.email}
            <button onClick={() => deleteCustomer(customer._id)}>❌</button>
            <Link href={`/customers/edit/${customer._id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
