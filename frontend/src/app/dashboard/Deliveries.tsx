"use client";
import { useState } from "react";
import styles from "./deliveries.module.css";

interface ActiveDelivery {
  id: string;
  type: string;
  icon: string;
  priority: string;
  status: string;
  progress: number;
  eta: string;
  from: string;
  to: string;
  drone: string;
  battery: number;
  weight: string;
  distance: string;
  isActive: true;
}

interface CompletedDelivery {
  id: string;
  type: string;
  icon: string;
  priority: string;
  status: string;
  completedTime: string;
  from: string;
  to: string;
  drone: string;
  weight: string;
  distance: string;
  isActive?: false;
}

interface CancelledDelivery {
  id: string;
  type: string;
  icon: string;
  priority: string;
  status: string;
  reason: string;
  from: string;
  to: string;
  weight: string;
  distance: string;
  isActive?: false;
}

export default function Deliveries() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock delivery data
  const deliveryStats = {
    active: 3,
    completed: 2,
    avgTime: "18m",
    successRate: "98%"
  };

  const deliveries: ActiveDelivery[] = [
    {
      id: "DRN-2025-001",
      type: "Medical Emergency Kit",
      icon: "🏥",
      priority: "High",
      status: "In Transit",
      progress: 85,
      eta: "8 minutes",
      from: "Central Medical Hub",
      to: "456 Oak Street, Apt 12B",
      drone: "SKY-07",
      battery: 87,
      weight: "2.5 kg",
      distance: "3.2 km",
      isActive: true
    },
    {
      id: "DRN-2025-002",
      type: "Electronics Package",
      icon: "📦",
      priority: "Standard",
      status: "Preparing",
      progress: 15,
      eta: "25 minutes",
      from: "TechMart Warehouse",
      to: "789 Pine Ave, Suite 5A",
      drone: "SKY-12",
      battery: 92,
      weight: "1.8 kg",
      distance: "5.7 km",
      isActive: true
    },
    {
      id: "DRN-2025-003",
      type: "Grocery Essentials",
      icon: "✈️",
      priority: "Standard",
      status: "Dispatched",
      progress: 95,
      eta: "12 minutes",
      from: "FreshMart Store",
      to: "321 Elm Street, House 7",
      drone: "SKY-03",
      battery: 78,
      weight: "4.2 kg",
      distance: "2.1 km",
      isActive: true
    }
  ];

  const completedDeliveries: CompletedDelivery[] = [
    {
      id: "DRN-2025-004",
      type: "Medical Supplies",
      icon: "🏥",
      priority: "High",
      status: "Delivered",
      completedTime: "2 hours ago",
      from: "Central Medical Hub",
      to: "123 Main Street",
      drone: "SKY-05",
      weight: "1.2 kg",
      distance: "2.8 km"
    },
    {
      id: "DRN-2025-005",
      type: "Food Package",
      icon: "🍽️",
      priority: "Standard",
      status: "Delivered",
      completedTime: "4 hours ago",
      from: "QuickBite Restaurant",
      to: "567 Broadway Ave",
      drone: "SKY-09",
      weight: "0.8 kg",
      distance: "1.5 km"
    }
  ];

  const cancelledDeliveries: CancelledDelivery[] = [
    {
      id: "DRN-2025-006",
      type: "Package Delivery",
      icon: "📦",
      priority: "Standard",
      status: "Cancelled",
      reason: "Weather conditions",
      from: "Local Store",
      to: "890 Center St",
      weight: "3.1 kg",
      distance: "4.2 km"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Transit":
        return "#3b82f6";
      case "Preparing":
        return "#f59e0b";
      case "Dispatched":
        return "#10b981";
      case "Delivered":
        return "#10b981";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#ef4444";
      case "Standard":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const getCurrentDeliveries = (): (ActiveDelivery | CompletedDelivery | CancelledDelivery)[] => {
    switch (activeTab) {
      case "active":
        return deliveries;
      case "completed":
        return completedDeliveries;
      case "cancelled":
        return cancelledDeliveries;
      default:
        return deliveries;
    }
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "active":
        return deliveryStats.active;
      case "completed":
        return deliveryStats.completed;
      case "cancelled":
        return 1;
      default:
        return 0;
    }
  };

  return (
    <div className={styles.deliveriesContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.headerTitle}>My Deliveries</h1>
            <p className={styles.headerSubtitle}>Track and manage all your drone deliveries</p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{deliveryStats.active}</div>
              <div className={styles.statLabel}>Active</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{deliveryStats.completed}</div>
              <div className={styles.statLabel}>Completed</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{deliveryStats.avgTime}</div>
              <div className={styles.statLabel}>Avg. Time</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{deliveryStats.successRate}</div>
              <div className={styles.statLabel}>Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputContainer}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search deliveries by ID, item, or destination..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.filterButton}>
              🔽 Filter
            </button>
            <button className={styles.refreshButton}>
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className={styles.tabsSection}>
        <button
          className={`${styles.tabButton} ${activeTab === "active" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("active")}
        >
          <span className={styles.tabIcon}>⚡</span>
          Active ({getTabCount("active")})
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "completed" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          <span className={styles.tabIcon}>✅</span>
          Completed ({getTabCount("completed")})
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "cancelled" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("cancelled")}
        >
          <span className={styles.tabIcon}>❌</span>
          Cancelled ({getTabCount("cancelled")})
        </button>
      </div>

      {/* Deliveries List */}
      <div className={styles.deliveriesList}>
        {getCurrentDeliveries().map((delivery) => (
          <div key={delivery.id} className={styles.deliveryCard}>
            <div className={styles.deliveryHeader}>
              <div className={styles.deliveryIdSection}>
                <div className={styles.deliveryIcon}>{delivery.icon}</div>
                <div className={styles.deliveryIdInfo}>
                  <h3 className={styles.deliveryId}>{delivery.id}</h3>
                  <p className={styles.deliveryType}>{delivery.type}</p>
                </div>
              </div>
              <div className={styles.deliveryBadges}>
                <span 
                  className={styles.priorityBadge}
                  style={{ backgroundColor: getPriorityColor(delivery.priority) }}
                >
                  {delivery.priority}
                </span>
                <span 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(delivery.status) }}
                >
                  {delivery.status}
                </span>
              </div>
            </div>

            {activeTab === "active" && (
              <>
                <div className={styles.progressSection}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>Delivery Progress</span>
                    <span className={styles.progressEta}>⏰ ETA: {(delivery as ActiveDelivery).eta}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${(delivery as ActiveDelivery).progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className={styles.deliveryDetails}>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailColumn}>
                      <div className={styles.detailLabel}>From</div>
                      <div className={styles.detailValue}>{delivery.from}</div>
                    </div>
                    <div className={styles.detailColumn}>
                      <div className={styles.detailLabel}>To</div>
                      <div className={styles.detailValue}>{delivery.to}</div>
                    </div>
                    <div className={styles.detailColumn}>
                      <div className={styles.detailLabel}>Drone</div>
                      <div className={styles.detailValue}>
                        {(delivery as ActiveDelivery).drone} 🔋 {(delivery as ActiveDelivery).battery}%
                      </div>
                    </div>
                    <div className={styles.detailColumn}>
                      <div className={styles.detailLabel}>Details</div>
                      <div className={styles.detailValue}>
                        {delivery.weight} • {delivery.distance}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.deliveryActions}>
                  <button className={styles.actionButtonPrimary}>
                    👁️ Track Live
                  </button>
                  <button className={styles.actionButtonSecondary}>
                    💬 Contact Support
                  </button>
                  <button className={styles.actionButtonMore}>
                    ⋯ More
                  </button>
                </div>
              </>
            )}

            {activeTab === "completed" && (
              <>
                <div className={styles.completedDetails}>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailColumn}>
                      <div className={styles.detailLabel}>From</div>
                      <div className={styles.detailValue}>{delivery.from}</div>
                    </div>
                    <div className={styles.detailColumn}>
                      <div className={styles.detailLabel}>To</div>
                      <div className={styles.detailValue}>{delivery.to}</div>
                    </div>
                    <div className={styles.detailColumn}>
                      <div className={styles.detailLabel}>Drone</div>
                      <div className={styles.detailValue}>{(delivery as CompletedDelivery).drone}</div>
                    </div>
                    <div className={styles.detailColumn}>
                      <div className={styles.detailLabel}>Details</div>
                      <div className={styles.detailValue}>
                        {delivery.weight} • {delivery.distance}
                      </div>
                    </div>
                  </div>
                  <div className={styles.completedTime}>
                    Completed {(delivery as CompletedDelivery).completedTime}
                  </div>
                </div>

                <div className={styles.deliveryActions}>
                  <button className={styles.actionButtonSecondary}>
                    📋 View Details
                  </button>
                  <button className={styles.actionButtonSecondary}>
                    🔄 Reorder
                  </button>
                  <button className={styles.actionButtonMore}>
                    ⋯ More
                  </button>
                </div>
              </>
            )}

            {activeTab === "cancelled" && (
              <>
                <div className={styles.cancelledDetails}>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailColumn}>
                      <div className={styles.detailLabel}>From</div>
                      <div className={styles.detailValue}>{delivery.from}</div>
                    </div>
                    <div className={styles.detailColumn}>
                      <div className={styles.detailLabel}>To</div>
                      <div className={styles.detailValue}>{delivery.to}</div>
                    </div>
                    <div className={styles.detailColumn}>
                      <div className={styles.detailLabel}>Reason</div>
                      <div className={styles.detailValue}>{(delivery as CancelledDelivery).reason}</div>
                    </div>
                    <div className={styles.detailColumn}>
                      <div className={styles.detailLabel}>Details</div>
                      <div className={styles.detailValue}>
                        {delivery.weight} • {delivery.distance}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.deliveryActions}>
                  <button className={styles.actionButtonSecondary}>
                    🔄 Reschedule
                  </button>
                  <button className={styles.actionButtonSecondary}>
                    💬 Contact Support
                  </button>
                  <button className={styles.actionButtonMore}>
                    ⋯ More
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
