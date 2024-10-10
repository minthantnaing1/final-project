"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchProducts = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products`);
    const data = await response.json();
    setProducts(data.slice(0, 3)); // Show only 3 products
  };

  const fetchCustomers = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customers`);
    const data = await response.json();
    setCustomers(data);
  };

  const handleBuy = (product) => {
    const existingItem = cart.find(item => item.product._id === product._id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity: 1, price: product.price }]);
    }
  };

  const handleCheckout = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    for (const item of cart) {
      const newOrder = {
        orderId: `order-${Date.now()}`,
        product: item.product._id,
        customer: selectedCustomer,
        quantity: item.quantity,
        price: item.price,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        alert("Failed to checkout");
        return;
      }
    }

    alert("Order successfully placed");
    setCart([]);
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  return (
    <div className="dashboard">
      <h1>Orders</h1>
      <div className="header">
        <Link href="/products">
          <button className="addButton">Go to Products</button>
        </Link>
        <Link href="/customers">
          <button className="addButton">Go to Customers</button>
        </Link>
      </div>

      <div className="productList">
        {products.map((product) => (
          <div className="productCard" key={product._id}>
            <img src={product.imageUrl} alt={product.name} className="productImage" />
            <h3>{product.name}</h3>
            <button className="buyButton" onClick={() => handleBuy(product)}>Buy</button>
          </div>
        ))}
      </div>

      <div className="checkoutSection">
        <h2>Checkout</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.product.name} - Quantity: {item.quantity}, Price: ฿{item.price}
            </li>
          ))}
        </ul>
        <p>Total Quantity: {cart.reduce((acc, item) => acc + item.quantity, 0)}</p>
        <p>Total Price: ฿{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</p>
        <select onChange={(e) => setSelectedCustomer(e.target.value)}>
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.name} ({customer.customerId})
            </option>
          ))}
        </select>
        <button onClick={handleCheckout} className="checkoutButton">Checkout</button>
      </div>
    </div>
  );
}
