"use client";
import { useState } from "react";
import styles from "./drone-tracking.module.css";

export default function LiveDroneTracking() {
  const [lastUpdated, setLastUpdated] = useState("02:46:19 PM");
  const [droneStatus] = useState({
    status: "In Transit",
    battery: 78,
    altitude: "150ft",
    speed: "25 mph"
  });

  const [deliveryTimeline] = useState([
    { step: "Order Confirmed", time: "11:30 AM", completed: true },
    { step: "Package Loaded", time: "11:45 AM", completed: true },
    { step: "In Transit", time: "12:00 PM - Now", completed: true, current: true },
    { step: "Delivery", time: "Est. 12:45 PM", completed: false },
    { step: "Return to Base", time: "Est. 1:15 PM", completed: false }
  ]);

  const [deliveryDetails] = useState({
    orderId: "DR-2024-08051",
    droneId: "DRN-001",
    packageWeight: "2.1 lbs",
    distanceRemaining: "2.3 miles",
    estimatedArrival: "12:45 PM",
    minutesRemaining: "8 minutes remaining"
  });

  const [customerInfo] = useState({
    address: "123 Main Street, Downtown District, City Center"
  });

  const handleRefresh = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
    setLastUpdated(timeString);
  };

  const handleCallCustomer = () => {
    alert("Calling customer...");
  };

  const handleSendMessage = () => {
    alert("Opening message interface...");
  };

  const handleShareLocation = () => {
    alert("Sharing live location with customer...");
  };

  return (
    <div className={styles.droneContainer}>
      {/* Header Section */}
      <div className={styles.droneHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.droneIconHeader}>✈️</div>
          <div>
            <h1 className={styles.droneTitle}>Live Drone Tracking</h1>
            <p className={styles.droneSubtitle}>Real-time monitoring of delivery drone DRN-001</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.lastUpdated}>⚡ Last updated: {lastUpdated}</span>
          <button className={styles.refreshBtn} onClick={handleRefresh}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Status Alert */}
      <div className={styles.statusAlert}>
        <div className={styles.alertContent}>
          <span className={styles.checkIcon}>✓</span>
          <div>
            <strong>Live tracking active</strong>
            <div className={styles.alertSubtext}>- Drone location updates every 3 seconds</div>
          </div>
        </div>
      </div>

      {/* Status Cards Row */}
      <div className={styles.statusCards}>
        <div className={styles.statusCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>●</span>
            <span className={styles.cardLabel}>Status</span>
          </div>
          <div className={styles.cardValue}>{droneStatus.status}</div>
        </div>

        <div className={styles.statusCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>🔋</span>
            <span className={styles.cardLabel}>Battery</span>
          </div>
          <div className={styles.batteryContainer}>
            <div className={styles.batteryBar}>
              <div 
                className={styles.batteryFill} 
                style={{ width: `${droneStatus.battery}%` }}
              ></div>
            </div>
            <span className={styles.batteryPercent}>{droneStatus.battery}%</span>
          </div>
        </div>

        <div className={styles.statusCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>📏</span>
            <span className={styles.cardLabel}>Altitude</span>
          </div>
          <div className={styles.cardValue}>{droneStatus.altitude}</div>
        </div>

        <div className={styles.statusCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>⚡</span>
            <span className={styles.cardLabel}>Speed</span>
          </div>
          <div className={styles.cardValue}>{droneStatus.speed}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainContent}>
        {/* Live Map Section */}
        <div className={styles.mapSection}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📍</span>
            Live Map Tracking
          </h3>
          <div className={styles.mapContainer}>
            <div className={styles.mapContent}>
              {/* Warehouse */}
              <div className={styles.warehouseMarker}>
                <div className={styles.blueMarker}>📦</div>
                <span className={styles.markerLabel}>Warehouse</span>
              </div>

              {/* Drone (Live) */}
              <div className={styles.droneMarker}>
                <div className={styles.greenMarker}>
                  <span className={styles.droneIcon}>✈</span>
                </div>
                <span className={styles.liveIndicator}>Live</span>
              </div>

              {/* Destination */}
              <div className={styles.destinationMarker}>
                <div className={styles.redMarker}>📍</div>
                <span className={styles.markerLabel}>Destination</span>
              </div>

              {/* Flight Path */}
              <svg className={styles.flightPath}>
                <path 
                  d="M 100 400 Q 300 200 600 350" 
                  stroke="#60A5FA" 
                  strokeWidth="2" 
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>

            {/* Map Legend */}
            <div className={styles.mapLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#3B82F6' }}></span>
                <span>Warehouse</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#10B981' }}></span>
                <span>Drone (Live)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#EF4444' }}></span>
                <span>Destination</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendLine}></span>
                <span>Flight Path</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className={styles.timelineSection}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🕐</span>
            Delivery Timeline
          </h3>
          <div className={styles.timeline}>
            {deliveryTimeline.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={`${styles.timelineMarker} ${item.completed ? styles.completed : styles.pending} ${item.current ? styles.current : ''}`}>
                  {item.completed ? '●' : '○'}
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineStep}>{item.step}</div>
                  <div className={styles.timelineTime}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section Grid */}
      <div className={styles.bottomContent}>
        {/* Delivery Details */}
        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📋</span>
            Delivery Details
          </h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Order ID</span>
              <span className={styles.detailValue}>{deliveryDetails.orderId}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Drone ID</span>
              <span className={styles.detailValue}>{deliveryDetails.droneId}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Package Weight</span>
              <span className={styles.detailValue}>{deliveryDetails.packageWeight}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Distance Remaining</span>
              <span className={styles.detailValue}>{deliveryDetails.distanceRemaining}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Estimated Arrival</span>
              <div className={styles.arrivalInfo}>
                <span className={styles.arrivalTime}>{deliveryDetails.estimatedArrival}</span>
                <span className={styles.remainingTime}>{deliveryDetails.minutesRemaining}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className={styles.customerSection}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>👤</span>
            Customer Information
          </h3>
          <div className={styles.customerContent}>
            <div className={styles.addressSection}>
              <div className={styles.addressLabel}>
                <span className={styles.addressIcon}>📍</span>
                Delivery Address
              </div>
              <div className={styles.addressValue}>{customerInfo.address}</div>
            </div>

            <div className={styles.customerActions}>
              <div className={styles.actionsLabel}>Customer Actions</div>
              <div className={styles.actionButtons}>
                <button className={styles.actionBtn} onClick={handleCallCustomer}>
                  <span className={styles.btnIcon}>📞</span>
                  Call Customer
                </button>
                <button className={styles.actionBtn} onClick={handleSendMessage}>
                  <span className={styles.btnIcon}>💬</span>
                  Send Message
                </button>
                <button className={styles.actionBtn} onClick={handleShareLocation}>
                  <span className={styles.btnIcon}>📡</span>
                  Share Live Location
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
