import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Users() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleName, setRoleName] = useState("Staff");

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const fetchUsers = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://localhost:7289/api/Users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async () => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `https://localhost:7289/api/Users/${editingUser.id}`,
        {
          fullName: editingUser.fullName,
          email: editingUser.email,
          isActive: true
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEditingUser(null);
      fetchUsers();

    } catch (error) {
      console.error(error);
      alert("Error updating user");
    }
  };

  const handleCreateUser = async () => {
    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "https://localhost:7289/api/Users",
        {
          fullName: newUser.fullName,
          email: newUser.email,
          password: newUser.password,
          roleName: roleName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setShowForm(false);

      setNewUser({
        fullName: "",
        email: "",
        password: ""
      });

      setRoleName("Staff");

      fetchUsers();

    } catch (error) {
      alert("Error creating user");
    }
  };

  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `https://localhost:7289/api/Users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchUsers();

    } catch (error) {
      console.error(error);
    }

  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="page-container">

      <div style={{ display: "flex", justifyContent: "space-between" }}>

        <div>
          <h2>Users Management</h2>
          <p style={{ color: "#666" }}>Manage system users</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="primary-btn"
        >
          + Create User
        </button>

      </div>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {showForm && (

        <div className="form-card">

          <h3>Create User</h3>

          <input
            placeholder="Full Name"
            value={newUser.fullName}
            onChange={(e) =>
              setNewUser({ ...newUser, fullName: e.target.value })
            }
          />

          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />

          <select
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            style={{ marginTop: "10px", padding: "8px", width: "100%" }}
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>

          <div style={{ marginTop: "10px" }}>

            <button
              onClick={handleCreateUser}
              className="success-btn"
            >
              Save User
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="cancel-btn"
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {editingUser && (

        <div className="form-card">

          <h3>Edit User</h3>

          <input
            placeholder="Full Name"
            value={editingUser.fullName}
            onChange={(e) =>
              setEditingUser({ ...editingUser, fullName: e.target.value })
            }
          />

          <input
            placeholder="Email"
            value={editingUser.email}
            onChange={(e) =>
              setEditingUser({ ...editingUser, email: e.target.value })
            }
          />

          <div style={{ marginTop: "10px" }}>

            <button
              onClick={handleUpdateUser}
              className="success-btn"
            >
              Update User
            </button>

            <button
              onClick={() => setEditingUser(null)}
              className="cancel-btn"
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      <table className="modern-table">

        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {filteredUsers.map(user => (

            <tr key={user.id}>

              <td>
                <div className="avatar">
                  {user.fullName.charAt(0)}
                </div>
              </td>

              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>

              <td>

                <button
                  className="edit-btn"
                  onClick={() => setEditingUser(user)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default Users;