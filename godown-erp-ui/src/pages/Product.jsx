import React, { useEffect, useState } from "react";
import axios from "axios";

function Product() {

  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    price: "",
    costPrice: "",
    stockQuantity: "",
    vendorId: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchVendors();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://localhost:7289/api/Products",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProducts(response.data);

    } catch (err) {
      console.error(err);
      setError("Error fetching products");
    }
  };

  // Fetch vendors
  const fetchVendors = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://localhost:7289/api/Vendors",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setVendors(response.data);

    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {

    setNewProduct({
      name: product.name,
      sku: product.sku,
      price: product.price,
      costPrice: product.costPrice,
      stockQuantity: product.stockQuantity,
      vendorId: product.vendorId
    });

    setEditingId(product.id);
    setShowForm(true);
  };

  const deleteProduct = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `https://localhost:7289/api/Products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchProducts();

    } catch (error) {
      setError("Failed to delete product");
    }
  };

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateProduct = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      if (editingId) {

        await axios.put(
          `https://localhost:7289/api/Products/${editingId}`,
          newProduct,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      } else {

        await axios.post(
          "https://localhost:7289/api/Products",
          newProduct,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      }

      setShowForm(false);

      setNewProduct({
        name: "",
        sku: "",
        price: "",
        costPrice: "",
        stockQuantity: "",
        vendorId: ""
      });

      setEditingId(null);

      fetchProducts();

    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  // INCREASE STOCK
  const handleIncreaseStock = async (productId) => {

  const quantity = prompt("Enter quantity to increase:");

  if (!quantity) return;

  try {

    const token = localStorage.getItem("token");

    await axios.post(
      `https://localhost:7289/api/Products/${productId}/increase-stock?quantity=${quantity}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert("Stock increased successfully");

    fetchProducts();

  } catch (error) {
    console.error("Increase stock error", error);
  }
};



  // DECREASE STOCK
const handleDecreaseStock = async (productId) => {

  const quantity = prompt("Enter quantity to decrease:");

  if (!quantity) return;

  try {

    const token = localStorage.getItem("token");

    await axios.post(
      `https://localhost:7289/api/Products/${productId}/decrease-stock?quantity=${quantity}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert("Stock decreased successfully");

    fetchProducts();

  } catch (error) {
    console.error("Decrease stock error", error);
  }
};



  return (
    <div className="page-container">
      <div className="card">

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Products Management</h2>

          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: "8px 14px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            + Create Product
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* CREATE PRODUCT FORM */}

        {showForm && (
          <form onSubmit={handleCreateProduct} style={{ marginBottom: "20px" }}>

            <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleChange} required />

            <input type="text" name="sku" placeholder="SKU" value={newProduct.sku} onChange={handleChange} required />

            <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleChange} required />

            <input type="number" name="costPrice" placeholder="Cost Price" value={newProduct.costPrice} onChange={handleChange} required />

            <input type="number" name="stockQuantity" placeholder="Stock Quantity" value={newProduct.stockQuantity} onChange={handleChange} required />

            <select name="vendorId" value={newProduct.vendorId} onChange={handleChange} required>
              <option value="">Select Vendor</option>

              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>

            <button type="submit">Save Product</button>

          </form>
        )}

        {/* PRODUCTS TABLE */}

        <table>

          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {products.map((product) => (
              <tr key={product.id}>

                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.price}</td>
                <td>{product.stockQuantity}</td>

                <td>

                  <button onClick={() => handleEdit(product)}>Edit</button>

                  <button onClick={() => deleteProduct(product.id)}>Delete</button>

                  <button onClick={() => handleIncreaseStock(product.id)}>
                    + Stock
                  </button>

                  <button onClick={() => handleDecreaseStock(product.id)}>
                    - Stock
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}

export default Product;
