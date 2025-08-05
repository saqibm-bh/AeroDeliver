"use client";
import { useState } from "react";
import styles from "./dashboard.module.css";

const initialAddresses = [
  {
    id: 1,
    label: "Home",
    address: "123 Main St, City, Country",
    isDefault: true,
  },
  {
    id: 2,
    label: "Office",
    address: "456 Business Rd, City, Country",
    isDefault: false,
  },
];

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editing, setEditing] = useState<number|null>(null);
  const [form, setForm] = useState({ label: "", address: "" });
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (id: number) => {
    const addr = addresses.find((a) => a.id === id);
    if (!addr) return;
    setForm({ label: addr.label, address: addr.address });
    setEditing(id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleDefault = (id: number) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editing) {
      setAddresses(addresses.map((a) => (a.id === editing ? { ...a, ...form } : a)));
    } else {
      setAddresses([
        ...addresses,
        { id: Date.now(), ...form, isDefault: addresses.length === 0 },
      ]);
    }
    setForm({ label: "", address: "" });
    setEditing(null);
    setShowForm(false);
  };

  return (
    <section className={styles.profileSection}>
      <h2 className={styles.profileTitle}>Saved Addresses</h2>
      
      <div className={styles.profileForm}>
        <div className={styles.statBox} style={{ marginBottom: "2rem" }}>
          <div className={styles.statValue}>{addresses.length}</div>
          <div className={styles.statLabel}>Saved Locations</div>
        </div>
        
        <button 
          className={styles.button} 
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm({ label: "", address: "" });
          }}
          style={{ marginBottom: "1.5rem" }}
        >
          Add New Address
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className={styles.profileForm} style={{ 
            background: "#000000", 
            border: "1px solid #FFFFFF", 
            borderRadius: "0.75rem", 
            padding: "1.5rem", 
            marginBottom: "1.5rem" 
          }}>
            <input
              className={styles.input}
              placeholder="Label (e.g. Home)"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              required
            />
            <input
              className={styles.input}
              placeholder="Address"
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              required
            />
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button type="submit" className={styles.button}>
                {editing ? "Update" : "Save"}
              </button>
              <button 
                type="button" 
                className={styles.button}
                style={{ 
                  background: "#000000", 
                  color: "#FFFFFF", 
                  border: "1px solid #FFFFFF" 
                }}
                onClick={() => { setShowForm(false); setEditing(null); }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className={styles.profileForm}>
          {addresses.map((addr) => (
            <div key={addr.id} style={{ 
              background: "#000000", 
              border: addr.isDefault ? "2px solid #FFFFFF" : "1px solid #FFFFFF", 
              borderRadius: "0.75rem", 
              padding: "1.5rem", 
              marginBottom: "1rem" 
            }}>
              <h3 className={styles.profileSubtitle} style={{ marginBottom: "0.5rem" }}>
                {addr.label} {addr.isDefault && <span style={{ fontSize: "0.9rem", color: "#FFFFFF" }}>(Default)</span>}
              </h3>
              <p style={{ 
                color: "#FFFFFF", 
                margin: "0 0 1rem 0", 
                fontSize: "1rem",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif"
              }}>
                {addr.address}
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {!addr.isDefault && (
                  <button 
                    className={styles.button}
                    style={{ 
                      background: "#000000", 
                      color: "#FFFFFF", 
                      border: "1px solid #FFFFFF",
                      padding: "0.5rem 1rem",
                      fontSize: "0.9rem"
                    }}
                    onClick={() => handleDefault(addr.id)}
                  >
                    Set Default
                  </button>
                )}
                <button 
                  className={styles.button}
                  style={{ 
                    background: "#000000", 
                    color: "#FFFFFF", 
                    border: "1px solid #FFFFFF",
                    padding: "0.5rem 1rem",
                    fontSize: "0.9rem"
                  }}
                  onClick={() => handleEdit(addr.id)}
                >
                  Edit
                </button>
                <button 
                  className={styles.button}
                  style={{ 
                    background: "#000000", 
                    color: "#FFFFFF", 
                    border: "1px solid #FFFFFF",
                    padding: "0.5rem 1rem",
                    fontSize: "0.9rem"
                  }}
                  onClick={() => handleDelete(addr.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <p style={{ 
          color: "#FFFFFF", 
          fontSize: "1rem", 
          textAlign: "center", 
          marginTop: "1rem",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif"
        }}>
          When placing a new order, your default address will be auto-filled.
        </p>
      </div>
    </section>
  );
}
