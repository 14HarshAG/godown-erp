import React, { useEffect, useState } from "react";
import axios from "axios";

function Vendors() {

  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://godown-erp-backend.onrender.com/api/Vendors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVendors(response.data);

    } catch (err) {

      console.error(err);

      if (err.response) {

        if (err.response.status === 401) {
          setError("Unauthorized (401)");
        } else if (err.response.status === 403) {
          setError("Forbidden (403)");
        } else {
          setError("Error fetching vendors");
        }

      } else {
        setError("Server not reachable");
      }

    }
  };

  const handleEdit = (vendor) => {

    setNewVendor({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address
    });

    setEditingId(vendor.id);
    setShowForm(true);

  };

  const deleteVendor = async (id) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this vendor?");
    if (!confirmDelete) return;

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `https://godown-erp-backend.onrender.com/api/Vendors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchVendors();

    } catch (err) {

      console.error(err);
      alert("Error deleting vendor");

    }

  };

  const handleCreateVendor = async () => {

    try {

      const token = localStorage.getItem("token");

      if (editingId) {

        // UPDATE VENDOR
        await axios.put(
          `https://godown-erp-backend.onrender.com/api/Vendors/${editingId}`,
          newVendor,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      } else {

        // CREATE VENDOR
        await axios.post(
          "https://godown-erp-backend.onrender.com/api/Vendors",
          newVendor,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      }

      setNewVendor({
        name: "",
        email: "",
        phone: "",
        address: ""
      });

      setEditingId(null);
      setShowForm(false);

      fetchVendors();

    } catch (err) {

      console.error(err);
      alert("Error saving vendor");

    }

  };

  return (
    <div>

      <h2>Vendors Management</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          marginTop: "10px",
          padding: "8px 12px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        {showForm ? "Cancel" : "+ Create Vendor"}
      </button>

      {showForm && (
        <div
          style={{
            marginTop: "20px",
            background: "white",
            padding: "20px",
            borderRadius: "8px"
          }}
        >

          <h3>{editingId ? "Edit Vendor" : "Create New Vendor"}</h3>

          <input
            placeholder="Name"
            value={newVendor.name}
            onChange={(e) =>
              setNewVendor({ ...newVendor, name: e.target.value })
            }
          />

          <input
            placeholder="Email"
            value={newVendor.email}
            onChange={(e) =>
              setNewVendor({ ...newVendor, email: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            value={newVendor.phone}
            onChange={(e) =>
              setNewVendor({ ...newVendor, phone: e.target.value })
            }
          />

          <input
            placeholder="Address"
            value={newVendor.address}
            onChange={(e) =>
              setNewVendor({ ...newVendor, address: e.target.value })
            }
          />

          <br /><br />

          <button
            onClick={handleCreateVendor}
            style={{
              padding: "8px 12px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Save Vendor
          </button>

        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table
        border="1"
        cellPadding="10"
        style={{ marginTop: "20px", width: "100%", background: "white" }}
      >

        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {vendors.length > 0 ? (

            vendors.map((vendor) => (

              <tr key={vendor.id}>

                <td>{vendor.id}</td>
                <td>{vendor.name}</td>
                <td>{vendor.email}</td>
                <td>{vendor.phone}</td>

                <td>

                  <button
                    onClick={() => handleEdit(vendor)}
                    style={{
                      background: "#f59e0b",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      marginRight: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteVendor(vendor.id)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No Vendors Found
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default Vendors;