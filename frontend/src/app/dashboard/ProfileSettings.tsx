"use client";
import { useState } from "react";
import styles from "./dashboard.module.css";
import Image from "next/image";

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA"
  });

  // Mock data
  const [profileData, setProfileData] = useState({
    name: "Sarah Johnson",
    membershipTier: "Premium Explorer",
    memberSince: "March 2024",
    avatar: "/default-profile.png",
    totalOrders: 42,
    moneySaved: "$2340",
    co2Offset: "156kg",
    favoriteTime: "2:30 PM"
  });

  const weeklyStats = {
    deliveries: 8,
    changeFromLastWeek: "+25%",
    avgDeliveryTime: "18 minutes",
    timeDifference: "3 min faster than avg",
    rewardPoints: 2450,
    pointsUntilNextReward: "550 until next reward"
  };

  const recentActivity = [
    {
      icon: "📦",
      title: "Medical supplies delivered",
      subtitle: "Delivered in 15 minutes • 2 hours ago",
      status: "Completed",
      color: "#10B981"
    },
    {
      icon: "🏆",
      title: "Achievement unlocked: Eco Warrior",
      subtitle: "You've offset 100kg of CO₂ • 1 day ago",
      status: "New",
      color: "#3B82F6"
    },
    {
      icon: "👑",
      title: "Membership tier upgraded",
      subtitle: "Welcome to Gold tier! • 3 days ago",
      status: "Milestone",
      color: "#8B5CF6"
    }
  ];

  const handleEditProfile = () => {
    setEditFormData({
      name: profileData.name,
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA"
    });
    setShowEditModal(true);
  };

  const handleSaveChanges = () => {
    setProfileData(prev => ({
      ...prev,
      name: editFormData.name
    }));
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Achievements data
  const achievements = [
    {
      icon: "⚡",
      title: "Speed Demon",
      description: "Complete 50 fast deliveries",
      progress: 100,
      status: "Unlocked",
      unlockedDate: "Dec 15, 2024",
      color: "#10B981"
    },
    {
      icon: "💚",
      title: "Eco Warrior",
      description: "Offset 100kg of carbon emissions",
      progress: 100,
      status: "Unlocked",
      unlockedDate: "Jan 8, 2025",
      color: "#10B981"
    },
    {
      icon: "⭐",
      title: "Loyal Customer",
      description: "Complete 100 orders",
      progress: 42,
      status: "In Progress",
      color: "#6B7280"
    },
    {
      icon: "🌙",
      title: "Night Owl",
      description: "Order 20 evening deliveries",
      progress: 85,
      status: "In Progress",
      color: "#6B7280"
    },
    {
      icon: "🚀",
      title: "Explorer",
      description: "Try 10 different delivery zones",
      progress: 70,
      status: "In Progress",
      color: "#6B7280"
    },
    {
      icon: "👥",
      title: "Community Hero",
      description: "Refer 5 friends",
      progress: 60,
      status: "In Progress",
      color: "#6B7280"
    }
  ];

  // Membership tiers data
  const membershipTiers = [
    {
      name: "Silver Explorer",
      range: "0-10 orders",
      icon: "🥈",
      active: false
    },
    {
      name: "Gold Premium",
      range: "11-50 orders (Current)",
      icon: "🥇",
      active: true
    },
    {
      name: "Diamond Elite",
      range: "51-100 orders",
      icon: "💎",
      active: false
    },
    {
      name: "Platinum Legend",
      range: "100+ orders",
      icon: "👑",
      active: false
    }
  ];

  const membershipBenefits = [
    { name: "Priority Delivery", available: true },
    { name: "Premium Support", available: true },
    { name: "20% Faster Service", available: true },
    { name: "Exclusive Deals", available: true },
    { name: "Carbon Offset", available: false },
    { name: "VIP Events", available: false }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'achievements':
        return (
          <div className={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <div key={index} className={styles.achievementCard}>
                <div className={styles.achievementHeader}>
                  <div className={styles.achievementIcon} style={{ color: achievement.color }}>
                    {achievement.icon}
                  </div>
                  <div className={styles.achievementInfo}>
                    <h4 className={styles.achievementTitle}>{achievement.title}</h4>
                    {achievement.status === "Unlocked" && (
                      <span className={styles.unlockedBadge}>✓ Unlocked</span>
                    )}
                  </div>
                </div>
                <p className={styles.achievementDescription}>{achievement.description}</p>
                <div className={styles.achievementProgress}>
                  <div className={styles.progressLabel}>Progress</div>
                  <div className={styles.progressValue}>{achievement.progress}%</div>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${achievement.progress}%`,
                      backgroundColor: achievement.color
                    }}
                  ></div>
                </div>
                {achievement.unlockedDate && (
                  <div className={styles.unlockedDate}>Unlocked on {achievement.unlockedDate}</div>
                )}
              </div>
            ))}
          </div>
        );

      case 'activity':
        return (
          <div className={styles.activityTabContent}>
            <div className={styles.activityChartsGrid}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Monthly Orders & Savings</h3>
                <p className={styles.chartSubtitle}>Your delivery activity over the past 6 months</p>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.barChart}>
                    {[
                      { month: 'Aug', orders: 95, savings: 120 },
                      { month: 'Sep', orders: 180, savings: 85 },
                      { month: 'Oct', orders: 220, savings: 110 },
                      { month: 'Nov', orders: 270, savings: 90 },
                      { month: 'Dec', orders: 320, savings: 140 },
                      { month: 'Jan', orders: 380, savings: 160 }
                    ].map((data, index) => (
                      <div key={index} className={styles.barGroup}>
                        <div className={styles.barContainer}>
                          <div 
                            className={styles.ordersBar} 
                            style={{ height: `${(data.orders / 400) * 100}%` }}
                          ></div>
                          <div 
                            className={styles.savingsBar} 
                            style={{ height: `${(data.savings / 400) * 100}%` }}
                          ></div>
                        </div>
                        <div className={styles.barLabel}>{data.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Weekly Activity</h3>
                <p className={styles.chartSubtitle}>Deliveries by day of the week</p>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.lineChart}>
                    <svg width="100%" height="200" viewBox="0 0 400 200">
                      <path 
                        d="M 20 160 L 80 120 L 140 100 L 200 80 L 260 60 L 320 100 L 380 140" 
                        stroke="#6366f1" 
                        strokeWidth="3" 
                        fill="none"
                      />
                      {[
                        { x: 20, y: 160, label: 'Mon' },
                        { x: 80, y: 120, label: 'Tue' },
                        { x: 140, y: 100, label: 'Wed' },
                        { x: 200, y: 80, label: 'Thu' },
                        { x: 260, y: 60, label: 'Fri' },
                        { x: 320, y: 100, label: 'Sat' },
                        { x: 380, y: 140, label: 'Sun' }
                      ].map((point, index) => (
                        <g key={index}>
                          <circle cx={point.x} cy={point.y} r="4" fill="#6366f1" />
                          <text x={point.x} y="190" textAnchor="middle" fontSize="12" fill="#6b7280">
                            {point.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.activityBottomGrid}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Delivery Time Preferences</h3>
                <p className={styles.chartSubtitle}>When you prefer to receive deliveries</p>
                <div className={styles.pieChartContainer}>
                  <div className={styles.pieChart}>
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="80" fill="#6366f1" strokeDasharray="75.4 251.3" strokeDashoffset="0" />
                      <circle cx="100" cy="100" r="80" fill="#10b981" strokeDasharray="113.1 251.3" strokeDashoffset="-75.4" />
                      <circle cx="100" cy="100" r="80" fill="#f59e0b" strokeDasharray="62.8 251.3" strokeDashoffset="-188.5" />
                    </svg>
                  </div>
                  <div className={styles.pieLabels}>
                    <div className={styles.pieLabel}>
                      <span className={styles.pieDot} style={{ backgroundColor: '#6366f1' }}></span>
                      Morning 30%
                    </div>
                    <div className={styles.pieLabel}>
                      <span className={styles.pieDot} style={{ backgroundColor: '#10b981' }}></span>
                      Afternoon 45%
                    </div>
                    <div className={styles.pieLabel}>
                      <span className={styles.pieDot} style={{ backgroundColor: '#f59e0b' }}></span>
                      Evening 25%
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Activity Summary</h3>
                <p className={styles.chartSubtitle}>Your delivery patterns and milestones</p>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryValue} style={{ color: '#3b82f6' }}>42</div>
                    <div className={styles.summaryLabel}>Total Orders</div>
                  </div>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryValue} style={{ color: '#10b981' }}>18m</div>
                    <div className={styles.summaryLabel}>Avg. Delivery</div>
                  </div>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryValue} style={{ color: '#8b5cf6' }}>156kg</div>
                    <div className={styles.summaryLabel}>CO₂ Saved</div>
                  </div>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryValue} style={{ color: '#f59e0b' }}>98%</div>
                    <div className={styles.summaryLabel}>Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'membership':
        return (
          <div className={styles.membershipTabContent}>
            <div className={styles.membershipGrid}>
              <div className={styles.membershipCard}>
                <div className={styles.membershipHeader}>
                  <div className={styles.membershipIcon}>👑</div>
                  <div>
                    <h3 className={styles.membershipCurrentTitle}>Premium Explorer</h3>
                    <p className={styles.membershipProgress}>You&apos;re 75% of the way to Diamond Elite</p>
                  </div>
                </div>
                
                <div className={styles.membershipProgressSection}>
                  <div className={styles.progressLabel}>Progress to Diamond Elite</div>
                  <div className={styles.progressValue}>75%</div>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '75%' }}></div>
                </div>
                <p className={styles.membershipSubtext}>Complete 8 more orders to unlock Diamond Elite benefits</p>

                <div className={styles.membershipStats}>
                  <div className={styles.membershipStat}>
                    <div className={styles.statValue} style={{ color: '#1f2937' }}>2,450</div>
                    <div className={styles.statLabel}>Reward Points</div>
                  </div>
                  <div className={styles.membershipStat}>
                    <div className={styles.statValue} style={{ color: '#10b981' }}>$2,340</div>
                    <div className={styles.statLabel}>Total Savings</div>
                  </div>
                </div>

                <div className={styles.membershipBenefits}>
                  <h4 className={styles.benefitsTitle}>Your Benefits</h4>
                  <div className={styles.benefitsList}>
                    {membershipBenefits.map((benefit, index) => (
                      <div key={index} className={styles.benefitItem}>
                        <span className={benefit.available ? styles.benefitAvailable : styles.benefitUnavailable}>
                          {benefit.available ? '●' : '○'}
                        </span>
                        <span className={benefit.available ? styles.benefitTextAvailable : styles.benefitTextUnavailable}>
                          {benefit.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.membershipTiersCard}>
                <h3 className={styles.sectionTitle}>Membership Tiers</h3>
                <p className={styles.sectionSubtitle}>Unlock more benefits as you fly</p>
                
                <div className={styles.tiersList}>
                  {membershipTiers.map((tier, index) => (
                    <div key={index} className={`${styles.tierItem} ${tier.active ? styles.tierActive : ''}`}>
                      <div className={styles.tierIcon}>{tier.icon}</div>
                      <div className={styles.tierInfo}>
                        <div className={styles.tierName}>{tier.name}</div>
                        <div className={styles.tierRange}>{tier.range}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.overviewContent}>
            {/* Weekly Stats Cards */}
            <div className={styles.weeklyStatsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                  <div className={styles.statCardIcon}>⏰</div>
                  <div className={styles.statCardTitle}>This Week</div>
                </div>
                <div className={styles.statCardValue}>{weeklyStats.deliveries} deliveries</div>
                <div className={styles.statCardSubtext}>{weeklyStats.changeFromLastWeek} from last week</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '65%' }}></div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                  <div className={styles.statCardIcon}>🚀</div>
                  <div className={styles.statCardTitle}>Avg. Delivery Time</div>
                </div>
                <div className={styles.statCardValue}>{weeklyStats.avgDeliveryTime}</div>
                <div className={styles.statCardSubtext}>{weeklyStats.timeDifference}</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                  <div className={styles.statCardIcon}>🎁</div>
                  <div className={styles.statCardTitle}>Rewards Points</div>
                </div>
                <div className={styles.statCardValue}>{weeklyStats.rewardPoints} pts</div>
                <div className={styles.statCardSubtext}>{weeklyStats.pointsUntilNextReward}</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className={styles.activitySection}>
              <div className={styles.activityHeader}>
                <h3 className={styles.sectionTitle}>Recent Activity</h3>
                <p className={styles.sectionSubtitle}>Your latest drone deliveries and interactions</p>
              </div>

              <div className={styles.activityList}>
                {recentActivity.map((activity, index) => (
                  <div key={index} className={styles.activityItem}>
                    <div className={styles.activityIconContainer} style={{ backgroundColor: activity.color }}>
                      <span className={styles.activityIcon}>{activity.icon}</span>
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>{activity.title}</div>
                      <div className={styles.activitySubtitle}>{activity.subtitle}</div>
                    </div>
                    <div className={styles.activityStatus}>
                      <span 
                        className={styles.statusBadge} 
                        style={{ backgroundColor: activity.color }}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.profileContainer}>
      {/* Hero Section */}
      <div className={styles.profileHero}>
        <div className={styles.heroContent}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              <Image
                src={profileData.avatar}
                alt="Profile"
                className={styles.heroAvatar}
                width={120}
                height={120}
                unoptimized
              />
              <div className={styles.membershipBadge}>😊</div>
            </div>
          </div>
          
          <div className={styles.profileInfo}>
            <div className={styles.nameSection}>
              <h1 className={styles.profileName}>{profileData.name}</h1>
              <span className={styles.membershipTier}>{profileData.membershipTier}</span>
            </div>
            <p className={styles.memberSince}>Flying with us since {profileData.memberSince}</p>
          </div>
        </div>

        <button className={styles.editProfileBtn} onClick={handleEditProfile}>
          ✏️ Edit Profile
        </button>

        {/* Stats Row */}
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <div className={styles.statNumber}>{profileData.totalOrders}</div>
            <div className={styles.statLabel}>Total Orders</div>
          </div>
          <div className={styles.heroStat}>
            <div className={styles.statNumber}>{profileData.moneySaved}</div>
            <div className={styles.statLabel}>Money Saved</div>
          </div>
          <div className={styles.heroStat}>
            <div className={styles.statNumber}>{profileData.co2Offset}</div>
            <div className={styles.statLabel}>CO₂ Offset</div>
          </div>
          <div className={styles.heroStat}>
            <div className={styles.statNumber}>{profileData.favoriteTime}</div>
            <div className={styles.statLabel}>Favorite Time</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.profileTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          🌐 Overview
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'achievements' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'activity' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          📈 Activity
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'membership' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('membership')}
        >
          👑 Membership
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Profile Information</h2>
              <button 
                className={styles.modalCloseBtn}
                onClick={handleCancelEdit}
              >
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={editFormData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={editFormData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Location</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={editFormData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.saveButton}
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button 
                className={styles.cancelButton}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
