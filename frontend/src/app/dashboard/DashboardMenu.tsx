"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./dashboard.module.css";

const menuOptions = [
  { label: "Home", href: "/dashboard" },
  { label: "New Delivery", href: "/dashboard/new-delivery" },
  { label: "My Deliveries", href: "/dashboard/my-deliveries" },
  { label: "Live Drone Tracking", href: "/dashboard/live-tracking" },
  { label: "Invoices & Payments", href: "/dashboard/invoices" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Saved Addresses", href: "/dashboard/saved-addresses" },
  { label: "Support", href: "/dashboard/support" },
  { label: "App Settings", href: "/dashboard/app-settings" },
  { label: "Logout", href: "/logout" },
];

export default function DashboardMenu() {
  const pathname = usePathname();
  return (
    <nav className={styles.menuNav}>
      <ul className={styles.menuList}>
        {menuOptions.map((opt) => (
          <li key={opt.label}>
            <Link
              href={opt.href}
              className={
                pathname === opt.href
                  ? `${styles.menuButton} ${styles.menuButtonActive}`
                  : styles.menuButton
              }
            >
              {opt.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
