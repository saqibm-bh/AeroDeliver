// Shared layout for all dashboard pages
"use client";

import { useState } from "react";
import { ReactNode } from "react";
import styles from "./shared-layout.module.css";

const menuItems = [
  { label: "Home", href: "/dashboard", icon: "🏠" },
  { label: "New Delivery", href: "/dashboard/new-delivery", icon: "➕" },
  { label: "My Deliveries", href: "/dashboard/my-deliveries", icon: "📦" },
  { label: "Live Drone Tracking", href: "/dashboard/drone-tracking", icon: "🚁" },
  { label: "Invoices & Payments", href: "/dashboard/billing", icon: "💳" },
  { label: "Profile", href: "/dashboard/profile", icon: "👤" },
  { label: "Saved Addresses", href: "/dashboard/saved-addresses", icon: "📍" },
  { label: "Support", href: "/dashboard/support", icon: "💬" },
  { label: "App Settings", href: "/dashboard/app-settings", icon: "⚙️" },
  { label: "Logout", href: "/logout", icon: "🚪" },
];

interface SharedLayoutProps {
  children?: ReactNode;
  title?: string;
}

export default function SharedLayout({ children, title = "Dashboard" }: SharedLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <aside className={isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>Aero Deliver</h2>
          <button 
            className={styles.toggleButton} 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? ">" : "<"}
          </button>
        </div>
        
        <nav className={styles.menuNav}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.label} className={styles.menuItem}>
                <a href={item.href} className={styles.menuLink}>
                  <span className={styles.menuIcon}>{item.icon}</span>
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      <main className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{title}</h1>
        </header>
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
