"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./sidebar.module.css";
import {
  Home,
  Plus,
  Package,
  MapPin,
  CreditCard,
  User,
  Bookmark,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "New Delivery", href: "/dashboard/new-delivery", icon: Plus },
  { label: "My Deliveries", href: "/dashboard/my-deliveries", icon: Package },
  { label: "Live Drone Tracking", href: "/dashboard/drone-tracking", icon: MapPin },
  { label: "Invoices & Payments", href: "/dashboard/billing", icon: CreditCard },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Saved Addresses", href: "/dashboard/saved-addresses", icon: Bookmark },
  { label: "Support", href: "/dashboard/support", icon: HelpCircle },
  { label: "App Settings", href: "/dashboard/app-settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandName}>AerDeliver</div>
        <div className={styles.brandTagline}>Fast & Reliable</div>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.list}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.link} ${isActive ? styles.active : ""}`}
                >
                  <Icon className={styles.icon} size={18} />
                  <span className={styles.label}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.footer}>
        <Link href="/logout" className={styles.logout}>
          <LogOut className={styles.logoutIcon} size={18} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}