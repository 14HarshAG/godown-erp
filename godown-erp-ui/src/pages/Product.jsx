import React, { useEffect, useState } from "react";
import axios from "axios";

function Product() {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://localhost:7289/api/Products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(response.data);

    } catch (err) {
      console.error(err);
      setError("Error fetching products");
    }
  };

  return (
    <div className="page-container">
      <div className="card">

        <h2>Products Management</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
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
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}

export default Product;