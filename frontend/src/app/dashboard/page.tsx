
"use client";
import React from 'react';
import ResponsiveLayout from './support/responsive-layout';
import styles from './dashboard-home.module.css';

export default function DashboardPage() {
  return (
    <ResponsiveLayout>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <div className={styles.badge}>
                📦 Now delivering in 50+ cities
              </div>
              <h1 className={styles.heroTitle}>
                Lightning-fast drone delivery to your <span className={styles.highlight}>doorstep</span>
              </h1>
              <p className={styles.heroDescription}>
                Get your packages delivered in minutes, not hours. Our advanced drone fleet ensures safe, fast, and eco-friendly delivery across the city.
              </p>
              
              <div className={styles.deliveryForm}>
                <div className={styles.formHeader}>
                  <div className={styles.formIcon}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2L13.09 8.26L22 9L13.09 9.74L10 16L6.91 9.74L2 9L6.91 8.26L10 2Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className={styles.formTitle}>Quick Delivery</h3>
                </div>
                
                <div className={styles.formFields}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>From</label>
                    <div className={styles.inputWrapper}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 8C9.1 8 10 7.1 10 6C10 4.9 9.1 4 8 4C6.9 4 6 4.9 6 6C6 7.1 6.9 8 8 8ZM8 2C10.2 2 12 3.8 12 6C12 8.2 8 14 8 14S4 8.2 4 6C4 3.8 5.8 2 8 2Z" fill="#999"/>
                      </svg>
                      <input type="text" placeholder="Pickup location" className={styles.input} />
                    </div>
                  </div>
                  
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>To</label>
                    <div className={styles.inputWrapper}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 8C9.1 8 10 7.1 10 6C10 4.9 9.1 4 8 4C6.9 4 6 4.9 6 6C6 7.1 6.9 8 8 8ZM8 2C10.2 2 12 3.8 12 6C12 8.2 8 14 8 14S4 8.2 4 6C4 3.8 5.8 2 8 2Z" fill="#999"/>
                      </svg>
                      <input type="text" placeholder="Delivery address" className={styles.input} />
                    </div>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button className={styles.bookBtn}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Book Delivery
                  </button>
                  <button className={styles.trackBtn}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Track
                  </button>
                </div>
              </div>
            </div>
            
            <div className={styles.heroRight}>
              <div className={styles.heroImage}>
                <div className={styles.deliveryTime}>
                  <span className={styles.timeValue}>18m</span>
                  <span className={styles.timeLabel}>Avg. Delivery</span>
                </div>
                <div className={styles.droneStatus}>
                  <span className={styles.statusIndicator}></span>
                  <span className={styles.statusText}>24 Drones Active</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.stats}>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>24</div>
              <div className={styles.statLabel}>Active Drones</div>
              <div className={styles.statChange}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L10 6H8V10H4V6H2L6 2Z" fill="#10B981"/>
                </svg>
                +3
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValue}>156</div>
              <div className={styles.statLabel}>Deliveries Today</div>
              <div className={styles.statChange}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L10 6H8V10H4V6H2L6 2Z" fill="#10B981"/>
                </svg>
                +12%
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValue}>18m</div>
              <div className={styles.statLabel}>Avg. Delivery Time</div>
              <div className={styles.statChange}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10L2 6H4V2H8V6H10L6 10Z" fill="#10B981"/>
                </svg>
                -2m
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValue}>99.2%</div>
              <div className={styles.statLabel}>Success Rate</div>
              <div className={styles.statChange}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L10 6H8V10H4V6H2L6 2Z" fill="#10B981"/>
                </svg>
                +0.1%
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.featuresContainer}>
            <div className={styles.featuresHeader}>
              <h2 className={styles.featuresTitle}>Why Choose Aero Deliver?</h2>
              <p className={styles.featuresSubtitle}>Experience the future of package delivery</p>
            </div>
            
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{backgroundColor: '#FEF3C7'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F59E0B"/>
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Lightning Fast</h3>
                <p className={styles.featureDescription}>Average delivery time of 18 minutes</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{backgroundColor: '#D1FAE5'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#10B981" strokeWidth="2"/>
                    <path d="M9 12L11 14L15 10" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Ultra Safe</h3>
                <p className={styles.featureDescription}>Advanced GPS tracking & secure delivery</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{backgroundColor: '#FEE2E2'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61C19.32 3.1 17.32 3 15.81 4.51L9.07 11.25C8.68 11.64 8.68 12.27 9.07 12.66C9.46 13.05 10.09 13.05 10.48 12.66L17.22 5.92C17.61 5.53 18.24 5.53 18.63 5.92C19.02 6.31 19.02 6.94 18.63 7.33L11.89 14.07C11.5 14.46 11.5 15.09 11.89 15.48C12.28 15.87 12.91 15.87 13.3 15.48L20.04 8.74C21.55 7.23 21.45 5.23 20.84 4.61Z" fill="#EF4444"/>
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Eco-Friendly</h3>
                <p className={styles.featureDescription}>Zero emissions, carbon neutral delivery</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{backgroundColor: '#DBEAFE'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2"/>
                    <path d="M12 6V12L16 14" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>24/7 Service</h3>
                <p className={styles.featureDescription}>Round-the-clock availability</p>
              </div>
            </div>
          </div>
        </section>

        {/* Activity and Flight Conditions */}
        <section className={styles.activity}>
          <div className={styles.activityContainer}>
            <div className={styles.activityLeft}>
              <div className={styles.activityCard}>
                <div className={styles.activityHeader}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <h3 className={styles.activityTitle}>Recent Activity</h3>
                </div>
                
                <div className={styles.activityList}>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon} style={{backgroundColor: '#D1FAE5'}}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5 6L6.5 13L2.5 9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>Medical supplies delivered to Central Hospital</p>
                      <span className={styles.activityTime}>2 min ago</span>
                    </div>
                  </div>
                  
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon} style={{backgroundColor: '#FEF3C7'}}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1L10.09 5.26L15 6L11 9.74L12.18 14.74L8 12.27L3.82 14.74L5 9.74L1 6L5.91 5.26L8 1Z" fill="#F59E0B"/>
                      </svg>
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>You&apos;ve unlocked the Speed Demon achievement!</p>
                      <span className={styles.activityTime}>1 hour ago</span>
                      <span className={styles.activityBadge}>New</span>
                    </div>
                  </div>
                  
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon} style={{backgroundColor: '#DBEAFE'}}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1L10.09 5.26L15 6L11 9.74L12.18 14.74L8 12.27L3.82 14.74L5 9.74L1 6L5.91 5.26L8 1Z" fill="#3B82F6"/>
                      </svg>
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>New express delivery scheduled for 3:30 PM</p>
                      <span className={styles.activityTime}>2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.activityRight}>
              <div className={styles.flightCard}>
                <div className={styles.flightHeader}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10L7 5V8H18V12H7V15L2 10Z" fill="currentColor"/>
                  </svg>
                  <h3 className={styles.flightTitle}>Flight Conditions</h3>
                </div>
                
                <div className={styles.flightStatus}>
                  <span className={styles.flightCondition}>Excellent</span>
                  <span className={styles.flightDescription}>Perfect flying weather</span>
                </div>
                
                <div className={styles.flightDetails}>
                  <div className={styles.flightDetail}>
                    <div className={styles.detailIcon}>🌡️</div>
                    <span className={styles.detailLabel}>Temperature</span>
                    <span className={styles.detailValue}>22°C</span>
                  </div>
                  
                  <div className={styles.flightDetail}>
                    <div className={styles.detailIcon}>💨</div>
                    <span className={styles.detailLabel}>Wind Speed</span>
                    <span className={styles.detailValue}>8 km/h</span>
                  </div>
                  
                  <div className={styles.flightDetail}>
                    <div className={styles.detailIcon}>🟢</div>
                    <span className={styles.detailLabel}>Fleet Status</span>
                    <span className={styles.detailValue} style={{color: '#10B981'}}>24/26 Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promo Section */}
        <section className={styles.promo}>
          <div className={styles.promoContainer}>
            <div className={styles.promoContent}>
              <div className={styles.promoIcon}>🎁</div>
              <div className={styles.promoText}>
                <h3 className={styles.promoTitle}>Limited Time Offer</h3>
                <p className={styles.promoDescription}>Get 50% off your first 3 deliveries with code AEROFAST50</p>
              </div>
              <button className={styles.promoBtn}>
                Claim Offer
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
}
