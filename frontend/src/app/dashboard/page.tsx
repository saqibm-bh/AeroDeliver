
"use client";


import ResponsiveLayout from "./support/responsive-layout";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <ResponsiveLayout>
      <section className={styles.dashboardCard}>
        <h1 className={styles.title}>Welcome to your Dashboard</h1>
        <p className={styles.subtitle}>Here you can view your drone activity and manage your account.</p>
        <div className={styles.stats}>
          <div className={styles.statBox}>
            <div className={styles.statValue}>3</div>
            <div className={styles.statLabel}>Active Drones</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statValue}>12</div>
            <div className={styles.statLabel}>Deliveries</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statValue}>98%</div>
            <div className={styles.statLabel}>Success Rate</div>
          </div>
        </div>
        <div className={styles.dashboardActions}>
          <button className={styles.button}>
            Launch New Delivery
          </button>
          <button className={styles.buttonSecondary}>
            Show Order History
          </button>
        </div>
      </section>
    </ResponsiveLayout>
  );
}
