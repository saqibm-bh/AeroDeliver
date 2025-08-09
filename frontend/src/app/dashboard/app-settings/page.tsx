"use client";

import { useState, useEffect } from "react";
import DashboardMenu from "../DashboardMenu";
import styles from "../dashboard.module.css";
import ResponsiveLayout from "../support/responsive-layout";

export default function AppSettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined" && document.body) {
      if (darkMode) {
        document.body.classList.add("dark-mode");
        console.log("Dark mode enabled. Body classes:", document.body.className);
      } else {
        document.body.classList.remove("dark-mode");
        console.log("Dark mode disabled. Body classes:", document.body.className);
      }
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ResponsiveLayout>
      <div className={styles.dashboardRoot}>
        <DashboardMenu />
        <main className={styles.profileMainContent}>
          <h1 className={styles.title}>App Settings</h1>
          <p className={styles.subtitle}>Manage your application preferences.</p>
          <button className={styles.button} onClick={toggleDarkMode}>
            {darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
          </button>
        </main>
      </div>
    </ResponsiveLayout>
  );
}
