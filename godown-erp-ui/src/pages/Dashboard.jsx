import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function Dashboard() {

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalVendors: 0,
    totalStock: 0,
    inventoryValue: 0
  });

  const [movementData, setMovementData] = useState([]);
   const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchInventoryMovement();
    fetchLowStockProducts();
  }, []);

  const fetchDashboardStats = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://godown-erp-backend.onrender.com/api/Dashboard/summary",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setStats({
        totalProducts: response.data.totalProducts,
        totalVendors: response.data.totalVendors,
        totalStock: response.data.totalStock,
        inventoryValue: response.data.inventoryValue
      });

    } catch (error) {
      console.error("Dashboard stats error", error);
    }
  };
  const fetchLowStockProducts = async () => {

  try {

    const token = localStorage.getItem("token");

    const response = await axios.get(
      "https://godown-erp-backend.onrender.com/api/Products/low-stock",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setLowStockProducts(response.data);

  } catch (error) {
    console.error("Low stock fetch error", error);
  }

};


  const fetchInventoryMovement = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://godown-erp-backend.onrender.com/api/Inventory/movement",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = [
        {
          name: "Today",
          IN: response.data.stockInToday,
          OUT: response.data.stockOutToday
        },
        {
          name: "This Week",
          IN: response.data.stockInThisWeek,
          OUT: response.data.stockOutThisWeek
        }
      ];

      setMovementData(data);

    } catch (error) {
      console.error("Inventory movement error", error);
    }
    
  };

  return (
    <div className="page-container">

      <h2 className="dashboard-title">Dashboard</h2>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Vendors</h3>
          <p>{stats.totalVendors}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Stock</h3>
          <p>{stats.totalStock}</p>
        </div>

        <div className="dashboard-card">
          <h3>Inventory Value</h3>
          <p>₹ {stats.inventoryValue}</p>
        </div>

      </div>

      {/* Inventory Movement Chart */}

      <div
        style={{
          marginTop: "40px",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px"
        }}
      >
        <h3>Inventory Movement</h3>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={movementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="IN" fill="#10B981" />
            <Bar dataKey="OUT" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
        {lowStockProducts.length > 0 && (

  <div
    style={{
      marginTop: "30px",
      background: "#fff3cd",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #ffeeba"
    }}
  >

    <h3>⚠ Low Stock Products</h3>

    <ul>

      {lowStockProducts.map((product, index) => (

        <li key={index}>
          {product.name} — Remaining: {product.stockQuantity}
        </li>

      ))}

    </ul>

  </div>

)}


      </div>

    </div>

  );
}

export default Dashboard;