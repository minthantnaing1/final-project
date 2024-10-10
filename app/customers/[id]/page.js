"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditCustomerPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customers/${id}`);
    const data = await response.json();
    setCustomer(data);
    setLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Customer updated successfully");
      router.push("/customers");
    } else {
      alert("Failed to update customer");
    }
  };

  const handleCancel = () => {
    router.push("/customers");
  };

  if (loading) return <p>Loading...</p>;
  if (!customer) return <p>Customer not found</p>;

  return (
    <form onSubmit={handleSubmit} className="formContainer">
      <h2>Edit Customer</h2>
      <input
        name="customerId"
        defaultValue={customer.customerId}
        placeholder="Customer ID"
        className="formInput"
      />
      <input
        name="name"
        defaultValue={customer.name}
        placeholder="Name"
        className="formInput"
      />
      <input
        name="email"
        defaultValue={customer.email}
        placeholder="Email"
        className="formInput"
      />
      <input
        name="phone"
        defaultValue={customer.phone}
        placeholder="Phone"
        className="formInput"
      />
      <input
        name="address"
        defaultValue={customer.address}
        placeholder="Address"
        className="formInput"
      />
      <div className="formButtons">
        <button type="button" className="cancelButton" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className="updateButton">Update</button>
      </div>
    </form>
  );
}
