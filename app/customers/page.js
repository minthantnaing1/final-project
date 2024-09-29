"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const router = useRouter();

  const fetchCustomers = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customers`);
    const data = await response.json();
    setCustomers(data);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customers?id=${id}`, {
        method: "DELETE",
      });
      fetchCustomers();
    }
  };

  const handleEdit = (id) => {
    // This should navigate to the correct edit page
    router.push(`/customers/${id}`);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="dashboard">
      <h1>Customers</h1>
      <table className="customerTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id} className="customerRow">
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>
                <div className="buttonGroup">
                  <button
                    className="customerEditButton"
                    onClick={() => handleEdit(customer._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="customerDeleteButton"
                    onClick={() => handleDelete(customer._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
