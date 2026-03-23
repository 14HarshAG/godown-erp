import React, { useEffect, useState } from "react";
import axios from "axios";

function Inventory() {

    const [inventory, setInventory] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState("");
    const [lowStockProducts, setLowStockProducts] = useState([]);




    useEffect(() => {
        fetchInventory();
    }, [page, search]);

    const fetchInventory = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `https://godown-erp-backend.onrender.com/api/Inventory/history?page=${page}&pageSize=${pageSize}&search=${search}`
                ,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setInventory(response.data.data);
            setTotalRecords(response.data.totalRecords);

        } catch (error) {
            console.error("Inventory fetch error", error);
        }
    };


    return (
        <div className="page-container">

            <h2 className="dashboard-title">Inventory History</h2>
            <div style={{ marginBottom: "15px" }}>

                <input
                    type="text"
                    placeholder="Search product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: "8px",
                        width: "250px",
                        borderRadius: "6px",
                        border: "1px solid #ccc"
                    }}
                />

            </div>


            <table className="inventory-table">

                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>User</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>

                    {inventory.map((item, index) => (
                        <tr key={index}>
                            <td>{item.product}</td>
                            <td className={item.type === "IN" ? "type-in" : "type-out"}>
                                {item.type}
                            </td>
                            <td>{item.quantity}</td>
                            <td>{item.user}</td>
                            <td>{new Date(item.date).toLocaleString()}</td>
                        </tr>
                    ))}

                </tbody>
                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>

                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page}
                    </span>

                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page * pageSize >= totalRecords}
                    >
                        Next
                    </button>

                </div>


            </table>

        </div>
    );
}

export default Inventory;