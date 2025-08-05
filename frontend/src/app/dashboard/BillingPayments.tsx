"use client";
import { useState } from "react";
import styles from "./dashboard.module.css";

export default function BillingPayments() {
  const [activeTab, setActiveTab] = useState("invoices");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Mock data
  const billingStats = {
    totalSpent: "$1247.89",
    thisMonth: "$156.24",
    pending: "$18.50",
    deliveries: 47
  };

  const deliveryPerformance = {
    onTimeRate: 94,
    avgDeliveryTime: "22 min"
  };

  const recentActivity = [
    {
      title: "Drone Delivery - Electronics",
      date: "Aug 5, 2024",
      amount: "$24.99",
      status: "Completed"
    },
    {
      title: "Drone Delivery - Medical",
      date: "Aug 4, 2024",
      amount: "$18.50",
      status: "Pending"
    },
    {
      title: "Drone Delivery - Documents",
      date: "Aug 3, 2024",
      amount: "$12.75",
      status: "Completed"
    }
  ];

  const invoices = [
    {
      id: "INV-001",
      orderId: "DR-2024-08051",
      date: "Aug 5, 2024",
      drone: "DRN-001",
      amount: "$24.99",
      deliveredTo: "123 Main Street, Downtown District",
      items: "Electronics Package, Documents",
      status: "Paid"
    },
    {
      id: "INV-002",
      orderId: "DR-2024-08052",
      date: "Aug 4, 2024",
      drone: "DRN-002",
      amount: "$18.50",
      deliveredTo: "456 Oak Avenue, Suburbs",
      items: "Medical Supplies",
      due: "Aug 9, 2024",
      status: "Pending"
    }
  ];

  const handleExportAll = () => {
    alert("Exporting all data...");
  };

  const handleBillingHistory = () => {
    alert("Opening billing history...");
  };

  return (
    <div className={styles.billingContainer}>
      {/* Header Section */}
      <div className={styles.billingHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.billingIcon}>💰</div>
          <div>
            <h1 className={styles.billingTitle}>Billing & Payments</h1>
            <p className={styles.billingSubtitle}>Manage your drone delivery invoices and payment methods</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.exportBtn} onClick={handleExportAll}>
            📥 Export All
          </button>
          <button className={styles.historyBtn} onClick={handleBillingHistory}>
            📋 Billing History
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className={styles.statsCards}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#10B981' }}>💵</div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Total Spent</div>
            <div className={styles.statValue}>{billingStats.totalSpent}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#3B82F6' }}>📈</div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>This Month</div>
            <div className={styles.statValue}>{billingStats.thisMonth}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#F59E0B' }}>⏳</div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Pending</div>
            <div className={styles.statValue}>{billingStats.pending}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#8B5CF6' }}>📦</div>
          <div className={styles.statInfo}>
            <div className={styles.statLabel}>Deliveries</div>
            <div className={styles.statValue}>{billingStats.deliveries}</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.billingMainContent}>
        {/* Delivery Performance */}
        <div className={styles.performanceSection}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>✅</span>
            Delivery Performance
          </h3>
          <div className={styles.performanceContent}>
            <div className={styles.performanceItem}>
              <div className={styles.performanceLabel}>On-time Delivery Rate</div>
              <div className={styles.performanceValue}>{deliveryPerformance.onTimeRate}%</div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${deliveryPerformance.onTimeRate}%` }}
                ></div>
              </div>
            </div>
            <div className={styles.performanceItem}>
              <div className={styles.performanceLabel}>Average Delivery Time</div>
              <div className={styles.performanceValue}>{deliveryPerformance.avgDeliveryTime}</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.activitySection}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📋</span>
            Recent Activity
          </h3>
          <div className={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityInfo}>
                  <div className={styles.activityTitle}>{activity.title}</div>
                  <div className={styles.activityDate}>{activity.date}</div>
                </div>
                <div className={styles.activityRight}>
                  <div className={styles.activityAmount}>{activity.amount}</div>
                  <span className={`${styles.activityStatus} ${styles[activity.status.toLowerCase()]}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabButtons}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'invoices' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            📄 Invoices
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'payment-methods' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('payment-methods')}
          >
            💳 Payment Methods
          </button>
        </div>
      </div>

      {/* Invoice Management Section */}
      <div className={styles.invoiceSection}>
        <div className={styles.invoiceHeader}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📄</span>
            Invoice Management
          </h3>
        </div>

        <div className={styles.invoiceControls}>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search invoices or orders..."
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterContainer}>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.statusFilter}
            >
              <option>All Statuses</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className={styles.statusSummary}>
          <div className={styles.summaryCard} style={{ backgroundColor: '#D1FAE5' }}>
            <div className={styles.summaryNumber}>1</div>
            <div className={styles.summaryLabel}>Paid Invoices</div>
          </div>
          <div className={styles.summaryCard} style={{ backgroundColor: '#FEF3C7' }}>
            <div className={styles.summaryNumber}>1</div>
            <div className={styles.summaryLabel}>Pending Payment</div>
          </div>
          <div className={styles.summaryCard} style={{ backgroundColor: '#FEE2E2' }}>
            <div className={styles.summaryNumber}>1</div>
            <div className={styles.summaryLabel}>Overdue</div>
          </div>
        </div>

        {/* Invoice List */}
        <div className={styles.invoiceList}>
          {invoices.map((invoice, index) => (
            <div key={index} className={styles.invoiceItem}>
              <div className={styles.invoiceLeft}>
                <div className={styles.invoiceMainInfo}>
                  <div className={styles.invoiceId}>
                    📄 Invoice #{invoice.id}
                    <span className={`${styles.invoiceStatus} ${styles[invoice.status.toLowerCase()]}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className={styles.invoiceOrder}>Order {invoice.orderId}</div>
                </div>

                <div className={styles.invoiceDetails}>
                  <div className={styles.invoiceDetail}>
                    <span className={styles.detailIcon}>📅</span>
                    <span className={styles.detailLabel}>Date:</span>
                    <span className={styles.detailValue}>{invoice.date}</span>
                  </div>
                  <div className={styles.invoiceDetail}>
                    <span className={styles.detailIcon}>🚁</span>
                    <span className={styles.detailLabel}>Drone:</span>
                    <span className={styles.detailValue}>{invoice.drone}</span>
                  </div>
                  <div className={styles.invoiceDetail}>
                    <span className={styles.detailIcon}>💰</span>
                    <span className={styles.detailLabel}>Amount:</span>
                    <span className={styles.detailValue}>{invoice.amount}</span>
                  </div>
                </div>

                <div className={styles.invoiceDetails}>
                  <div className={styles.invoiceDetail}>
                    <span className={styles.detailIcon}>📍</span>
                    <span className={styles.detailLabel}>Delivered to:</span>
                    <span className={styles.detailValue}>{invoice.deliveredTo}</span>
                  </div>
                  <div className={styles.invoiceDetail}>
                    <span className={styles.detailIcon}>📦</span>
                    <span className={styles.detailLabel}>Items:</span>
                    <span className={styles.detailValue}>{invoice.items}</span>
                  </div>
                  {invoice.due && (
                    <div className={styles.invoiceDetail}>
                      <span className={styles.detailIcon}>⏰</span>
                      <span className={styles.detailLabel}>Due:</span>
                      <span className={styles.detailValue}>{invoice.due}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.invoiceActions}>
                <button className={styles.actionButton}>
                  👁️ View
                </button>
                <button className={styles.actionButton}>
                  📥 Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
