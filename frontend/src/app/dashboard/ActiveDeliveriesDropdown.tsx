"use client";
import { useState } from "react";
import styles from "./ActiveDeliveriesDropdown.module.css";
import Link from "next/link";

const activeOrders = [
  {
    id: "ORD-001",
    status: "Packed",
    eta: "12 min",
    trackerUrl: "/tracker/ORD-001",
    canCancel: true,
  },
  {
    id: "ORD-002",
    status: "In Flight",
    eta: "7 min",
    trackerUrl: "/tracker/ORD-002",
    canCancel: false,
  },
  {
    id: "ORD-003",
    status: "Nearing Delivery",
    eta: "2 min",
    trackerUrl: "/tracker/ORD-003",
    canCancel: false,
  },
];

export default function ActiveDeliveriesDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <section className={styles.activeDeliveriesSection}>
      <button
        className={styles.dropdownButton}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="active-deliveries-dropdown"
      >
        Active Deliveries
        <span className={open ? styles.arrowUp : styles.arrowDown} />
      </button>
      {open && (
        <div
          className={styles.dropdownContent}
          id="active-deliveries-dropdown"
        >
          {activeOrders.length === 0 ? (
            <div className={styles.empty}>No active deliveries at the moment.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>ETA</th>
                  <th>Live Tracker</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      <span
                        className={
                          styles[
                            order.status.replace(/\s/g, "").toLowerCase()
                          ] || styles.status
                        }
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{order.eta}</td>
                    <td>
                      <Link href={order.trackerUrl} className={styles.trackerLink}>
                        View Tracker
                      </Link>
                    </td>
                    <td>
                      {order.canCancel ? (
                        <button className={styles.cancelBtn}>Cancel</button>
                      ) : (
                        <button className={styles.supportBtn}>Contact Support</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
