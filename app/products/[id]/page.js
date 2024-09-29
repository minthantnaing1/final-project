"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products/${id}`);
    const data = await response.json();
    setProduct(data);
    setLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Product updated successfully');
      router.push('/products');
    } else {
      alert('Failed to update product');
    }
  };

  const handleCancel = () => {
    router.push('/products');
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <form onSubmit={handleSubmit} className="formContainer">
      <h2>Edit Product</h2>
      <input
        name="code"
        defaultValue={product.code}
        placeholder="Code"
        className="formInput"
      />
      <input
        name="name"
        defaultValue={product.name}
        placeholder="Name"
        className="formInput"
      />
      <input
        type="number"
        name="price"
        defaultValue={product.price}
        placeholder="Price"
        className="formInput"
      />
      <select name="category" defaultValue={product.category} className="formInput">
        <option value="speaker">Speaker</option>
        <option value="phone">Phone</option>
        <option value="laptop">Laptop</option>
        <option value="headphone">Headphone</option>
      </select>
      <textarea
        name="description"
        defaultValue={product.description}
        placeholder="Description"
        className="formTextarea"
      />
      <input
        name="imageUrl"
        defaultValue={product.imageUrl}
        placeholder="Image URL"
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
