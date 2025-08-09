"use client";

import { useState } from "react";
import styles from "./responsive-layout.module.css";

import { ReactNode } from "react";

const menuItems = [
  { label: "Home", href: "/dashboard" },
  { label: "New Delivery", href: "/dashboard/new-delivery" },
  { label: "My Deliveries", href: "/dashboard/my-deliveries" },
  { label: "Live Drone Tracking", href: "/dashboard/drone-tracking" },
  { label: "Invoices & Payments", href: "/dashboard/billing" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Saved Addresses", href: "/dashboard/saved-addresses" },
  { label: "Support", href: "/dashboard/support" },
  { label: "App Settings", href: "/dashboard/app-settings" },
  { label: "Logout", href: "/logout" },
];

interface ResponsiveLayoutProps {
  children?: ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={styles.container}>
      <aside
        className={
          isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebar
        }
      >
        <button className={styles.toggleButton} onClick={toggleSidebar}>
          {isSidebarCollapsed ? ">" : "<"}
        </button>
        <nav className={styles.menuNav}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.label} className={styles.menuItem}>
                <a href={item.href} className={styles.menuLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
