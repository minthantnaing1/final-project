"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products`);
    const data = await response.json();
    setProducts(data);
  };

  const createProduct = async (data) => {
    try {
      const newProductData = {
        code: data.code || "N/A",
        name: data.name || "Unnamed Product",
        description: data.description || "No description provided",
        price: data.price || 0,
        category: data.category || "Uncategorized",
        imageUrl: data.imageUrl || "https://example.com/default-image.jpg", // Example placeholder
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProductData),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      reset();
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const deleteProduct = async (id) => {
    if (confirm("Are you sure?")) {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products?id=${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="dashboard">
      <h1>Products</h1>
      <div className="header">
        <button className="addButton" onClick={openAddProductModal}>Add More</button>
      </div>
      <div className="productList">
        {products.map((product) => (
          <div className="productCard" key={product._id}>
            <img src={product.imageUrl} alt={product.name} className="productImage" />
            <h3>{product.name}</h3>

            {/* Moved the button group directly under the product name */}
            <div className="buttonGroup">
              <Link href={`/products/${product._id}`}>
                <button className="editButton">Edit</button>
              </Link>
              <button className="deleteButton" onClick={() => deleteProduct(product._id)}>Delete</button>
            </div>

            <div className="productDetails">
              <p className="leftAlign">Code: {product.code}</p>
              <p className="leftAlign">Price (฿): {product.price}</p>
              <p className="leftAlign">Category: {product.category}</p>
              <p className="leftAlign">Description: {product.description}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modalContent">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit(createProduct)} className="formContainer">
              <input {...register("code")} className="formInput" placeholder="Code" />
              <input {...register("name")} className="formInput" placeholder="Name" />
              <input type="number" {...register("price")} className="formInput" placeholder="Price" />
              <select {...register("category")} className="formInput">
                <option value="speaker">Speaker</option>
                <option value="phone">Phone</option>
                <option value="laptop">Laptop</option>
                <option value="headphone">Headphone</option>
              </select>
              <textarea {...register("description")} className="formTextarea" placeholder="Description" />
              <input {...register("imageUrl")} className="formInput" placeholder="Image URL" />
              <div className="modalActions">
                <button type="button" className="cancelButton" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="confirmButton">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
