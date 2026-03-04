import React from "react";
import "../App.css";

function Dashboard() {
  return (
    <div className="page-container">

      <h2 className="dashboard-title">Dashboard</h2>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Total Products</h3>
          <p>Manage inventory items</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Vendors</h3>
          <p>View supplier list</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Users</h3>
          <p>System users</p>
        </div>

        <div className="dashboard-card">
          <h3>Reports</h3>
          <p>Analytics and insights</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;