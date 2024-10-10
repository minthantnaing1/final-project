"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function CustomersPage() {
  const { register, handleSubmit, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchCustomers = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customers`);
    const data = await response.json();
    setCustomers(data);
  };

  const createCustomer = async (data) => {
    try {
      const placeholderCustomerId = `customer-${Date.now()}`;
      const newCustomerData = {
        customerId: data.customerId || placeholderCustomerId,
        name: data.name || "Unnamed Customer",
        email: data.email || "No Email Provided",
        phone: data.phone || "No Phone Provided",
        address: data.address || "No Address Provided",
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomerData),
      });

      if (!response.ok) {
        throw new Error("Failed to add customer");
      }

      reset();
      setModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const deleteCustomer = async (id) => {
    if (confirm("Are you sure?")) {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customers?id=${id}`, {
        method: "DELETE",
      });
      fetchCustomers();
    }
  };

  const openAddCustomerModal = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="dashboard">
      <h1>Customers</h1>
      <div className="header">
        <button className="addButton" onClick={openAddCustomerModal}>
          Add More
        </button>
      </div>

      {/* Customer Table */}
      <table className="customerTable">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th> {/* Actions column is the 6th column */}
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id} className="customerRow">
              <td>{customer.customerId}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td className="customerRow">
                <div className="buttonGroup">
                  <button className="customerEditButton">Edit</button>
                  <button
                    className="customerDeleteButton"
                    onClick={() => deleteCustomer(customer._id)}
                    >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modalContent">
            <span className="close" onClick={() => setModalOpen(false)}>
              &times;
            </span>
            <h2>Add Customer</h2>
            <form onSubmit={handleSubmit(createCustomer)} className="formContainer">
              <input {...register("customerId")} className="formInput" placeholder="Customer ID" />
              <input {...register("name")} className="formInput" placeholder="Name" />
              <input {...register("email")} className="formInput" placeholder="Email" />
              <input {...register("phone")} className="formInput" placeholder="Phone" />
              <textarea
                {...register("address")}
                className="formTextarea"
                placeholder="Address"
              />
              <div className="modalActions">
                <button
                  type="button"
                  className="cancelButton"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="confirmButton">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
