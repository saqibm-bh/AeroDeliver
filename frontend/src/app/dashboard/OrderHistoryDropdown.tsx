"use client";
import { useState } from "react";

export default function OrderHistoryDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ width: "100%", marginTop: "2.5rem" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: open
            ? "linear-gradient(90deg, #2563eb 0%, #ff576e 100%)"
            : "#2563eb",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1.1rem",
          border: "none",
          borderRadius: 8,
          padding: "0.7rem 1.5rem",
          cursor: "pointer",
          boxShadow: open ? "0 2px 8px #ff576e33" : "0 2px 8px #2563eb33",
          transition: "background 0.2s, box-shadow 0.2s",
          width: "100%",
          textAlign: "left",
          marginBottom: open ? 16 : 0,
        }}
        aria-expanded={open}
        aria-controls="order-history-table"
      >
        {open ? "Hide Order History" : "Show Order History"}
      </button>
      {open && (
        <div
          id="order-history-table"
          style={{ width: "100%", overflowX: "auto", marginTop: "0.5rem" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
            <thead>
              <tr style={{ background: "#f7f8fa", color: "#2563eb", fontWeight: 600 }}>
                <th style={{ padding: "0.75rem", borderBottom: "2px solid #aaa9bc", textAlign: "left" }}>Date & Time</th>
                <th style={{ padding: "0.75rem", borderBottom: "2px solid #aaa9bc", textAlign: "left" }}>Delivery Type</th>
                <th style={{ padding: "0.75rem", borderBottom: "2px solid #aaa9bc", textAlign: "left" }}>Status</th>
                <th style={{ padding: "0.75rem", borderBottom: "2px solid #aaa9bc", textAlign: "right" }}>Price</th>
                <th style={{ padding: "0.75rem", borderBottom: "2px solid #aaa9bc", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Example orders, replace with real data as needed */}
              <tr>
                <td style={{ padding: "0.7rem 0.5rem" }}>2025-08-01 14:30</td>
                <td style={{ padding: "0.7rem 0.5rem" }}>Food</td>
                <td style={{ padding: "0.7rem 0.5rem", color: "#2563eb", fontWeight: 600 }}>Delivered</td>
                <td style={{ padding: "0.7rem 0.5rem", textAlign: "right" }}>$12.99</td>
                <td style={{ padding: "0.7rem 0.5rem", textAlign: "center" }}>
                  <button style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 600, cursor: "pointer", marginRight: 8 }}>Invoice</button>
                  <button style={{ background: "#ff576e", border: "none", color: "#fff", borderRadius: 6, padding: "0.3rem 0.8rem", fontWeight: 600, cursor: "pointer" }}>Reorder</button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.7rem 0.5rem" }}>2025-07-28 09:10</td>
                <td style={{ padding: "0.7rem 0.5rem" }}>Documents</td>
                <td style={{ padding: "0.7rem 0.5rem", color: "#aaa9bc", fontWeight: 600 }}>Cancelled</td>
                <td style={{ padding: "0.7rem 0.5rem", textAlign: "right" }}>$5.50</td>
                <td style={{ padding: "0.7rem 0.5rem", textAlign: "center" }}>
                  <button style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 600, cursor: "pointer", marginRight: 8 }}>Invoice</button>
                  <button style={{ background: "#ff576e", border: "none", color: "#fff", borderRadius: 6, padding: "0.3rem 0.8rem", fontWeight: 600, cursor: "pointer" }}>Reorder</button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.7rem 0.5rem" }}>2025-07-20 18:45</td>
                <td style={{ padding: "0.7rem 0.5rem" }}>Groceries</td>
                <td style={{ padding: "0.7rem 0.5rem", color: "#2563eb", fontWeight: 600 }}>Delivered</td>
                <td style={{ padding: "0.7rem 0.5rem", textAlign: "right" }}>$23.40</td>
                <td style={{ padding: "0.7rem 0.5rem", textAlign: "center" }}>
                  <button style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 600, cursor: "pointer", marginRight: 8 }}>Invoice</button>
                  <button style={{ background: "#ff576e", border: "none", color: "#fff", borderRadius: 6, padding: "0.3rem 0.8rem", fontWeight: 600, cursor: "pointer" }}>Reorder</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
